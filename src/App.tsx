import type { Component } from "solid-js";
import Sidebar from "./screens/Main/layouts/Sidebar";
// import { StoreProvider } from "./contexts/store";

const App: Component = () => {
  return (
    // <StoreProvider>
    <Sidebar />
    // </StoreProvider>
  );
};

export default App;
