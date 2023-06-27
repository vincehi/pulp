import type { Directory as ClientDirectory } from "@prisma/client";
import { invoke } from "@tauri-apps/api";
import { type MessageDialogOptions } from "@tauri-apps/api/dialog";
import { type FileEntry } from "@tauri-apps/api/fs";
import { createStore } from "solid-js/store";

export interface Directory extends ClientDirectory {
  name: string;
  children?: FileEntry[];
}

export const [directories, setDirectories] = createStore([] as Directory[]);

export class CustomError extends Error {
  options;

  constructor(message: string, options?: string | MessageDialogOptions) {
    super(message);
    this.name = "CustomError";
    this.options = options;
  }
}

export const getAllDirectories = async (): Promise<void> => {
  console.log("getAllDirectories");
  const response: Directory[] = await invoke("get_all_directories");
  setDirectories(response);
};

export const createDirectory = async (pathDir: string): Promise<void> => {
  console.log("createDirectory");
  try {
    const response: Directory = await invoke("create_directory", {
      pathDir,
    });
    setDirectories([...directories, response]);
  } catch (error) {
    throw new CustomError(error as string, {
      title: "Create directory",
      type: "error",
    });
  }
};

export const deleteDirectory = async (pathDir: string): Promise<void> => {
  console.log("deleteDirectory");
  try {
    const response: Directory = await invoke("delete_directory", {
      pathDir,
    });
    setDirectories((prevDirectories) =>
      prevDirectories.filter((directory) => response.path !== directory.path)
    );
  } catch (error) {
    throw new CustomError(error as string, {
      title: "Delete directory",
      type: "error",
    });
  }
};

export const scanDirectory = async (pathDir: string): Promise<void> => {
  console.log("scanDirectory");
  try {
    await invoke("scan_directory", {
      pathDir,
    });
  } catch (error) {
    throw new CustomError(error as string, {
      title: "Scan directory",
      type: "error",
    });
  }
};
