import { Virtualizer } from "@tanstack/solid-virtual";
import { first, last } from "lodash-es";
import { Component, createEffect } from "solid-js";
import { DEFAULT_ITEM_PER_PAGE } from "../constants";

interface UseUpdateSkipProps {
  enabled: () => boolean;
  rowVirtualizer: Virtualizer<HTMLElement, Element>;
  isItemLoaded: (index: number) => boolean;
  setSkip: (skip: number) => void;
}

// A deplacer dans useFileLoader
// Le setSkip gérera ceci
const getCurrentSkipItems = (index: number) => {
  const calculatedIndex =
    Math.floor(index / DEFAULT_ITEM_PER_PAGE) * DEFAULT_ITEM_PER_PAGE;
  return Math.max(0, calculatedIndex);
};

export const useUpdateSkip: Component<UseUpdateSkipProps> = (props) => {
  createEffect(() => {
    if (props.enabled()) {
      const { overscan } = props.rowVirtualizer.options;

      const virtualItems = props.rowVirtualizer.getVirtualItems();

      const firstIndex = first<any>(virtualItems)?.index;
      const lastIndex = last<any>(virtualItems)?.index;

      const firstItemHasPath = props.isItemLoaded(firstIndex);
      const lastItemHasPath = props.isItemLoaded(lastIndex);
      const firstItemWithOverscanHasPath = props.isItemLoaded(
        firstIndex + overscan
      );
      const lastItemWithOverscanHasPath = props.isItemLoaded(
        lastIndex - overscan
      );

      // Mettre des callback props.handleSkipUpdate
      if (!firstItemWithOverscanHasPath && !!overscan) {
        props.setSkip(getCurrentSkipItems(firstIndex + overscan) || 0);
      } else if (!lastItemWithOverscanHasPath && !!overscan) {
        props.setSkip(getCurrentSkipItems(lastIndex - overscan) || 0);
      } else if (!firstItemHasPath) {
        props.setSkip(getCurrentSkipItems(firstIndex) || 0);
      } else if (!lastItemHasPath) {
        props.setSkip(getCurrentSkipItems(lastIndex) || 0);
      }
    }
  });
};

export default useUpdateSkip;
