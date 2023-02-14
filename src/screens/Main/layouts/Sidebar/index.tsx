import AddDirectories from "@/components/AddDirectories";
import RowDirectory from "@/components/RowDirectory";
import { directories, getAllDirectories } from "@/services/directories";
import { For, onMount, type Component } from "solid-js";

const Sidebar: Component = () => {
  onMount(() => {
    void (async () => {
      await getAllDirectories();
    })();
  });
  return (
    <div>
      <For each={directories}>
        {(directory, index) => <RowDirectory directory={directory} />}
      </For>
      <AddDirectories />
    </div>
  );
};

export default Sidebar;
