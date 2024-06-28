import { MetadataFiles, paddedSplice } from "@/services/helpers/helpers";
import { ISearchState } from "@/stores/store";
import { type File as PrismaFile } from "@prisma/client";
import { invoke } from "@tauri-apps/api";
import { type ResourceFetcher } from "solid-js";

export type ShareDirectoryFilesKeys = [
  Array<PrismaFile["path"]>,
  ISearchState["search"]
];
export type FetchDirectoryFilesKeys = [...ShareDirectoryFilesKeys, number];

export type FetchMetadataFilesKeys = [...ShareDirectoryFilesKeys];

export const getDirectoryFiles: ResourceFetcher<
  FetchDirectoryFilesKeys,
  PrismaFile[],
  boolean
> = async ([paths, search, skip], info) => {
  const { value: prevValue } = info;

  const data = await invoke<PrismaFile[]>("get_directory_files", {
    paths,
    search,
    skip,
  });

  return paddedSplice(prevValue, skip, data);
};

export const getMetadataFiles: ResourceFetcher<
  FetchMetadataFilesKeys,
  MetadataFiles,
  boolean
> = async ([paths, search]) => {
  const data = await invoke<MetadataFiles>("get_search_files_metadata", {
    paths,
    search,
  });
  return data;
};

export const openInFinder = (path: string): Promise<void> => {
  return invoke("open_in_finder", { path });
};
