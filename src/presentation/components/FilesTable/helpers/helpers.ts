import { ISearchState } from "@/application/stores/store";
import { type File } from "@prisma/client";
import { invoke } from "@tauri-apps/api";
import { some, startsWith } from "lodash-es";
import { type ResourceFetcher } from "solid-js";

export type FetchDirectoryFilesKeys = [
  Array<File["path"]>,
  ISearchState["search"]
];

export type FetchMetadataFilesKeys = [...FetchDirectoryFilesKeys, string];

export interface FilePosition {
  total_count: number;
  selected_position: number;
}

export const fetchMetadataFiles: ResourceFetcher<
  FetchMetadataFilesKeys,
  FilePosition,
  boolean
> = async ([paths, search]) => {
  const data = await invoke<FilePosition>("get_search_files_metadata", {
    paths,
    search,
  });
  return data;
};

// customSplice splice but if startIndex > originalArray complet with empty object
export function paddedSplice(originalArray = [], startIndex, dataToInsert) {
  const diff = Math.max(0, startIndex - originalArray.length);

  let newOriginalArray = originalArray.concat(new Array(diff).fill({}));

  newOriginalArray.splice(startIndex, dataToInsert.length, ...dataToInsert);

  return newOriginalArray;
}

export const fetchDirectoryFiles: ResourceFetcher<
  FetchDirectoryFilesKeys,
  File[],
  boolean
> = async ([paths, search, skip], prevData) => {
  const { value: prevValue, refetching } = prevData;

  const data = await invoke<File[]>("get_directory_files", {
    paths,
    search,
    skip,
  });
  return paddedSplice(prevValue, skip, data);
};

export const filterStartsWith = (arr: string[]): string[] => {
  return arr.filter((item, index) => {
    return !some(arr, (otherItem, otherIndex) => {
      return otherIndex !== index && startsWith(otherItem, item);
    });
  });
};
