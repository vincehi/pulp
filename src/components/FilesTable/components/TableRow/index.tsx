import { useSearch } from "@/providers/SearchProvider";
import { type Component, For } from "solid-js";
import { flexRender } from "@tanstack/solid-table";

interface Props {
  virtualRow: any;
  tableRow: any;
}

const TableRow: Component<Props> = (props) => {
  const [store, actions] = useSearch();
  return (
    <div
      class="tr"
      classList={{
        active: store.pathSelected === props.tableRow?.original.path,
      }}
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
    >
      <For each={props.tableRow?.getVisibleCells() || []}>
        {(cell) => {
          return (
            <div
              style={{ width: `${cell.column.getSize()}px` }}
              class="th overflow-hidden inline-block"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default TableRow;
