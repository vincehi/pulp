use crate::prisma_main_client::{directory, file};
use crate::utils::app::AppState;
use crate::utils::extractor_music::extractor_music;
use prisma_client_rust::and;
use prisma_client_rust::operator::or;
use prisma_client_rust::prisma_errors::query_engine::UniqueKeyViolation;
use serde_json::Value;
use std::process::Command;
use tauri::Manager;
use walkdir::WalkDir;

#[tauri::command]
pub async fn create_directory(
  path_dir: String,
  state: tauri::State<'_, AppState>,
) -> Result<directory::Data, String> {
  let parts = path_dir.split("/").collect::<Vec<&str>>();
  let last_part = parts[parts.len() - 1];
  return match state
    .prisma_client
    .directory()
    .create(path_dir.to_string(), last_part.to_string(), true, vec![])
    .exec()
    .await
  {
    Ok(directory) => Ok(directory),
    Err(error) if error.is_prisma_error::<UniqueKeyViolation>() => {
      Err(last_part.to_string() + " already exists")
    }
    Err(_error) => Err("An error occurred".to_string()),
  };
}

#[tauri::command]
pub async fn delete_directory(
  path_dir: String,
  state: tauri::State<'_, AppState>,
) -> Result<directory::Data, String> {
  return match state
    .prisma_client
    .file()
    .delete_many(vec![file::directory_path::equals(path_dir.to_string())])
    .exec()
    .await
  {
    Ok(_file_deleted_cout) => {
      match state
        .prisma_client
        .directory()
        .delete(directory::path::equals(path_dir))
        .exec()
        .await
      {
        Ok(directory) => Ok(directory),
        Err(_error) => Err("An error occurred".to_string()),
      }
    }
    Err(_error) => Err("An error occurred".to_string()),
  };
}

#[tauri::command]
pub async fn get_all_directories(
  state: tauri::State<'_, AppState>,
) -> Result<Vec<directory::Data>, String> {
  return match state
    .prisma_client
    .directory()
    .find_many(vec![])
    .exec()
    .await
  {
    Ok(directory) => Ok(directory),
    Err(e) => Err(e.to_string()),
  };
}

#[derive(serde::Serialize)]
pub struct QueryResult {
  contents: Vec<file::Data>,
  metadata: Metadata,
}

#[derive(serde::Serialize)]
pub struct Metadata {
  total_count: i64,
}

#[tauri::command]
pub async fn get_directory_files(
  paths: Vec<String>,
  search: String,
  cursor_path: Option<String>,
  state: tauri::State<'_, AppState>,
) -> Result<QueryResult, String> {
  let result = state
    .prisma_client
    ._transaction()
    .run(|tx| async move {
      let file_where = vec![
        or(
          paths
            .into_iter()
            .map(|path| file::path::starts_with(path))
            .collect(),
        ),
        and![file::name::contains(search.to_string())],
      ];

      let mut query = tx.file().find_many(file_where.clone().to_vec());

      if let Some(path) = cursor_path {
        query = query.cursor(file::path::equals(path)).skip(1);
      }

      let total_count = tx.file().count(file_where.clone().to_vec()).exec().await?;

      query.take(20).exec().await.map(|files| {
        (QueryResult {
          contents: files,
          metadata: (Metadata { total_count }),
        })
      })
    })
    .await
    .map_err(|e| e.to_string())?;
  Ok(result)
}

#[tauri::command]
pub async fn open_in_finder(path: String) {
  #[cfg(target_os = "windows")]
  {
    Command::new("explorer")
      .args(["/select,", &path]) // The comma after select is not a typo
      .spawn()
      .unwrap();
  }

  #[cfg(target_os = "linux")]
  {
    if path.contains(",") {
      // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
      let new_path = match metadata(&path).unwrap().is_dir() {
        true => path,
        false => {
          let mut path2 = PathBuf::from(path);
          path2.pop();
          path2.into_os_string().into_string().unwrap()
        }
      };
      Command::new("xdg-open").arg(&new_path).spawn().unwrap();
    } else {
      Command::new("dbus-send")
        .args([
          "--session",
          "--dest=org.freedesktop.FileManager1",
          "--type=method_call",
          "/org/freedesktop/FileManager1",
          "org.freedesktop.FileManager1.ShowItems",
          format!("array:string:\"file://{path}\"").as_str(),
          "string:\"\"",
        ])
        .spawn()
        .unwrap();
    }
  }

  #[cfg(target_os = "macos")]
  {
    Command::new("open").args(["-R", &path]).spawn().unwrap();
  }
}

#[tauri::command]
pub async fn analyze_file(
  app_handle: &tauri::AppHandle,
  path_dir: String,
) -> Result<Value, std::io::Error> {
  let mut output_path = app_handle.path_resolver().app_data_dir().unwrap();
  output_path.push("extractor_music.temp.json");

  extractor_music(path_dir, output_path.to_string_lossy().to_string()).await
}

#[derive(Clone, serde::Serialize)]
struct Payload {
  processing: bool,
  file: Option<String>,
}

#[tauri::command]
pub async fn scan_directory(
  app_handle: tauri::AppHandle,
  path_dir: String,
  state: tauri::State<'_, AppState>,
) -> Result<Vec<file::Data>, String> {
  let path_dir_string = path_dir.to_string();
  let walk_dir = match WalkDir::new(&path_dir)
    .into_iter()
    .filter_map(|e| e.ok())
    .collect::<Vec<_>>()
  {
    v if !v.is_empty() => v,
    _ => return Err(format!("No file found in directory: {}", path_dir)),
  };

  let mut result = Vec::with_capacity(walk_dir.len());

  for path_file in walk_dir {
    if let Some(ext) = path_file.path().extension() {
      if ext == "wav" || ext == "mp3" {
        let path = path_file.path().display().to_string();
        let last_part = match path_file.file_name().to_str() {
          Some(s) => s.to_string(),
          None => return Err(format!("Invalid file name: {:?}", path_file.file_name())),
        };

        app_handle
          .emit_all(
            "event-walk-directory",
            Payload {
              processing: true,
              file: Some(last_part.clone()),
            },
          )
          .unwrap();

        match analyze_file(&app_handle, path.clone()).await {
          Ok(output) => {
            match state
              .prisma_client
              .file()
              .create(
                path,
                last_part.to_string(),
                directory::path::equals(path_dir_string.clone()),
                output["rhythm"]["bpm"].as_f64().unwrap(),
                output["rhythm"]["danceability"].as_f64().unwrap(),
                output["tonal"]["chords_key"].as_str().unwrap().to_owned(),
                output["tonal"]["chords_scale"].as_str().unwrap().to_owned(),
                vec![],
              )
              .exec()
              .await
            {
              Ok(file) => result.push(file),
              Err(error) if error.is_prisma_error::<UniqueKeyViolation>() => {
                return Err(format!("File already exists: {}", last_part))
              }
              Err(error) => {
                return Err(format!(
                  "Error creating file '{}': {}",
                  last_part,
                  error.to_string()
                ))
              }
            }
          }
          Err(error) => return Err(format!("Erreur : {:?}", error)),
        }
      }
    }
  }

  app_handle
    .emit_all(
      "event-walk-directory",
      Payload {
        processing: false,
        file: None,
      },
    )
    .unwrap();

  if result.is_empty() {
    return Err(format!("No audio files found in directory: {}", path_dir));
  }

  Ok(result)
}
