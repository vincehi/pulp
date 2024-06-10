import type { Directory } from "@/services/directoryServices";
import { getPersistentStorage } from "@/services/storageServices";
import { type ITabs } from "@/stores/store";
import { cloneDeep } from "lodash-es";
import { createStore } from "solid-js/store";

export const initialDirectoriesStore: Directory[] = [];
export const initialTabsStore: ITabs[] = getPersistentStorage("app-pulp", []);

const initialAppStore = {
  directories: initialDirectoriesStore,
  tabs: initialTabsStore,
};

export const [appStore, setAppStore] = createStore(cloneDeep(initialAppStore));
