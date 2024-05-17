import { AppProvider } from "@/application/providers/AppProvider";
import { type Component } from "solid-js";
import { SearchView } from "./presentation/views/SearchView.tsx/SearchView";

const App: Component = () => {
  return (
    <AppProvider>
      <SearchView />
    </AppProvider>
  );
};

export default App;
