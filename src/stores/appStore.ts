import type { Directory } from "@/services/directoryServices";
import { getLocalStorage } from "@/stores/helpers";
import { type ITabs } from "@/stores/store";
import { cloneDeep } from "lodash-es";
import { createStore } from "solid-js/store";

export const initialDirectoriesStore: Directory[] = [];
export const initialTabsStore: ITabs[] = getLocalStorage("app-pulp", []);

const initialAppStore = {
  directories: initialDirectoriesStore,
  tabs: initialTabsStore,
};

export const [appStore, setAppStore] = createStore(cloneDeep(initialAppStore));
