import { type MappedDirectory } from "@/providers/TreeProvider";
import { Icon } from "solid-heroicons";
import { folder } from "solid-heroicons/outline";
import { For, Show, type Component } from "solid-js";
import ActionsDirectory from "../ActionsDirectory";
import clsx from "clsx";

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
              class={clsx(
                "btn btn-ghost btn-sm btn-block flex items-center flex-nowrap justify-start mb-1 normal-case",
                item.isCollapsed && "btn-active"
              )}
            >
              <Icon
                path={folder}
                class="flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
              />
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
