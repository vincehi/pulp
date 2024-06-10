import { type Component, createContext, type JSX, useContext } from "solid-js";

interface AppStore {}
const AppContext = createContext<AppStore>();

export const AppProvider: Component<{ children: JSX.Element }> = (props) => {
  const appStore = {};
  return (
    <AppContext.Provider value={appStore}>{props.children}</AppContext.Provider>
  );
};

export const useApp = (): AppStore => {
  const context = useContext<AppStore | undefined>(AppContext);
  if (context == null) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};
