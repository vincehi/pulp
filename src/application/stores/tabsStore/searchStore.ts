import { Collapsed, ISearchState, ITabs } from "@/application/stores/store";
import tabsStore from "@/application/stores/tabsStore/tabsStore";
import { batch, mapArray } from "solid-js";
import type { SetStoreFunction, StoreSetter } from "solid-js/store";

export default function (list: ITabs[]) {
  return mapArray(
    () => list,
    (model, index) => {
      const setStore: SetStoreFunction<ISearchState> = (...args: any[]) => {
        tabsStore.setTabsStore(index(), ...(args as [any]));
      };

      const setCollapse = (...args: Collapsed[]) => {
        batch(() => {
          setStore("collapsed", ...(args as [any]));
        });
      };

      const setSearch = (value: StoreSetter<string, ["search"]>) => {
        setStore("search", value);
      };

      const setPathSelected = (path: StoreSetter<string, ["pathSelected"]>) => {
        setStore("pathSelected", path);
      };

      return {
        get data() {
          return model;
        },
        setCollapse,
        setSearch,
        setPathSelected,
      };
    }
  );
}
