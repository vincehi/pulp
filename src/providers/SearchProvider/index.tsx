import { ISearchState } from "@/stores/store";
import { createContext, useContext, type Component, type JSX } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

interface Collapsed {
  rootDirectory: string;
  collapsed: string[];
}

interface SearchActions {
  setCollapse: SetStoreFunction<Collapsed[]>;
  setSearch: SetStoreFunction<string>;
  setPathSelected: SetStoreFunction<string>;
}

type SearchStore = [ISearchState, SearchActions];
const SearchContext = createContext<SearchStore>();

export const SearchProvider: Component<{ children: JSX.Element }> = (props) => {
  console.log("SearchProvider");
  return (
    <SearchContext.Provider
      value={
        [
          props.item.data,
          {
            setCollapse: props.item.setCollapse,
            setSearch: props.item.setSearch,
            setPathSelected: props.item.setPathSelected,
          },
        ] as SearchStore
      }
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchStore => {
  const context = useContext<SearchStore | undefined>(SearchContext);
  if (context == null) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
