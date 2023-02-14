import { type MappedDirectory } from "@/providers/TreeProvider";
import { Icon } from "solid-heroicons";
import { folder, folderMinus, folderPlus } from "solid-heroicons/outline";
import { For, Match, Show, Switch, type Component } from "solid-js";
import ActionsDirectory from "../ActionsDirectory";

const Tree: Component<{
  items: MappedDirectory[];
  isRoot?: boolean;
}> = (props) => {
  return (
    <For each={props.items}>
      {(item) => {
        return (
          <li>
            <button
              onClick={item.toggleCollapseItem}
              type="button"
              class="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              <Switch
                fallback={
                  <Icon
                    path={folder}
                    class="flex-shrink-0 w-6 h-6 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                  />
                }
              >
                <Match when={item.isCollapsed}>
                  <Icon
                    path={folderMinus}
                    class="flex-shrink-0 w-6 h-6 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                  />
                </Match>

                <Match when={!item.isCollapsed}>
                  <Icon
                    path={folderPlus}
                    class="flex-shrink-0 w-6 h-6 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                  />
                </Match>
              </Switch>

              <span class="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {item.name}
              </span>
              <Show when={props.isRoot}>
                <div class="flex items-center ml-auto">
                  <ActionsDirectory directory={item} />
                </div>
              </Show>
            </button>
            <Show when={item.isCollapsed}>
              <ul class="ml-4">
                <Tree items={item.children} />
              </ul>
            </Show>
          </li>
        );
      }}
    </For>
  );
};

export default Tree;
