use std::path::Path;

use lofty::{config::ParseOptions, file::AudioFile, probe::Probe};

// extern crate taglib;

// pub async fn extract_audio_files<F>(
//   dir: &str,
//   mut callback: F,
// ) -> Result<(), Box<dyn std::error::Error>>
// where
//   F: FnMut(&str),
// {
//   for entry in WalkDir::new(dir).into_iter().filter_map(|e| e.ok()) {
//     if let Some(ext) = entry.path().extension() {
//       if ext == "wav" || ext == "mp3" {
//         let path = entry.path().display().to_string();
//         callback(&path);
//       }
//     }
//   }
//   Ok(())
// }

// #[tauri::command]
// pub async fn analyze_file(
//   app_handle: tauri::AppHandle,
//   path_file: String,
//   state: tauri::State<'_, AppState>,
// ) -> Result<file::Data, String> {
//   // Créer le répertoire temporaire s'il n'existe pas encore
//   let resolver = app_handle.path_resolver();
//   let temp_dir_path = resolver.app_data_dir().unwrap().join("temp");
//   std::fs::create_dir_all(&temp_dir_path)
//     .map_err(|err| format!("Failed to create temp directory: {}", err))?;
//
//   let path = Path::new(&path_file);
//   let file_name = path
//     .file_name()
//     .and_then(|name| name.to_str())
//     .map(|name_str| format!("{}.json", name_str))
//     .ok_or_else(|| "Invalid file name".to_string())?;
//
//   // Exécuter la commande externe pour extraire les informations musicales
//   let path_resource_music_extractor = resolver
//     .resolve_resource("resources/streaming_extractor_music_osx-i686")
//     .expect("failed to resolve resource");
//   Command::new(path_resource_music_extractor)
//     .arg(&path_file)
//     .arg(&temp_dir_path.join(&file_name))
//     .output()
//     .map_err(|err| format!("Failed to execute process: {}", err))?;
//
//   // Mettre à jour l'entrée de fichier dans la base de données
//   state
//     .prisma_client
//     .file()
//     .update(file::path::equals(path_file.clone()), vec![])
//     .exec()
//     .await
//     .map_err(|err| format!("Failed to update file entry in database: {}", err))
// }

pub struct AudioProperties {
  pub bitrate: u32,
  pub sample_rate: u32,
  pub bit_depth: u8,
  pub channels: u8,
  pub duration_milliseconds: u128,
}

pub async fn get_audio_metadata(path_str: String) -> Result<AudioProperties, String> {
  let path = Path::new(&path_str);

  if !path.is_file() {
    panic!("ERROR: Path is not a file!");
  }

  let tagged_file = Probe::open(path)
    .expect("ERROR: Bad path provided!")
    .options(ParseOptions::new().read_tags(false))
    .read()
    .expect("ERROR: Failed to read file!");

  let properties = tagged_file.properties();

  let audio_properties = AudioProperties {
    bitrate: properties.audio_bitrate().unwrap_or(0),
    sample_rate: properties.sample_rate().unwrap_or(0),
    bit_depth: properties.bit_depth().unwrap_or(0),
    channels: properties.channels().unwrap_or(0),
    duration_milliseconds: properties.duration().as_millis(),
  };

  Ok(audio_properties)
}
