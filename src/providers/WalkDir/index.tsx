import { type Component, createContext, type JSX, useContext } from "solid-js";
import { listen } from "@tauri-apps/api/event";
import { createStore } from "solid-js/store";

interface Payload {
  processing: boolean;
  file: string;
}

interface WalkDirhState {
  processing: boolean;
  file: string | null;
}

interface WalkDirActions {
  stopWalkDir: () => void;
}

type WalkDirStore = [WalkDirhState, WalkDirActions];

const WalkDirContext = createContext<WalkDirStore>();

const initialWalkDirhState: WalkDirhState = {
  file: null,
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
        file: payload.file,
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
      <input
        type="checkbox"
        id="my_modal_6"
        class="modal-toggle"
        checked={eventWalkDir.processing}
      />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">File analysis</h3>
          <div class="py-4 flex items-center">
            <span class="loading loading-ring loading-xs shrink-0 mr-2" />
            {eventWalkDir.file}
          </div>
          <small class="py-4">Please be patient, this may take some time</small>
        </div>
      </div>
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
