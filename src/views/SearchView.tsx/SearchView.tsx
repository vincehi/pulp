import FilesTable from "@/components/FilesTable/FilesTable";
import Navbar from "@/components/Navbar/Navbar";
import Tabs from "@/components/Tabs/Tabs";
import WavePlayer from "@/components/WavePlayer/WavePlayer";
import { SearchProvider } from "@/providers/SearchProvider/SearchProvider";
import directoriesStore from "@/stores/directoriesStore";
import searchStore from "@/stores/tabsStore/searchStore";
import tabsStore from "@/stores/tabsStore/tabsStore";
import Sidebar from "@/views/SearchView.tsx/components/Sidebar/Sidebar";
import { For, Show, onMount } from "solid-js";

export const SearchView = () => {
  onMount(() => {
    void (async () => {
      await directoriesStore.getAllDirectories();
    })();
  });

  return (
    <>
      <Tabs
        setActive={(index) => tabsStore.active(index)}
        newTabFunc={() => {
          tabsStore.addTab();
          tabsStore.active(tabsStore.data.length - 1);
        }}
        tabs={searchStore(tabsStore.data)}
      >
        {(props) => (
          <For each={props.tabs()}>
            {(item) => (
              <Show when={item.data.active}>
                <SearchProvider item={item}>
                  <Navbar />
                  <Sidebar />
                  <FilesTable />
                  <WavePlayer />
                </SearchProvider>
              </Show>
            )}
          </For>
        )}
      </Tabs>
    </>
  );
};
