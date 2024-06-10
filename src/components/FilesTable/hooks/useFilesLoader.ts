import {
  FetchMetadataFilesKeys,
  getDirectoryFiles,
  getMetadataFiles,
  type FetchDirectoryFilesKeys,
} from "@/services/filesServices";
import { MetadataFiles } from "@/services/helpers/helpers";
import { type File as PrismaFile } from "@prisma/client";
import { createEffect, createResource, createSignal, on } from "solid-js";
import { DEFAULT_ITEM_PER_PAGE } from "../constants";

const getCurrentSkipItems = (index: number): number => {
  const calculatedIndex =
    Math.floor(index / DEFAULT_ITEM_PER_PAGE) * DEFAULT_ITEM_PER_PAGE;
  return Math.max(0, calculatedIndex);
};

function useFilesLoader(filteredStartsWith, search) {
  const [skip, setSkip] = createSignal(0);

  const [metadataFiles] = createResource<
    MetadataFiles,
    FetchMetadataFilesKeys,
    boolean
  >(() => [filteredStartsWith(), search()], getMetadataFiles);

  const [files, { mutate: mutateFiles }] = createResource<
    PrismaFile[],
    FetchDirectoryFilesKeys,
    boolean
  >(() => [filteredStartsWith(), search(), skip()], getDirectoryFiles);

  createEffect(
    on(
      [filteredStartsWith, search],
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
}

export default useFilesLoader;
