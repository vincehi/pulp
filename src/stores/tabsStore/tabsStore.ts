import { setPersistentStorage } from "@/services/storageServices";
import { appStore, setAppStore } from "@/stores/appStore";
import { type ITabs } from "@/stores/store";
import { cloneDeep } from "lodash-es";
import { SetStoreFunction } from "solid-js/store";

export const initialSearchStore: ITabs = {
  collapsed: [],
  search: "",
  pathSelected: "",
  name: "",
  active: false,
};

const setTabsStore: SetStoreFunction<ITabs[]> = (...args: any[]) => {
  setAppStore("tabs", ...(args as [any]));
  setPersistentStorage("app-pulp", appStore.tabs);
};

const addTab = (): void => {
  setTabsStore((tabs) => [
    ...tabs,
    { ...cloneDeep(initialSearchStore), name: `Tab ${tabs.length + 1}` },
  ]);
};

const closeTab = (tabIndex: number): void => {
  setTabsStore((tabs) => {
    return tabs.filter((_, index) => index !== tabIndex);
  });
};

const activateNextOrPreviousTab = (tabIndex: number): void => {
  const nextIndex =
    tabIndex + 1 < appStore.tabs.length ? tabIndex + 1 : tabIndex - 1;
  active(nextIndex);
};

const active = (tabIndex: number): void => {
  setTabsStore({}, (_currentTab, [index]) => {
    return {
      active: tabIndex === index,
    };
  });
};

const rename = (tabIndex: number, name: string): void => {
  setTabsStore(tabIndex, "name", name);
};

export default {
  get data() {
    return appStore.tabs;
  },
  setTabsStore,
  addTab,
  active,
  closeTab,
  activateNextOrPreviousTab,
  rename,
};
