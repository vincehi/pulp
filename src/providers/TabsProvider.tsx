import { type Component, createContext, type JSX, useContext } from "solid-js";

interface TabsStore {}
const TabsContext = createContext<TabsStore>();

export const TabsProvider: Component<{ children: JSX.Element }> = (props) => {
  return (
    <TabsContext.Provider value={tabsStore}>
      {props.children}
    </TabsContext.Provider>
  );
};

export const useTabs = (): TabsStore => {
  const context = useContext<TabsStore | undefined>(TabsContext);
  if (context == null) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};
