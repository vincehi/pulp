import { useSearch } from "@/providers/SearchProvider";
import { invoke, tauri } from "@tauri-apps/api";
import { flatMap, some, startsWith } from "lodash-es";
import {
  type Component,
  type ResourceFetcher,
  createMemo,
  createResource,
  For,
  Show,
} from "solid-js";
import { type File } from "@prisma/client";
import clsx from "clsx";
import { Icon } from "solid-heroicons";
import { magnifyingGlass } from "solid-heroicons/solid";

const filterStartsWith = (arr: string[]): string[] => {
  return arr.filter((item, index) => {
    return !some(arr, (otherItem, otherIndex) => {
      return otherIndex !== index && startsWith(otherItem, item);
    });
  });
};

const fetchDirectoryFiles: ResourceFetcher<
  Array<string | string[]>,
  File[]
> = async ([search, paths]) => {
  return await invoke("get_directory_files", {
    paths,
    search,
  });
};
const ViewFiles: Component = () => {
  const [store, actions] = useSearch();
  const computeFilterStartsWith = createMemo(
    () => [
      store.search,
      filterStartsWith(flatMap(store.collapsed, (item) => item.collapsed)),
    ],
    [store]
  );

  const [files] = createResource<File[], Array<string | string[]>>(
    computeFilterStartsWith,
    fetchDirectoryFiles
  );

  const openInFinder = async (path: string, event: Event): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    await tauri.invoke("open_in_finder", { path });
  };

  return (
    <div class="files relative overflow-x-auto shadow-md">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <Show when={!files.loading} fallback="Loading...">
            <For each={files()} fallback="No files">
              {(file) => {
                return (
                  <tr
                    onClick={(event): void => {
                      event.currentTarget.focus();
                    }}
                    onFocus={[actions.setPathSelected, file.path]}
                    tabIndex={0}
                    class={clsx(
                      store.pathSelected === file.path && "bg-base-200"
                    )}
                  >
                    <td>{file.name}</td>
                    <td>
                      <button
                        onClick={[openInFinder, file.path]}
                        title="Open in finder"
                      >
                        <Icon
                          path={magnifyingGlass}
                          class="flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                        />
                      </button>
                    </td>
                  </tr>
                );
              }}
            </For>
          </Show>
        </tbody>
      </table>
    </div>
  );
};

export default ViewFiles;
