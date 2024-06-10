import { Collapsed, ISearchState, ITabs } from "@/stores/store";
import tabsStore from "@/stores/tabsStore/tabsStore";
import { batch, mapArray } from "solid-js";
import type { SetStoreFunction, StoreSetter } from "solid-js/store";

export default function (list: ITabs[]) {
  return mapArray(
    () => list,
    (model, index) => {
      const setCurrentTabStore: SetStoreFunction<ISearchState> = (
        ...args: any[]
      ) => {
        tabsStore.setTabsStore(index(), ...(args as [any]));
      };

      const setAllCollapse = (...args: Collapsed[]) => {
        batch(() => {
          tabsStore.setTabsStore({}, "collapsed", ...(args as [any]));
        });
      };

      const setCollapse = (...args: Collapsed[]) => {
        batch(() => {
          setCurrentTabStore("collapsed", ...(args as [any]));
        });
      };

      const setSearch = (value: StoreSetter<string, ["search"]>) => {
        setCurrentTabStore("search", value);
      };

      const setPathSelected = (path: StoreSetter<string, ["pathSelected"]>) => {
        setCurrentTabStore("pathSelected", path);
      };

      return {
        get data() {
          return model;
        },
        setAllCollapse,
        setCollapse,
        setSearch,
        setPathSelected,
      };
    }
  );
}
