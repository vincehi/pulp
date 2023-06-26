import { type Component, createContext, type JSX, useContext } from "solid-js";
import { listen } from "@tauri-apps/api/event";
import { createStore } from "solid-js/store";

interface Payload {
  processing: boolean;
  directory_path: string;
}

interface WalkDirhState {
  pathDirectory: string | null;
  processing: boolean;
}

interface WalkDirActions {
  stopWalkDir: () => void;
}

type WalkDirStore = [WalkDirhState, WalkDirActions];

const WalkDirContext = createContext<WalkDirStore>();

const initialWalkDirhState: WalkDirhState = {
  pathDirectory: null,
  processing: false,
};
export const WalkDirProvider: Component<{ children: JSX.Element }> = (
  props
) => {
  const [eventWalkDir, setEventWalkDir] = createStore(initialWalkDirhState);

  void (async () => {
    await listen<Payload>("event-walk-directory", ({ payload }) => {
      setEventWalkDir({
        processing: payload.processing,
        pathDirectory: payload.directory_path,
      });
    });
  })();

  const walkDirStore = [
    eventWalkDir,
    {
      stopWalkDir: () => {
        console.log("Stop walkDir");
      },
    },
  ] as WalkDirStore;

  return (
    <WalkDirContext.Provider value={walkDirStore}>
      {props.children}
    </WalkDirContext.Provider>
  );
};

export const useWalkDir = (): WalkDirStore => {
  const context = useContext<WalkDirStore | undefined>(WalkDirContext);
  if (context == null) {
    throw new Error("useWalkDir must be used within a WalkDirProvider");
  }
  return context;
};
