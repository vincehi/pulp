import searchStore from "@/stores/tabsStore/searchStore";
import tabsStore from "@/stores/tabsStore/tabsStore";
import { Icon } from "solid-heroicons";
import { plus, xMark } from "solid-heroicons/outline";
import { Component, FlowComponent, For } from "solid-js";
import { Dynamic } from "solid-js/web";

const Tabs: FlowComponent<{}, Component<any>> = (props) => {
  const newTab = () => {
    tabsStore.addTab();
    tabsStore.active(tabsStore.data.length - 1);
  };

  return (
    <>
      <div class="tabs tabs-boxed tabs-xs flex items-center rounded-none">
        <For each={tabsStore.data}>
          {(item, index) => {
            return (
              <>
                <a
                  onClick={() => tabsStore.active(index())}
                  class="tab"
                  classList={{
                    "tab-active": item.active,
                  }}
                >
                  {item.name || `Tab ${index()}`}
                  <button
                    class="ml-4 currentColor"
                    onClick={(event) => {
                      event.stopPropagation();
                      tabsStore.closeTab(index());
                    }}
                  >
                    <Icon path={xMark} class="flex-shrink-0 w-4" />
                  </button>
                </a>
              </>
            );
          }}
        </For>
        <button class="btn btn-sm btn-square ml-2" onClick={newTab}>
          <Icon path={plus} class="flex-shrink-0 w-4" />
        </button>
      </div>
      <Dynamic component={props.children} tabs={searchStore(tabsStore.data)} />
    </>
  );
};
export default Tabs;
