import { type SearchState, useSearch } from "@/providers/SearchProvider";
import { invoke } from "@tauri-apps/api";
import { flatMap, last, some, startsWith } from "lodash-es";
import {
  type Component,
  type ResourceFetcher,
  createMemo,
  createResource,
  For,
  createSignal,
  createEffect,
} from "solid-js";
import { type File } from "@prisma/client";
import {
  createSolidTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/solid-table";
import { onKeyStroke, useScroll, useStorage } from "solidjs-use";
import { filesTableColumns } from "@/components/FilesTable/columns";
import { createVirtualizer } from "@tanstack/solid-virtual";
import TableRow from "./components/TableRow";

const filterStartsWith = (arr: string[]): string[] => {
  return arr.filter((item, index) => {
    return !some(arr, (otherItem, otherIndex) => {
      return otherIndex !== index && startsWith(otherItem, item);
    });
  });
};

type FetchDirectoryFilesKeys = [Array<File["path"]>, SearchState["search"]];

interface FilesResponse {
  contents: File[];
  metadata: {
    total_count: number;
  };
}

const fetchDirectoryFiles: ResourceFetcher<
  FetchDirectoryFilesKeys,
  FilesResponse,
  boolean
> = async ([paths, search], prevData) => {
  const { value: prevValue, refetching } = prevData;
  const { contents: prevContents } = prevValue ?? {};

  const data = await invoke<FilesResponse>("get_directory_files", {
    paths,
    search,
    cursorPath: refetching ? last<File>(prevContents)?.path : undefined,
  });

  if (prevContents?.length != null && refetching) {
    return {
      contents: [...prevContents, ...data.contents],
      metadata: data.metadata,
    };
  }

  return data;
};

const FilesTable: Component = () => {
  const [store] = useSearch();

  const computeFilterStartsWith = createMemo<FetchDirectoryFilesKeys>(() => {
    const filteredStartsWith = filterStartsWith(
      flatMap(store.collapsed, (item) => item.collapsed)
    );

    return [filteredStartsWith, store.search];
  });

  const [files, { refetch }] = createResource<
    FilesResponse,
    FetchDirectoryFilesKeys,
    boolean
  >(computeFilterStartsWith, fetchDirectoryFiles);

  const [bodyTableRef, setBodyTableRef] = createSignal<HTMLElement>();

  const [tableState, setTableState] = useStorage("table-state", {
    name: 350,
    bpm: 150,
    danceability: 150,
    chordsKey: 150,
    chordsScale: 150,
    show: 100,
  });

  const table = createSolidTable({
    get data() {
      return files()?.contents ?? [];
    },
    columns: filesTableColumns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    state: {
      get columnSizing() {
        return tableState();
      },
    },
    initialState: {
      columnSizing: tableState(),
    },
    onColumnSizingChange: (updater) => {
      setTableState(updater);
    },
  });

  const rowVirtualizer = createVirtualizer({
    getScrollElement: bodyTableRef,
    get count() {
      return files()?.metadata.total_count;
    },
    overscan: 10,
    enableSmoothScroll: false,
    estimateSize: () => 45,
  });

  onKeyStroke(
    "ArrowDown",
    (event) => {
      event.preventDefault();
      event.target.nextElementSibling?.focus();
    },
    { target: bodyTableRef }
  );
  onKeyStroke(
    "ArrowUp",
    (event) => {
      event.preventDefault();
      event.target.previousElementSibling?.focus();
    },
    { target: bodyTableRef }
  );

  const { x } = useScroll(bodyTableRef);

  const [headerTableRef, setHeaderTableRef] = createSignal<HTMLElement>();
  const { setX } = useScroll(headerTableRef);

  createEffect(() => {
    setX(x());
  });

  createEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    if (
      last<any>(virtualItems)?.index >= table.getRowModel().rows.length &&
      table.getRowModel().rows.length < files()?.metadata.total_count
    ) {
      void refetch();
    }
  });

  return (
    <div class="files div-table overflow-hidden shadow-md">
      <div
        ref={setHeaderTableRef}
        class="thead flex hide-scrollbar overflow-hidden top-0 bg-base-100 z-10"
      >
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            <div class="tr flex">
              <For each={headerGroup.headers}>
                {(header) => {
                  return (
                    <div
                      class="th whitespace-nowrap overflow-hidden relative select-none inline-block"
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
                    </div>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>
      <div
        class="tbody"
        ref={setBodyTableRef}
        style={{ height: "calc(100% - 40px)", overflow: "scroll" }}
      >
        <div
          style={{
            position: "relative",
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            height: `${rowVirtualizer.getTotalSize()}px`,
            "min-height": "100%",
            width: `${table.getTotalSize()}px`,
          }}
        >
          <For each={rowVirtualizer.getVirtualItems()}>
            {(virtualRow) => {
              return (
                <TableRow
                  virtualRow={virtualRow}
                  tableRow={table.getRowModel().rows[virtualRow.index]}
                />
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default FilesTable;
