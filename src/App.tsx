import AnalyzeFilesModal from "@/components/AnalyzeFilesModal";
import Tabs from "@/components/Tabs";
import { AppProvider } from "@/providers/AppProvider";
import directoriesStore from "@/stores/directoriesStore";
import { For, Show, onMount, type Component } from "solid-js";
import FilesTable from "./components/FilesTable";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import WavePlayer from "./components/WavePlayer";
import { SearchProvider } from "./providers/SearchProvider";
import { SearchView } from "./views/SearchView.tsx/SearchView";

const App: Component = () => {
  return (
    <AppProvider>
      <SearchView />
    </AppProvider>
  );
};

export default App;
