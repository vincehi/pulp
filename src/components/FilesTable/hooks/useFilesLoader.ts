import {
  FetchMetadataFilesKeys,
  getDirectoryFiles,
  getMetadataFiles,
  type FetchDirectoryFilesKeys,
} from "@/services/filesServices";
import { MetadataFiles } from "@/services/helpers/helpers";
import { type File as PrismaFile } from "@prisma/client";
import { createEffect, createResource, createSignal, on } from "solid-js";

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

  return { files, metadataFiles, setSkip, skip };
}

export default useFilesLoader;
