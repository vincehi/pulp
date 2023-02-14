import { useSearch } from "@/providers/SearchProvider";
import { invoke } from "@tauri-apps/api";
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


const filterStartsWith = (arr: string[]): string[] => {
  return arr.filter((item, index) => {
    return !some(arr, (otherItem, otherIndex) => {
      return otherIndex !== index && startsWith(otherItem, item);
    });
  });
};

const fetchDirectoryFiles: ResourceFetcher<Array<string | string[]>, File[]> = async ([search, paths]) => {
  console.log([search, paths])
  return await invoke("get_directory_files", {
    paths,
    search,
  });
};
const ViewFiles: Component = () => {
  const [store, actions] = useSearch();
  const computeFilterStartsWith = createMemo(() => [
    store.search,
    filterStartsWith(flatMap(store.collapsed, (item) => item.collapsed)),
  ], [store]);

  const [files] = createResource<File[], Array<string | string[]>>(
    computeFilterStartsWith,
    fetchDirectoryFiles,
  );


  return (
    <div style={{height: "calc(100vh - 300px"}} class="files relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Name
          </th>
        </tr>
        </thead>
        <tbody>
        <Show when={!files.loading} fallback="Loading...">
          <Show when={files()?.length} fallback="No results">
            <For each={files()} fallback="No files">
              {(file) => {
                return (
                  <tr onClick={(event): void => {
                    event.currentTarget.focus();
                  }}
                      onFocus={[actions.setPathSelected, file.path]}
                      tabIndex={0}
                      class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 focus:bg-gray-100 dark:hover:bg-gray-600 dark:focus:bg-gray-600">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {file.name}
                    </th>
                  </tr>
                );
              }}
            </For>
          </Show>
        </Show>
        </tbody>
      </table>
    </div>
  );
};

export default ViewFiles;
