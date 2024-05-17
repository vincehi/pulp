import { SearchProvider } from "@/application/providers/SearchProvider/SearchProvider";
import directoriesStore from "@/application/stores/directoriesStore";
import searchStore from "@/application/stores/tabsStore/searchStore";
import tabsStore from "@/application/stores/tabsStore/tabsStore";
import FilesTable from "@/presentation/components/FilesTable/FilesTable";
import Navbar from "@/presentation/components/Navbar/Navbar";
import Tabs from "@/presentation/components/Tabs/Tabs";
import WavePlayer from "@/presentation/components/WavePlayer";
import Sidebar from "@/presentation/views/SearchView.tsx/components/Sidebar/Sidebar";
import { For, Show, onMount } from "solid-js";

export const SearchView = () => {
  onMount(() => {
    void (async () => {
      await directoriesStore.getAllDirectories();
    })();
  });
  return (
    <>
      {/* <AnalyzeFilesModal /> */}
      <Tabs
        setActive={(index) => tabsStore.active(index)}
        newTabFunc={() => {
          tabsStore.addTab();
          tabsStore.active(tabsStore.data.length - 1);
        }}
        tabs={searchStore(tabsStore.data)}
      >
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
