import { type File } from "@prisma/client";
import { type ColumnDef } from "@tanstack/solid-table";

import { tauri } from "@tauri-apps/api";
import prettyMilliseconds from "pretty-ms";
import { Icon } from "solid-heroicons";
import { magnifyingGlass } from "solid-heroicons/solid";

async function openInFinder(path: string, event: Event): Promise<void> {
  event.preventDefault();
  event.stopPropagation();
  await tauri.invoke("open_in_finder", { path });
}

export const filesTableColumns: Array<ColumnDef<File>> = [
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
    accessorKey: "sampleRate",
    header: "Sample Rate",
    cell: (info) => info.getValue() || "-",
  },
  {
    accessorKey: "bitrate",
    header: "Bitrate",
    cell: (info) => info.getValue() || "-",
  },
  {
    accessorKey: "channels",
    header: "Channels",
    cell: (info) => info.getValue() || "-",
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: (info) => {
      const value = info.getValue();
      if (value === null || value === undefined) {
        return "-";
      }
      return prettyMilliseconds(value);
    },
  },
  // {
  //   accessorKey: "bpm",
  //   header: "BPM",
  //   cell: (info) => {
  //     const value = info.getValue() as number;
  //     return isNumber(value) ? round(value, 0) : "-";
  //   },
  // },
  // {
  //   accessorKey: "danceability",
  //   header: "Danceability",
  //   cell: (info) => {
  //     const value = info.getValue() as number;
  //     return isNumber(value) ? round(value, 2) : "-";
  //   },
  // },
  // {
  //   accessorKey: "chordsKey",
  //   header: "Chords Key",
  //   cell: (info) => info.getValue() ?? "-",
  // },
  // {
  //   accessorKey: "chordsScale",
  //   header: "Chords Scale",
  //   cell: (info) => info.getValue() ?? "-",
  // },
  {
    accessorKey: "show",
    header: "",
    cell: (info) => {
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
