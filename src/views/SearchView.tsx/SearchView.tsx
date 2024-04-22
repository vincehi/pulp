import AnalyzeFilesModal from "@/components/AnalyzeFilesModal";
import FilesTable from "@/components/FilesTable";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Tabs from "@/components/Tabs";
import WavePlayer from "@/components/WavePlayer";
import { SearchProvider } from "@/providers/SearchProvider";
import directoriesStore from "@/stores/directoriesStore";
import { For, Show, onMount } from "solid-js";

export const SearchView = () => {
  onMount(() => {
    void (async () => {
      await directoriesStore.getAllDirectories();
    })();
  });
  return (
    <>
      <AnalyzeFilesModal />
      <Tabs>
        {(props) => {
          return (
            <For each={props.tabs()}>
              {(item, index) => {
                return (
                  <Show when={item.data.active}>
                    <SearchProvider item={item}>
                      <Navbar />
                      <Sidebar />
                      <FilesTable />
                      <WavePlayer />
                    </SearchProvider>
                  </Show>
                );
              }}
            </For>
          );
        }}
      </Tabs>
    </>
  );
};
