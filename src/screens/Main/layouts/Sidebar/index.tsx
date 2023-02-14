import AddDirectories from "@/components/AddDirectories";
import Tree from "@/components/Tree";
import TreeProvider from "@/providers/TreeProvider";
import { type Component } from "solid-js";

const Sidebar: Component = () => {
  return (
    <aside
      id="logo-sidebar"
      class="sidebar transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <div class="px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul class="space-y-2">
          <TreeProvider>
            {(props) => <Tree items={props.mapped()} isRoot={true} />}
          </TreeProvider>

          <li>
            <AddDirectories />
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
