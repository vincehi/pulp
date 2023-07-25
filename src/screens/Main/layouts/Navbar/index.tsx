import { type Component } from "solid-js";
import { useSearch } from "@/providers/SearchProvider";
import iconUrl from "../../../../assets/icon.png";

const Navbar: Component = () => {
  const [store, actions] = useSearch();

  return (
    <nav class="navbar top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div class="px-3 py-3 lg:px-5 lg:pl-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-start">
            <div class="flex ml-2 md:mr-24">
              <img src={iconUrl} class="h-8 mr-3" alt="FlowBite Logo" />
              <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Pulp
              </span>
            </div>
          </div>

          <div class="flex items-center">
            <input
              type="text"
              placeholder="Search"
              class="input input-bordered input-sm w-full max-w-xs"
              onChange={(event) => {
                actions.setSearch(event.currentTarget.value);
              }}
              value={store.search}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
