import type { Directory } from "@prisma/client";
import { invoke } from "@tauri-apps/api";
import { createStore } from "solid-js/store";

export const [directories, setDirectories] = createStore([] as Directory[]);

export const getAllDirectories = async (): Promise<void> => {
  console.log("getAllDirectories");
  const response: Directory[] = await invoke("get_all_directories");
  setDirectories(response);
};

export const createDirectories = async (pathsDir: [string]): Promise<void> => {
  console.log("createDirectories");
  try {
    const response: Directory[] = await invoke("create_directories", {
      pathsDir,
    });
    // TODO : scan response
    setDirectories([...directories, ...response]);
  } catch (error) {
    console.error(error);
  }
};

export const deleteDirectories = async (pathsDir: [string]): Promise<void> => {
  console.log("deleteDirectories");
  try {
    const response: Directory[] = await invoke("delete_directories", {
      pathsDir,
    });
    setDirectories((prevDirectories) =>
      prevDirectories.filter((directory) =>
        response.find((item) => item.path !== directory.path)
      )
    );
  } catch (error) {
    console.error(error);
  }
};
