import {
  FetchMetadataFilesKeys,
  getDirectoryFiles,
  getMetadataFiles,
  type FetchDirectoryFilesKeys,
} from "@/services/filesServices";
import { MetadataFiles } from "@/services/helpers/helpers";
import { type File as PrismaFile } from "@prisma/client";
import {
  Accessor,
  Resource,
  createEffect,
  createResource,
  createSignal,
  on,
} from "solid-js";
import { DEFAULT_ITEM_PER_PAGE } from "../constants";

const getCurrentSkipItems = (index: number): number => {
  const calculatedIndex =
    Math.floor(index / DEFAULT_ITEM_PER_PAGE) * DEFAULT_ITEM_PER_PAGE;
  return Math.max(0, calculatedIndex);
};

interface IFilesLoaderResult {
  files: Resource<PrismaFile[]>;
  metadataFiles: Resource<MetadataFiles>;
  handleSkipUpdate: (value: number) => number;
}

const useFilesLoader: (
  paths: Accessor<string[]>,
  search: Accessor<string>
) => IFilesLoaderResult = (paths, search) => {
  const [skip, setSkip] = createSignal(0);

  const [metadataFiles] = createResource<
    MetadataFiles,
    FetchMetadataFilesKeys,
    boolean
  >(() => [paths(), search()], getMetadataFiles);

  const [files, { mutate: mutateFiles }] = createResource<
    PrismaFile[],
    FetchDirectoryFilesKeys,
    boolean
  >(() => [paths(), search(), skip()], getDirectoryFiles);

  createEffect(
    on(
      [paths, search],
      () => {
        mutateFiles([]);
        setSkip(0);
      },
      { defer: true }
    )
  );

  return {
    files,
    metadataFiles,
    handleSkipUpdate: (value) => {
      return setSkip(getCurrentSkipItems(value || 0));
    },
  };
};

export default useFilesLoader;
