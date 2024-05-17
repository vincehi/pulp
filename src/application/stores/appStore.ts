import { getLocalStorage } from "@/application/stores/helpers";
import { type ITabs } from "@/application/stores/store";
import type { Directory } from "@/infrastructure/services/directoryServices";
import { cloneDeep } from "lodash-es";
import { createStore } from "solid-js/store";

export const initialDirectoriesStore: Directory[] = [];
export const initialTabsStore: ITabs[] = getLocalStorage("app-pulp", []);

const initialAppStore = {
  directories: initialDirectoriesStore,
  tabs: initialTabsStore,
};

export const [appStore, setAppStore] = createStore(cloneDeep(initialAppStore));
