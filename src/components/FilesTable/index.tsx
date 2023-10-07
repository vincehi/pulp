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
import { useScroll } from "solidjs-use";
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

  const table = createSolidTable({
    get data() {
      return files()?.contents ?? [];
    },
    columns: filesTableColumns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
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

  const { x, y } = useScroll<HTMLElement>(bodyTableRef);

  const [elHeader, setElHeader] = createSignal<HTMLElement>();
  const { setX } = useScroll(elHeader);

  createEffect(() => {
    setX(x());
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

  return (
    <div class="files overflow-hidden shadow-md">
      {/* thead */}
      <div
        ref={setElHeader}
        class="flex hide-scrollbar overflow-auto top-0 bg-base-100 z-10"
        style={{
          height: "25px",
        }}
      >
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            /* tr */
            <div class="flex">
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
        style={{ height: "calc(100% - 25px)", overflow: "scroll" }}
      >
        <div
          style={{
            position: "relative",
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
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

const TableRow = (props) => {
  const [store, actions] = useSearch();
  return (
    <div
      data-index={props.virtualRow.index}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translateY(${props.virtualRow.start}px)`,
        height: `${props.virtualRow.size}px`,
        display: "flex",
        "flex-wrap": "nowrap",
      }}
      onClick={(event): void => {
        event.currentTarget.focus();
      }}
      onFocus={[actions.setPathSelected, props.tableRow?.original.path]}
      tabIndex={0}
      classList={{
        "bg-base-200": store.pathSelected === props.tableRow?.original.path,
      }}
    >
      <For each={props.tableRow?.getVisibleCells() || []}>
        {(cell) => {
          return (
            <div
              style={{ width: `${cell.column.getSize()}px` }}
              class="overflow-hidden inline-block"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default FilesTable;
