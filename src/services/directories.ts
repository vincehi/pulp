import type { Directory as ClientDirectory } from "@prisma/client";
import { invoke } from "@tauri-apps/api";
import { message } from "@tauri-apps/api/dialog";
import { type FileEntry } from "@tauri-apps/api/fs";
import { createStore } from "solid-js/store";

export interface Directory extends ClientDirectory {
  name: string;
  children?: FileEntry[];
}

export const [directories, setDirectories] = createStore([] as Directory[]);

export const [selectedDirectoies, setSelectedDirectoies] = createStore(
  [] as string[]
);

export const getAllDirectories = async (): Promise<void> => {
  console.log("getAllDirectories");
  const response: Directory[] = await invoke("get_all_directories");
  setDirectories(response);
};

export const createDirectories = async (pathsDir: string[]): Promise<void> => {
  console.log("createDirectories");
  for (const pathDir of pathsDir) {
    try {
      const response: Directory = await invoke("create_directory", {
        pathDir,
      });
      setDirectories([...directories, response]);
      // TODO : scan response
    } catch (error) {
      await message(error as string, {
        title: "Create directory",
        type: "error",
      });
    }
  }
};

export const deleteDirectories = async (pathsDir: string[]): Promise<void> => {
  console.log("deleteDirectories");
  for (const pathDir of pathsDir) {
    try {
      const response: Directory = await invoke("delete_directory", {
        pathDir,
      });
      setDirectories((prevDirectories) =>
        prevDirectories.filter((directory) => response.path !== directory.path)
      );
    } catch (error) {
      await message(error as string, {
        title: "Delete directory",
        type: "error",
      });
    }
  }
};

export const scanDirectory = async (pathDir: string): Promise<void> => {
  console.log("scanDirectory");
  await invoke("scan_directory", {
    pathDir,
  });
};
