import tabsStore from "@/application/stores/tabsStore/tabsStore";
import { Icon } from "solid-heroicons";
import { plus, xMark } from "solid-heroicons/outline";
import { Component, FlowComponent, For } from "solid-js";
import { Dynamic } from "solid-js/web";

interface Props {
  setActive: (tabIndex: number) => void;
  newTabFunc: () => void;
  tabs: any;
}

const Tabs: FlowComponent<Props, Component<any>> = (props) => {
  return (
    <>
      <div class="tabs tabs-boxed tabs-xs flex items-center rounded-none">
        <For each={tabsStore.data}>
          {(item, index) => {
            return (
              <>
                <a
                  onClick={() => props.setActive(index())}
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
        <button class="btn btn-sm btn-square ml-2" onClick={props.newTabFunc}>
          <Icon path={plus} class="flex-shrink-0 w-4" />
        </button>
      </div>
      <Dynamic component={props.children} tabs={props.tabs} />
    </>
  );
};
export default Tabs;
