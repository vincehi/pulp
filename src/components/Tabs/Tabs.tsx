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
              <div class="tab flex-shrink-0 flex items-center" classList={{ "tab-active": item.active }}>
                <label class="input-sizer" data-value={item.name}>
                  <input
                    ref={setTarget}
                    type="text"
                    value={item.name}
                    readOnly={!getRenamingMode()}
                    class="appearance-none bg-transparent border-none focus:outline-none cursor-pointer"
                    classList={{
                      "cursor-text": getRenamingMode(),
                    }}
                    onClick={(event) => {
                      if (!getRenamingMode()) {
                        props.setActive(index());
                      }
                    }}
                    onDblClick={(event) => {
                      event.preventDefault();
                      setRenamingMode(true);
                      setFocused(true);
                      target()?.select();
                    }}
                    onBlur={() => setRenamingMode(false)}
                    onInput={(event) => {
                      tabsStore.rename(index(), event.target.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        setRenamingMode(false);
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
              </div>
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
