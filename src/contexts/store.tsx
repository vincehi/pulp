import { createContext, ParentComponent, useContext } from "solid-js";
// import { DirectoriesService } from "@/services/directories";

export type RootState = {
  directoriesService: ReturnType<{}>;
};

const rootState: RootState = {
  directoriesService: {},
};

const StoreContext = createContext<RootState>();

export const useAppSelector = () => useContext(StoreContext)!;

export const StoreProvider: ParentComponent = (props) => {
  return (
    <StoreContext.Provider value={rootState}>
      {props.children}
    </StoreContext.Provider>
  );
};
