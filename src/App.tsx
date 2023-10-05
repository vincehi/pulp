import type { Component } from "solid-js";
import { SearchProvider } from "./providers/SearchProvider";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import FilesTable from "./components/FilesTable";
import WavePlayer from "@/components/WavePlayer";
import { WalkDirProvider } from "@/providers/WalkDir";

const App: Component = () => {
  return (
    <WalkDirProvider>
      <SearchProvider>
        <Navbar />
        <Sidebar />
        <FilesTable />
        <WavePlayer />
      </SearchProvider>
    </WalkDirProvider>
  );
};

export default App;
