import { type Component, createContext, type JSX, useContext } from "solid-js";
import { emit, listen } from "@tauri-apps/api/event";
import { createStore } from "solid-js/store";

interface Payload {
  processing: boolean;
  file: string;
}

interface AnalyzeFile {
  processing: boolean;
  file: string | null;
}

interface AnalyzeFileActions {
  stopAnalyzeDirectoryFiles: () => void;
}

type AnalyzeDirectoryFilesStore = [AnalyzeFile, AnalyzeFileActions];

const AnalyzeDirectoryFilesContext =
  createContext<AnalyzeDirectoryFilesStore>();

const initialAnalyzeFileState: AnalyzeFile = {
  file: null,
  processing: false,
};
export const AnalyzeFileProvider: Component<{ children: JSX.Element }> = (
  props
) => {
  const [eventAnalyzeFile, setEventAnalyzeFile] = createStore(
    initialAnalyzeFileState
  );

  void (async () => {
    await listen<Payload>("analyze-directory-files", ({ payload }) => {
      setEventAnalyzeFile({
        processing: payload.processing,
        file: payload.file,
      });
    });
  })();

  const stopAnalyzeDirectoryFiles = (): void => {
    void (async () => {
      await emit("stop-analyze-directory-files");
    })();
  };

  const analyzeDirectoryFilesStore = [
    eventAnalyzeFile,
    {
      stopAnalyzeDirectoryFiles,
    },
  ] as AnalyzeDirectoryFilesStore;

  return (
    <AnalyzeDirectoryFilesContext.Provider value={analyzeDirectoryFilesStore}>
      {props.children}
    </AnalyzeDirectoryFilesContext.Provider>
  );
};

export const useAnalyzeDirectoryFiles = (): AnalyzeDirectoryFilesStore => {
  const context = useContext<AnalyzeDirectoryFilesStore | undefined>(
    AnalyzeDirectoryFilesContext
  );
  if (context == null) {
    throw new Error(
      "useAnalyzeDirectoryFiles must be used within a AnalyzeFileProvider"
    );
  }
  return context;
};
