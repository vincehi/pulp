import { createStore } from "solid-js/store";
import { emit, listen } from "@tauri-apps/api/event";

interface Payload {
  processing: boolean;
  file: string;
}

interface AnalyzeFile {
  processing: boolean;
  file: string | null;
}

interface AnalyzeFileActions {
  initEvent: () => Promise<void>;
  stopAnalyzeDirectoryFiles: () => Promise<void>;
}

export type AnalyzeDirectoryFilesStore = [AnalyzeFile, AnalyzeFileActions];

const initialAnalyzeFileState: AnalyzeFile = {
  file: null,
  processing: false,
};

const [eventAnalyzeFile, setEventAnalyzeFile] = createStore(
  initialAnalyzeFileState
);

const initEvent = async (): Promise<void> => {
  await listen<Payload>("analyze-directory-files", ({ payload }) => {
    setEventAnalyzeFile({
      processing: payload.processing,
      file: payload.file,
    });
  });
};

const stopAnalyzeDirectoryFiles = async (): Promise<void> => {
  await emit("stop-analyze-directory-files");
};

export const analyzeDirectoryFilesStore = [
  eventAnalyzeFile,
  {
    initEvent,
    stopAnalyzeDirectoryFiles,
  },
] as AnalyzeDirectoryFilesStore;
