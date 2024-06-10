import { AppProvider } from "@/providers/AppProvider";
import { type Component } from "solid-js";
import AnalyzeFilesModal from "./components/AnalyzeFilesModal/AnalyzeFilesModal";
import { SearchView } from "./views/SearchView.tsx/SearchView";

const App: Component = () => {
  return (
    <AppProvider>
      <AnalyzeFilesModal />
      <SearchView />
    </AppProvider>
  );
};

export default App;
