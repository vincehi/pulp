import { type SearchState, useSearch } from "@/providers/SearchProvider";
import { invoke } from "@tauri-apps/api";
import { flatMap, isEmpty, last, some, startsWith } from "lodash-es";
import {
  type Component,
  type ResourceFetcher,
  createMemo,
  createResource,
  For,
  createSignal,
  createEffect,
  onMount,
} from "solid-js";
import { type File } from "@prisma/client";
import {
  createSolidTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/solid-table";
import { useInfiniteScroll } from "solidjs-use";
import { filesTableColumns } from "@/components/FilesTable/columns";
import { createVirtualizer } from "@tanstack/solid-virtual";

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
  const [store, actions] = useSearch();

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

  // useInfiniteScroll(
  //   bodyTableRef,
  //   () => {
  //     const fileContents = files()?.contents;
  //     const fileMetadata = files()?.metadata;
  //     if (
  //       fileContents != null &&
  //       fileMetadata != null &&
  //       fileContents.length < fileMetadata.total_count
  //     ) {
  //       void refetch();
  //     }
  //   },
  //   { distance: 100, interval: 1000 }
  // );

  const table = createSolidTable({
    get data() {
      return files()?.contents ?? [];
    },
    columns: filesTableColumns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    getRowId: (originalRow, index, parent) => {
      // console.log(originalRow);
      return originalRow.path;
    },
  });

  const rowVirtualizer = createVirtualizer({
    getScrollElement: bodyTableRef,
    get count() {
      return files()?.metadata.total_count;
    },
    overscan: 10,
    enableSmoothScroll: true,
    estimateSize: () => 45,
    getItemKey: (index) => table.getRowModel().rows[index]?.id,
    // debug: true,
  });

  createEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    if (
      last(virtualItems)?.index >= table.getRowModel().rows.length &&
      table.getRowModel().rows.length < files()?.metadata.total_count
    ) {
      void refetch();
    }
  });

  createEffect(() => console.log(bodyTableRef()));

  // const paddingTop = () =>
  //   rowVirtualizer.getVirtualItems().length > 0
  //     ? rowVirtualizer.getVirtualItems()?.[0].start || 0
  //
  // const paddingBottom = () =>
  //   rowVirtualizer.getVirtualItems().length > 0
  //     ? rowVirtualizer.getTotalSize() -
  //       (rowVirtualizer.getVirtualItems()?.[
  //         rowVirtualizer.getVirtualItems().length - 1
  //       ].end || 0)
  //     : 0;

  return (
    <div class="files shadow-md">
      {/* thead */}
      <div class=" top-0 bg-base-100 z-10">
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            /* tr */
            <div>
              <For each={headerGroup.headers}>
                {(header) => {
                  return (
                    /* th */
                    <div
                      class="whitespace-nowrap overflow-hidden relative select-none inline-block"
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
      {/* tbody */}
      <div
        ref={setBodyTableRef}
        style={{
          position: "relative",
          "overflow-x": "auto",
          height: "calc(100% - 30px)",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            "padding-top": `${rowVirtualizer.getVirtualItems()[0]?.start}px`,
          }}
        >
          {console.log(rowVirtualizer.getVirtualItems()[0]?.start)}
          <For each={rowVirtualizer.getVirtualItems()}>
            {(virtualRow) => {
              const row = () => table.getRowModel().rows[virtualRow.index];
              return (
                /* tr */
                <div
                  data-index={virtualRow.index}
                  style={{
                    //   position: "absolute",
                    //   top: 0,
                    //   left: 0,
                    //   transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`,
                  }}
                  // onClick={(event): void => {
                  //   event.currentTarget.focus();
                  // }}
                  // onFocus={[actions.setPathSelected, row?.original.path]}
                  // tabIndex={0}
                  // classList={{
                  //   "bg-base-200": store.pathSelected === row?.original.path,
                  // }}
                >
                  <For each={row()?.getVisibleCells() || []}>
                    {(cell) => {
                      return (
                        /* td */
                        <div
                          style={{ width: `${cell.column.getSize()}px` }}
                          class="overflow-hidden inline-block"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      );
                    }}
                  </For>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default FilesTable;
