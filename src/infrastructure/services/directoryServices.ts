import { invoke } from "@tauri-apps/api";
import { type MessageDialogOptions } from "@tauri-apps/api/dialog";
import type { Directory as ClientDirectory } from "@prisma/client";
import type { FileEntry } from "@tauri-apps/api/fs";

export interface Directory extends ClientDirectory {
  name: string;
  children?: FileEntry[];
}
export class CustomError extends Error {
  options;

  constructor(message: string, options?: string | MessageDialogOptions) {
    super(message);
    this.name = "CustomError";
    this.options = options;
  }
}

const getAllDirectories = async (): Promise<Directory[]> => {
  console.log("getAllDirectories");
  try {
    return await invoke("get_all_directories");
  } catch (error) {
    throw new CustomError(error as string, {
      title: "Create directory",
      type: "error",
    });
  }
};

const createDirectory = async (pathDir: string): Promise<Directory> => {
  console.log("createDirectory");
  try {
    return await invoke("create_directory", {
      pathDir,
    });
  } catch (error) {
    throw new CustomError(error as string, {
      title: "Create directory",
      type: "error",
    });
  }
};

const deleteDirectory = async (pathDir: string): Promise<Directory> => {
  console.log("deleteDirectory");
  try {
    return await invoke("delete_directory", {
      pathDir,
    });
  } catch (error) {
    throw new CustomError(error as string, {
      title: "Delete directory",
      type: "error",
    });
  }
};

const scanDirectory = async (pathDir: string): Promise<void> => {
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

const analyzeDirectory = async (pathDir: string): Promise<unknown> => {
  console.log("analyzeDirectory");
  try {
    return await invoke("analyze_directory", {
      pathDir,
    });
  } catch (error) {
    throw new CustomError(error as string, {
      title: "Analyze directory",
      type: "error",
    });
  }
};
export default {
  getAllDirectories,
  createDirectory,
  deleteDirectory,
  scanDirectory,
  analyzeDirectory,
};
