import type { Component } from "solid-js";
import { SearchProvider } from "./providers/SearchProvider";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import FilesTable from "./components/FilesTable";
import WavePlayer from "@/components/WavePlayer";
import AnalyzeFilesModal from "@/components/AnalyzeFilesModal";
import { AnalyzeFileProvider } from "@/providers/AnalyzeDirectoryFiles";

const App: Component = () => {
  return (
    <AnalyzeFileProvider>
      <AnalyzeFilesModal />
      <SearchProvider>
        <Navbar />
        <Sidebar />
        <FilesTable />
        <WavePlayer />
      </SearchProvider>
    </AnalyzeFileProvider>
  );
};

export default App;
