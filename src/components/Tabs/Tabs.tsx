import tabsStore from "@/stores/tabsStore/tabsStore";
import { Icon } from "solid-heroicons";
import { plus, xMark } from "solid-heroicons/outline";
import { Component, FlowComponent, For, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useFocus } from "solidjs-use";

interface Props {
  setActive: (tabIndex: number) => void;
  newTabFunc: () => void;
  tabs: any;
}

const Tabs: FlowComponent<Props, Component<any>> = (props) => {
  return (
    <>
      <div class="tabs tabs-boxed tabs-xs flex items-center rounded-none overflow-x-auto flex-nowrap">
        <For each={tabsStore.data}>
          {(item, index) => {
            const [target, setTarget] = createSignal<HTMLInputElement>();
            const [, setFocused] = useFocus(target);
            const [getRenamingMode, setRenamingMode] = createSignal(false);

            return (
              <a
                ondblclick={(event) => {
                  event.stopPropagation();
                  setRenamingMode(true);
                  setFocused(true);
                  target()?.select();
                }}
                onClick={() => props.setActive(index())}
                class="tab flex-shrink-0"
                classList={{
                  "tab-active": item.active,
                }}
              >
                <label
                  classList={{
                    "cursor-pointer": !getRenamingMode(),
                  }}
                  class="input-sizer"
                  data-value={item.name}
                >
                  <input
                    classList={{
                      "pointer-events-none": !getRenamingMode(),
                    }}
                    ref={setTarget}
                    type="text"
                    value={item.name}
                    disabled={!getRenamingMode()}
                    onBlur={() => {
                      window.getSelection()?.removeAllRanges(); // TODO: unselectinput
                      setRenamingMode(false);
                    }}
                    onInput={(event) => {
                      tabsStore.rename(index(), event.target.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        setFocused(false);
                      }
                    }}
                  />
                </label>

                <button
                  class="ml-4 currentColor"
                  onClick={(event) => {
                    event.stopPropagation();
                    tabsStore.activateNextOrPreviousTab(index());
                    tabsStore.closeTab(index());
                  }}
                >
                  <Icon path={xMark} class="flex-shrink-0 w-4" />
                </button>
              </a>
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
