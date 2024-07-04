import { DEFAULT_ITEM_PER_PAGE } from "@/components/FilesTable/constants";
import { MetadataFiles, paddedSplice } from "@/services/helpers/helpers";
import { ISearchState } from "@/stores/store";
import { type File as PrismaFile } from "@prisma/client";
import { invoke } from "@tauri-apps/api";
import { isNumber } from "lodash-es";
import { type ResourceFetcher } from "solid-js";

export type ShareDirectoryFilesKeys = [
  Array<PrismaFile["path"]>,
  ISearchState["search"]
];

export const getDirectoryFiles: ResourceFetcher<
  ShareDirectoryFilesKeys,
  PrismaFile[],
  number
> = async ([paths, search], info) => {
  const { value: prevValue, refetching } = info;

  if (isNumber(refetching)) {
    const data = await invoke<PrismaFile[]>("get_directory_files", {
      paths,
      search,
      take: DEFAULT_ITEM_PER_PAGE,
      skip: refetching,
    });
    return paddedSplice(prevValue, refetching, data);
  }

  const data = await invoke<PrismaFile[]>("get_directory_files", {
    paths,
    search,
    take: DEFAULT_ITEM_PER_PAGE,
    skip: 0,
  });

  return data;
};

export const getMetadataFiles: ResourceFetcher<
  ShareDirectoryFilesKeys,
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
