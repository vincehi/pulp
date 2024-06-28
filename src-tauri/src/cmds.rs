use std::path::Path;
use std::process::Command;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

use prisma_client_rust::operator::or;
use prisma_client_rust::prisma_errors::query_engine::UniqueKeyViolation;
use prisma_client_rust::{and, Direction};
use tauri::Manager;
use walkdir::WalkDir;

use crate::prisma_main_client::{directory, file};
use crate::utils::app::AppState;
use crate::utils::audio_utils::get_audio_metadata;
#[derive(Clone, serde::Serialize)]
struct Payload {
  processing: bool,
  file: Option<String>,
}

#[tauri::command]
pub async fn create_directory(
  path_dir: String,
  state: tauri::State<'_, AppState>,
) -> Result<directory::Data, String> {
  let path = Path::new(&path_dir);
  let directory_name = path
    .file_name()
    .and_then(|name| name.to_str())
    .ok_or_else(|| "Nom de répertoire invalide".to_string())?;

  return match state
    .prisma_client
    .directory()
    .create(
      path.to_string_lossy().into_owned(),
      directory_name.to_string(),
      true,
      vec![],
    )
    .exec()
    .await
  {
    Ok(directory) => Ok(directory),
    Err(error) if error.is_prisma_error::<UniqueKeyViolation>() => {
      Err(format!("{} existe déjà", directory_name))
    }
    Err(_error) => Err("Une erreur s'est produite".to_string()),
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
  skip: i64,
  state: tauri::State<'_, AppState>,
) -> Result<std::vec::Vec<file::Data>, String> {
  let query = state
    .prisma_client
    .file()
    .find_many(vec![
      or(
        paths
          .into_iter()
          .map(|path| file::path::starts_with(path))
          .collect(),
      ),
      and![file::name::contains(search.to_string())],
    ])
    .order_by(file::path::order(Direction::Asc));

  // if let Some(path) = cursor_path {
  //   query = query.cursor(file::path::equals(path)).skip(1)
  // }
  // if let Some(s) = skip {
  //   query = query.skip(s)
  // }

  return match query.skip(skip).take(20).exec().await {
    Ok(files) => Ok(files),
    Err(e) => Err(e.to_string()),
  };
}

#[derive(serde::Serialize)]
pub struct FileMetadata {
  pub total_count: u64,
}

#[tauri::command]
pub async fn get_search_files_metadata(
  paths: Vec<String>,
  search: String,
  state: tauri::State<'_, AppState>,
) -> Result<FileMetadata, prisma_client_rust::QueryError> {
  state
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

      let files = tx
        .file()
        .find_many(file_where)
        .order_by(file::path::order(Direction::Asc))
        .exec()
        .await?;

      Ok(FileMetadata {
        total_count: files.len() as u64,
      })
    })
    .await
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
    use std::fs::metadata;
    use std::path::PathBuf;
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
pub async fn scan_directory(
  app_handle: tauri::AppHandle,
  path_dir: String,
  state: tauri::State<'_, AppState>,
) -> Result<(), String> {
  use std::path::Path;

  let path = Path::new(&path_dir);
  if !path.exists() {
    return Err(format!("Le répertoire n'existe pas : {}", path_dir));
  }

  let files = WalkDir::new(path)
    .into_iter()
    .filter_map(|e| e.ok())
    .filter(|entry| {
      entry.file_type().is_file()
        && entry
          .path()
          .extension()
          .map_or(false, |ext| ext.eq("wav") || ext.eq("mp3"))
    })
    .collect::<Vec<_>>();

  if files.is_empty() {
    return Err(format!(
      "Aucun fichier trouvé dans le répertoire : {}",
      path_dir
    ));
  }

  let mut result = Vec::with_capacity(files.len());

  let stop_flag = Arc::new(AtomicBool::new(false));
  let stop_flag_clone = stop_flag.clone();

  app_handle.once_global("stop-analyze-directory-files".to_string(), move |_| {
    stop_flag_clone.store(true, Ordering::SeqCst);
  });

  let mut iter = files.into_iter();
  while let Some(path_file) = iter.next() {
    if stop_flag.load(Ordering::SeqCst) {
      println!("Analyse arrêtée par l'utilisateur.");
      break;
    }
    let last_part = path_file
      .file_name()
      .to_str()
      .ok_or_else(|| format!("Nom de fichier invalide : {:?}", path_file.file_name()))?;

    app_handle
      .emit_all(
        "analyze-directory-files",
        Payload {
          processing: true,
          file: Some(path_file.file_name().to_string_lossy().to_string()),
        },
      )
      .unwrap();

    let path_str = path_file.path().to_str().ok_or_else(|| {
      format!(
        "Impossible de convertir le chemin en chaîne de caractères : {:?}",
        path_file.path()
      )
    })?;

    let audio_metadata = match get_audio_metadata(path_str.to_string()).await {
      Ok(metadata) => metadata,
      Err(e) => return Err(e.to_string()),
    };

    let file_creation = state
      .prisma_client
      .file()
      .create(
        path_file.path().display().to_string(),
        last_part.to_string(),
        directory::path::equals(path_dir.clone()),
        vec![
          file::duration::set(Some(audio_metadata.duration_milliseconds as i32)),
          file::channels::set(Some(audio_metadata.channels as i32)),
          file::bitrate::set(Some(audio_metadata.bitrate as i32)),
          file::sample_rate::set(Some(audio_metadata.sample_rate as i32)),
        ],
      )
      .exec()
      .await;

    match file_creation {
      Ok(file) => result.push(file),
      Err(error) if error.is_prisma_error::<UniqueKeyViolation>() => {
        return Err(format!("Le fichier existe déjà : {}", last_part))
      }
      Err(error) => {
        return Err(format!(
          "Erreur lors de la création du fichier '{}': {}",
          last_part,
          error.to_string()
        ))
      }
    }
  }

  app_handle
    .emit_all(
      "analyze-directory-files",
      Payload {
        processing: false,
        file: None,
      },
    )
    .unwrap();

  if result.is_empty() {
    return Err(format!(
      "Aucun fichier audio trouvé dans le répertoire : {}",
      path_dir
    ));
  }

  Ok(())
}
