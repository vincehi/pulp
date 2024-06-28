import { filesTableColumns } from "@/components/FilesTable/columns";
import { useSearch } from "@/providers/SearchProvider/SearchProvider";
import {
  ColumnSizingState,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { createVirtualizer } from "@tanstack/solid-virtual";
import {
  For,
  createEffect,
  createMemo,
  createSignal,
  on,
  type Component,
} from "solid-js";
import { onKeyStroke, useScroll, useStorage } from "solidjs-use";
import { removeSubstrings } from "../../services/helpers/helpers";
import TableRow from "./core/TableRow/TableRow";
import useFilesLoader from "./hooks/useFilesLoader";
import useUpdateSkip from "./hooks/useUpdateSkip";

const FilesTable: Component = () => {
  const [store, actions] = useSearch();

  const pathsFiltered = createMemo<string[]>(() => {
    return removeSubstrings(store.collapsed);
  });

  const { files, metadataFiles, handleSkipUpdate } = useFilesLoader(
    pathsFiltered,
    () => store.search
  );

  let bodyTableRef!: HTMLDivElement;
  let headerTableRef!: HTMLDivElement;

  const [getColumnsSize, setColumnsSize] = useStorage<ColumnSizingState>(
    "columns-size",
    {
      name: 350,
      bpm: 150,
      simpleRate: 150,
      bitDepth: 150,
      channels: 150,
      duration: 150,
      show: 100,
    }
  );

  const table = createSolidTable({
    get data() {
      return files() ?? [];
    },
    columns: filesTableColumns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    state: {
      get columnSizing() {
        return getColumnsSize();
      },
    },
    initialState: {
      columnSizing: getColumnsSize(),
    },
    onColumnSizingChange: (updater) => {
      setColumnsSize(updater);
    },
    getRowId: (originalRow) => originalRow.path,
  });

  const [getRandomPosition, setRandomPosition] = createSignal<number | null>(
    null
  );

  const rowVirtualizer = createVirtualizer({
    getScrollElement: () => bodyTableRef,
    get count() {
      return metadataFiles()?.total_count ?? 0;
    },
    overscan: 8,
    estimateSize: () => 45,
    isScrollingResetDelay: 0,
  });

  useUpdateSkip({
    getVirtualItems: rowVirtualizer.getVirtualItems,
    overscan: rowVirtualizer.options.overscan,
    enabled: () => !files.loading && !metadataFiles.loading,
    handleSkipUpdate,
    isItemLoaded: (index) => {
      return !!files()?.[index]?.path;
    },
  });

  onKeyStroke(
    "ArrowDown",
    (event) => {
      event.preventDefault();
      const targetElement = event.target as HTMLElement;
      (targetElement.nextElementSibling as HTMLElement)?.focus();
    },
    { target: () => bodyTableRef }
  );

  onKeyStroke(
    "ArrowUp",
    (event) => {
      event.preventDefault();
      const targetElement = event.target as HTMLElement;
      (targetElement.previousElementSibling as HTMLElement)?.focus();
    },
    { target: () => bodyTableRef }
  );

  const { setX: setXBody, x: xBody } = useScroll(() => bodyTableRef);

  const { setX: setXHeader, x: xHeader } = useScroll(() => headerTableRef);

  createEffect(() => {
    setXHeader(xBody());
  });

  createEffect(() => {
    setXBody(xHeader());
  });

  const handleRandomPosition = async () => {
    const totalCount = metadataFiles()?.total_count ?? 0;
    if (totalCount > 0) {
      const randomBuffer = new Uint32Array(1);
      window.crypto.getRandomValues(randomBuffer);
      const countRandom = randomBuffer[0] % totalCount;
      setRandomPosition(countRandom);
    }
  };

  createEffect(() => {
    const randomPosition = getRandomPosition();
    if (randomPosition !== null) {
      rowVirtualizer.scrollToIndex(randomPosition, {
        align: "start",
        behavior: "auto",
      });
      if (!files.loading) {
        const file = files()?.[randomPosition];
        if (file?.path) {
          actions.setPathSelected(file.path);
          setRandomPosition(null);
        }
      }
    }
  });

  createEffect(
    on(
      [pathsFiltered, () => store.search],
      () => {
        rowVirtualizer.scrollToOffset(0, {
          align: "start",
        });
      },
      { defer: true }
    )
  );

  return (
    <div class="files div-table overflow-hidden shadow-md relative">
      <button
        onClick={handleRandomPosition}
        class="btn btn-circle"
        style={{
          position: "absolute",
          right: 0,
          "margin-right": "10px",
          "z-index": 100,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M10.8,9.4C9.5,7.7,7.4,6.3,3,6.3C2.6,6.3,2.2,6.6,2.2,7S2.6,7.8,3,7.8c4.5,0,6,1.5,7,3.3c0-0.1,0-0.1,0.1-0.1
            C10.3,10.5,10.5,9.9,10.8,9.4z"
          />
          <path
            d="M17.6,17.8h1.6l-2.5,2.5c-0.3,0.3-0.3,0.8,0,1.1c0.1,0.1,0.3,0.2,0.5,0.2s0.4-0.1,0.5-0.2l3.8-3.8
            c0.1-0.1,0.1-0.2,0.2-0.2c0-0.1,0.1-0.2,0.1-0.3s0-0.2-0.1-0.3c0-0.1-0.1-0.2-0.2-0.2l-3.8-3.8c-0.3-0.3-0.8-0.3-1.1,0
            s-0.3,0.8,0,1.1l2.5,2.5h-1.6c-3.3,0-4.2-1.4-5.1-3.3c-0.2,0.5-0.5,1.1-0.9,1.7C12.6,16.3,14.1,17.8,17.6,17.8z"
          />
          <path
            d="M21.7,6.7c0-0.1-0.1-0.2-0.2-0.2l-3.8-3.8c-0.1-0.1-0.3-0.2-0.5-0.2s-0.4,0.1-0.5,0.2c-0.3,0.3-0.3,0.8,0,1.1l2.5,2.5h-1.6
            c-4,0-5.4,1.9-6.3,3.9c-0.2,0.4-0.3,0.7-0.5,1.1c-0.1,0.3-0.2,0.5-0.3,0.8c-1,2.3-2.3,4.3-7.5,4.3c-0.4,0-0.8,0.3-0.8,0.8
            s0.3,0.8,0.8,0.8c5.1,0,7.1-1.9,8.2-3.9c0.3-0.6,0.6-1.2,0.9-1.8c0-0.1,0.1-0.1,0.1-0.2c0.9-2.3,1.7-4,5.4-4h1.6l-2.5,2.5
            c-0.3,0.3-0.3,0.8,0,1.1c0.1,0.1,0.3,0.2,0.5,0.2s0.4-0.1,0.5-0.2l3.8-3.8c0.1-0.1,0.1-0.2,0.2-0.2c0-0.1,0.1-0.2,0.1-0.3
            S21.7,6.8,21.7,6.7z"
          />
        </svg>
      </button>
      <div
        ref={headerTableRef}
        class="hidden-scrollbar thead flex hide-scrollbar overflow-auto top-0 bg-base-100 z-10"
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
        ref={bodyTableRef}
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
