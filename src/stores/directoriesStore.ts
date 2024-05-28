import directoryServices, {
  type Directory,
} from "@/services/directoryServices";
import { appStore, setAppStore } from "@/stores/appStore";
import { SetStoreFunction } from "solid-js/store";

const setDirectories: SetStoreFunction<Directory[]> = (...args: any[]) => {
  setAppStore("directories", ...(args as [any]));
};

const getAllDirectories = async (): Promise<void> => {
  const response: Directory[] = await directoryServices.getAllDirectories();
  setDirectories(() => response);
};

const createDirectory = async (pathDir: string): Promise<void> => {
  const response: Directory = await directoryServices.createDirectory(pathDir);
  setDirectories([...appStore.directories, response]);
};

const deleteDirectory = async (pathDir: string): Promise<void> => {
  const response: Directory = await directoryServices.deleteDirectory(pathDir);
  setDirectories((prevDirectories) =>
    prevDirectories.filter((directory) => response.path !== directory.path)
  );
};

export default {
  get data() {
    return appStore.directories;
  },
  getAllDirectories,
  createDirectory,
  deleteDirectory,
};
