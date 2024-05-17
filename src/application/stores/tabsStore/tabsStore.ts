import { appStore, setAppStore } from "@/application/stores/appStore";
import { setLocalStorage } from "@/application/stores/helpers";
import { type ITabs } from "@/application/stores/store";
import { cloneDeep } from "lodash-es";
import { SetStoreFunction } from "solid-js/store";

const initialSearchStore: ITabs = {
  collapsed: {},
  search: "",
  pathSelected: "",
  name: "",
  active: false,
};

const setTabsStore: SetStoreFunction<ITabs[]> = (...args: any[]) => {
  setAppStore("tabs", ...(args as [any]));
  setLocalStorage("app-pulp", appStore.tabs);
};

const addTab = (): void => {
  setTabsStore((t) => [
    ...t,
    { ...cloneDeep(initialSearchStore), name: `Tab ${t.length}` },
  ]);
};

const closeTab = (tabIndex: number): void => {
  setTabsStore((tabs) => {
    return tabs.filter((_, index) => index !== tabIndex);
  });
};

const active = (tabIndex: number): void => {
  setTabsStore({}, (_currentTab, [index]) => {
    return {
      active: tabIndex === index,
    };
  });
};

export default {
  get data() {
    return appStore.tabs;
  },
  setTabsStore,
  addTab,
  active,
  closeTab,
};
