// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;

use crate::utils::app::AppState;

mod cmds;
#[allow(warnings, unused)]
mod prisma_main_client;
mod utils;

use prisma_client_rust::NewClientError;
use prisma_main_client::PrismaClient;

#[tokio::main]
async fn main() {
  let context = tauri::generate_context!({
    icons: {
      "32x32": "src-tauri/icons/32x32.png"
    }
  });

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

        let prisma_client: Result<PrismaClient, NewClientError> = PrismaClient::_builder()
          .with_url("file:".to_owned() + db_file_path.to_str().unwrap())
          .build()
          .await;

        match prisma_client {
          Ok(client) => {
            #[cfg(debug_assertions)]
            client._db_push().await.unwrap();
            #[cfg(not(debug_assertions))]
            client._migrate_deploy().await.unwrap();

            handle.manage(AppState {
              prisma_client: client,
            });
            Ok(())
          }
          Err(err) => Err(err),
        }
      });
      Ok(())
    })
    // .manage(AppState { prisma_client })
    .invoke_handler(tauri::generate_handler![
      cmds::get_all_directories,
      cmds::create_directory,
      cmds::delete_directory,
      cmds::scan_directory,
      cmds::get_directory_files,
      cmds::open_in_finder,
      cmds::get_search_files_metadata,
    ])
    .menu(tauri::Menu::os_default(&context.package_info().name))
    .run(context)
    .expect("error while running tauri application");
}
