import {
  ShareDirectoryFilesKeys,
  getDirectoryFiles,
  getMetadataFiles,
} from "@/services/filesServices";
import { MetadataFiles } from "@/services/helpers/helpers";
import { type File as PrismaFile } from "@prisma/client";
import { Accessor, Resource, createResource } from "solid-js";
import { DEFAULT_ITEM_PER_PAGE } from "../constants";

const getCurrentSkipItems = (index: number): number => {
  const calculatedIndex =
    Math.floor(index / DEFAULT_ITEM_PER_PAGE) * DEFAULT_ITEM_PER_PAGE;
  return Math.max(0, calculatedIndex);
};

interface IFilesLoaderResult {
  files: Resource<PrismaFile[]>;
  metadataFiles: Resource<MetadataFiles>;
  handleSkipUpdate: (value: number) => void;
}

const useFilesLoader: (
  paths: Accessor<string[]>,
  search: Accessor<string>
) => IFilesLoaderResult = (paths, search) => {
  const [metadataFiles] = createResource<
    MetadataFiles,
    ShareDirectoryFilesKeys,
    boolean
  >(() => [paths(), search()], getMetadataFiles);

  const [files, { refetch: refetchFiles }] = createResource<
    PrismaFile[],
    ShareDirectoryFilesKeys,
    number
  >(() => [paths(), search()], getDirectoryFiles);

  return {
    files,
    metadataFiles,
    handleSkipUpdate: (value) => {
      const currentSkipItems = getCurrentSkipItems(value || 0);
      if (currentSkipItems) {
        refetchFiles(currentSkipItems);
      }
    },
  };
};

export default useFilesLoader;
