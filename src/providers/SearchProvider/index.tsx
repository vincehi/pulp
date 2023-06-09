import { directories, getAllDirectories } from "@/services/directories";
import {
  batch,
  createContext,
  onMount,
  useContext,
  type Component,
  type JSX,
} from "solid-js";
import {
  createStore,
  type StoreSetter,
  type SetStoreFunction,
} from "solid-js/store";

interface Collapsed {
  rootDirectory: string;
  collapsed: string[];
}

interface SearchState {
  collapsed: Collapsed[];
  search: string;
  pathSelected: string;
  autoPlay: boolean
}

interface SearchActions {
  setCollapse: SetStoreFunction<Collapsed[]>;
  setSearch: SetStoreFunction<string>;
  setPathSelected: SetStoreFunction<string>;
  toggleAutoPlay: () => void;
}

type SearchStore = [SearchState, SearchActions];

const initialSearchStore: SearchState = {
  collapsed: directories.map((dir) => ({
    rootDirectory: dir.path,
    collapsed: [],
  })),
  search: "",
  pathSelected: "",
  autoPlay: false
};

const SearchContext = createContext<SearchStore>();

export const SearchProvider: Component<{ children: JSX.Element }> = (props) => {
  onMount(() => {
    void (async () => {
      await getAllDirectories();
    })();
  });

  const [store, setStore] = createStore<SearchState>(initialSearchStore);

  const searchStore = [
    store,
    {
      setCollapse: (...args: Collapsed[]) => {
        batch(() => {
          setStore("collapsed", ...(args as [any]));
        });
      },
      setSearch: (value: StoreSetter<string, ["search"]>) => {
        setStore("search", value);
      },
      setPathSelected: (path: StoreSetter<string, ["pathSelected"]>) => {
        setStore("pathSelected", path);
      },
      toggleAutoPlay: () => {
        setStore("autoPlay", (item) => !item);
      },
    },
  ] as SearchStore;

  return (
    <SearchContext.Provider value={searchStore}>
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