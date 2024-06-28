import { type Component } from "solid-js";
import AddDirectories from "./components/AddDirectories/AddDirectories";
import Tree from "./components/Tree/Tree";
import TreeProvider from "./components/Tree/TreeProvider";

const Sidebar: Component = () => {
  return (
    <aside
      id="logo-sidebar"
      class="hidden-scrollbar sidebar transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <ul class="sidebar-main px-3 py-4">
        <TreeProvider>
          {(props) => <Tree items={props.mapped()} isRoot={true} />}
        </TreeProvider>
      </ul>
      <div class="sidebar-actions px-3">
        <AddDirectories />
      </div>
    </aside>
  );
};

export default Sidebar;
