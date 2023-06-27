import { type Directory } from "@prisma/client";
import { confirm, message } from "@tauri-apps/api/dialog";
import { Icon } from "solid-heroicons";
import { documentMagnifyingGlass, trash } from "solid-heroicons/outline";
import { type Component, Show } from "solid-js";
import {
  createDirectory,
  CustomError,
  deleteDirectory,
  scanDirectory,
} from "@/services/directories";
import { useWalkDir } from "@/providers/WalkDir";

const ActionsDirectory: Component<{
  directory: Directory;
}> = (props) => {
  const [walkDirStore] = useWalkDir();

  const handleRemove = (
    event: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ): void => {
    event.preventDefault();
    event.stopPropagation();
    void (async () => {
      if (walkDirStore.processing) {
        await message(
          "You cannot perform this action until the scan process has been completed.",
          {
            title: "Incomplete scan",
            type: "error",
          }
        );
      } else {
        const response = await confirm(
          `Are you sure you want to delete ${props.directory.name} ?\n\n(This action does not delete the original)`,
          {
            title: "Delete directory",
            type: "error",
          }
        );
        if (response) {
          await deleteDirectory(props.directory.path);
        }
      }
    })();
  };

  const handleScan = (
    event: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ): void => {
    event.preventDefault();
    event.stopPropagation();
    void (async () => {
      if (walkDirStore.processing) {
        await message(
          "You cannot perform this action until the scan process has been completed.",
          {
            title: "Incomplete scan",
            type: "error",
          }
        );
      } else {
        const response = await confirm(
          `Scan the directory ${props.directory.name} to get all samples`,
          {
            title: "Scan the directory",
            type: "warning",
          }
        );
        if (response) {
          try {
            await deleteDirectory(props.directory.path);
            await createDirectory(props.directory.path);
            await scanDirectory(props.directory.path);
          } catch (error) {
            if (error instanceof CustomError) {
              await message(error.message, error.options);
              return;
            }
            console.error(error);
          }
        }
      }
    })();
  };

  return (
    <>
      <Show
        when={
          walkDirStore.pathDirectory === props.directory.path &&
          walkDirStore.processing
        }
      >
        <span class="loading loading-ring loading-xs mr-1"></span>
      </Show>
      <button
        class="text-gray-500 hover:text-gray-900"
        onClick={(event) => {
          handleRemove(event);
        }}
        title={`Remove ${props.directory.name}`}
      >
        <Icon path={trash} class="w-4" />
      </button>

      <button
        class="text-gray-500 hover:text-gray-900"
        onClick={(event) => {
          handleScan(event);
        }}
        title={`Scanning ${props.directory.name}`}
      >
        <Icon path={documentMagnifyingGlass} class="w-4" />
      </button>
    </>
  );
};

export default ActionsDirectory;
