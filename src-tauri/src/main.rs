#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;

use crate::utils::app::AppState;

mod cmds;
mod prisma_main_client;
mod utils;

#[tokio::main]
async fn main() {
  let context = tauri::generate_context!();

  tauri::Builder::default()
    .setup(|app| {
      let resolver = app.path_resolver();
      let mut db_dir_path = resolver.app_data_dir().unwrap();
      db_dir_path.push("databases");

      let mut db_file_path = db_dir_path.clone();
      db_file_path.push("Database.db");

      let handle = app.handle();
      tauri::async_runtime::spawn(async move {
        std::fs::create_dir_all(db_dir_path.as_path()).unwrap();

        let prisma_client = prisma_main_client::new_client_with_url(
          ("file:".to_owned() + db_file_path.to_str().unwrap()).as_str(),
        )
        .await
        .unwrap();

        // #[cfg(debug_assertions)]
        prisma_client._db_push().await.unwrap();
        // #[cfg(not(debug_assertions))]
        // prisma_client._migrate_deploy().await.unwrap();

        handle.manage(AppState { prisma_client })
      });
      Ok(())
    })
    // .manage(AppState { prisma_client })
    .invoke_handler(tauri::generate_handler![
      cmds::get_all_directories,
      cmds::create_directory,
      cmds::delete_directory,
      cmds::scan_directory,
      cmds::analyze_directory,
      cmds::get_directory_files,
      cmds::open_in_finder,
    ])
    .menu(tauri::Menu::os_default(&context.package_info().name))
    .run(context)
    .expect("error while running tauri application");
}
