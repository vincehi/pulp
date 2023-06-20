import type { Component } from "solid-js";
import { SearchProvider } from "./providers/SearchProvider";
import Navbar from "./screens/Main/layouts/Navbar";
import Sidebar from "./screens/Main/layouts/Sidebar";
import ViewFiles from "./screens/Main/layouts/ViewFiles";
import WavePlayer from "@/components/WavePlayer";

const App: Component = () => {
  return (
    <SearchProvider>
      <Navbar/>
      <Sidebar/>
      <div class="relative">
        <ViewFiles/>
        <WavePlayer/>
      </div>
    </SearchProvider>
  );
};

export default App;
