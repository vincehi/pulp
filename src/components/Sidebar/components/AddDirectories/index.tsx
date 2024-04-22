import directoryServices, { CustomError } from "@/services/directoryServices";
import { message, open } from "@tauri-apps/api/dialog";
import { isEmpty } from "lodash-es";
import { Icon } from "solid-heroicons";
import { plusCircle } from "solid-heroicons/outline";
import { type Component, createEffect, createSignal } from "solid-js";
import directoriesStore from "@/stores/directoriesStore";

const AddDirectories: Component = () => {
  const [getSelectedDirectories, setSelectedDirectories] = createSignal<
    string[]
  >([]);

  const openSelectedDirectories = (): void => {
    void (async () => {
      const selected = (await open({
        directory: true,
        multiple: true,
      })) as string[];
      setSelectedDirectories(selected);
    })();
  };

  createEffect(() => {
    if (!isEmpty(getSelectedDirectories())) {
      void (async () => {
        for (const pathDir of getSelectedDirectories()) {
          try {
            await directoriesStore.createDirectory(pathDir);
            await directoryServices.scanDirectory(pathDir);
            await directoryServices.analyzeDirectory(pathDir);
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
      class="btn btn-block"
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
