use serde_json::Value;
use std::fs;
use std::io::Read;

pub async fn extractor_music(
  input_path: String,
  output_path: String,
) -> Result<Value, std::io::Error> {
  let truc = input_path.clone();
  let status = tauri::api::process::Command::new_sidecar("streaming_extractor_music")
    .expect("failed to create `streaming_extractor_music` binary command")
    .args([input_path, output_path.clone()])
    .status()
    .unwrap();

  assert!(status.success());

  let mut file_contents = String::new();
  fs::File::open(&output_path)?.read_to_string(&mut file_contents)?;

  fs::remove_file(&output_path)?;

  let result: serde_json::Value =
    serde_json::from_str(&file_contents).expect("Failed to parse JSON");

  println!("Top : {}", truc);

  Ok(result)
}
