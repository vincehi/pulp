import {
  createDirectory,
  CustomError,
  scanDirectory,
} from "@/services/directories";
import { message, open } from "@tauri-apps/api/dialog";
import { isEmpty } from "lodash-es";
import { Icon } from "solid-heroicons";
import { plusCircle } from "solid-heroicons/outline";
import { createEffect, createSignal, type Component } from "solid-js";
import { useWalkDir } from "@/providers/WalkDir";

const AddDirectories: Component = () => {
  const [getSelectedDirectories, setSelectedDirectories] = createSignal<
    string[]
  >([]);
  const [_walkDirStore, walkDirActions] = useWalkDir();

  const openSelectedDirectories = (): void => {
    void walkDirActions.scanProcessing(async (processing) => {
      if (processing) {
        await message(
          "You cannot perform this action until the scan process has been completed.",
          {
            title: "Incomplete scan",
            type: "error",
          }
        );
      } else {
        const selected = (await open({
          directory: true,
          multiple: true,
        })) as string[];
        setSelectedDirectories(selected);
      }
    });
  };

  createEffect(() => {
    if (!isEmpty(getSelectedDirectories())) {
      void (async () => {
        for (const pathDir of getSelectedDirectories()) {
          try {
            await createDirectory(pathDir);
            await scanDirectory(pathDir);
          } catch (error) {
            if (error instanceof CustomError) {
              await message(error.message, error.options);
              return;
            }
            console.error(error);
            return;
          }
        }
      })();
      setSelectedDirectories([]);
    }
  });

  return (
    <button
      onClick={openSelectedDirectories}
      type="button"
      class="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
    >
      <Icon
        path={plusCircle}
        class="flex-shrink-0 w-6 h-6 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
      />
      <span class="overflow-hidden overflow-ellipsis whitespace-nowrap">
        Add directory
      </span>
    </button>
  );
};

export default AddDirectories;
