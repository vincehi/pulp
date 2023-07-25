import { useSearch } from "@/providers/SearchProvider";
import { invoke, tauri } from "@tauri-apps/api";
import { flatMap, some, startsWith } from "lodash-es";
import {
  type Component,
  type ResourceFetcher,
  createMemo,
  createResource,
  For,
} from "solid-js";
import { type File } from "@prisma/client";
import { Icon } from "solid-heroicons";
import { magnifyingGlass } from "solid-heroicons/solid";
import {
  createSolidTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/solid-table";

const defaultColumns: Array<ColumnDef<File>> = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => {
      const value = info.getValue() as string;
      return (
        <div title={value} class="whitespace-nowrap truncate">
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "bpm",
    header: "BPM",
    cell: (info) => {
      const value = info.getValue() as number;
      return value === 0 ? "-" : Math.round(value);
    },
  },
  {
    accessorKey: "danceability",
    header: "Danceability",
    cell: (info) => {
      const value = info.getValue() as number;
      return value === 0 ? "-" : value.toFixed(2);
    },
  },
  {
    accessorKey: "chordsKey",
    header: "Chords Key",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "chordsScale",
    header: "Chords Scale",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "show",
    header: "",
    cell: (info) => {
      console.log(info);
      return (
        <button
          onClick={[openInFinder, info.row.original.path]}
          title="Open in finder"
        >
          <Icon
            path={magnifyingGlass}
            class="flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
          />
        </button>
      );
    },
  },
];

async function openInFinder(path: string, event: Event): Promise<void> {
  event.preventDefault();
  event.stopPropagation();
  await tauri.invoke("open_in_finder", { path });
}

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
  const computeFilterStartsWith = createMemo(() => [
    store.search,
    filterStartsWith(flatMap(store.collapsed, (item) => item.collapsed)),
  ]);

  const [files] = createResource<File[], Array<string | string[]>>(
    computeFilterStartsWith,
    fetchDirectoryFiles
  );

  const table = createSolidTable({
    get data() {
      return files() ?? [];
    },
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <div class="files relative overflow-x-auto shadow-md">
      <table
        style={{
          width: `${table.getTotalSize()}px`,
        }}
        class="table table-fixed"
      >
        <thead class="sticky top-0 bg-base-100">
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => {
                    return (
                      <th
                        class="whitespace-nowrap overflow-hidden relative select-none"
                        style={{ width: `${header.getSize()}px` }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          class="resizer"
                          classList={{
                            isResizing: header.column.getIsResizing(),
                          }}
                        />
                      </th>
                    );
                  }}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => {
              return (
                <tr
                  onClick={(event): void => {
                    event.currentTarget.focus();
                  }}
                  onFocus={[actions.setPathSelected, row.original.path]}
                  tabIndex={0}
                  classList={{
                    "bg-base-200": store.pathSelected === row.original.path,
                  }}
                >
                  <For each={row.getVisibleCells()}>
                    {(cell) => {
                      return (
                        <td class="overflow-hidden">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    }}
                  </For>
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>
    </div>
  );
};

export default ViewFiles;
