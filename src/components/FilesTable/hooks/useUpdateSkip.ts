import { Virtualizer } from "@tanstack/solid-virtual";
import { first, last } from "lodash-es";
import { Component, createEffect } from "solid-js";

interface UseUpdateSkipProps {
  enabled: () => boolean;
  rowVirtualizer: Virtualizer<HTMLElement, Element>;
  isItemLoaded: (index: number) => boolean;
  handleSkipUpdate: (skip: number) => void;
}

export const useUpdateSkip: Component<UseUpdateSkipProps> = (props) => {
  createEffect(() => {
    if (props.enabled()) {
      const { overscan } = props.rowVirtualizer.options;

      const virtualItems = props.rowVirtualizer.getVirtualItems();

      const firstIndex = first<any>(virtualItems)?.index;
      const lastIndex = last<any>(virtualItems)?.index;

      const firstItemLoaded = props.isItemLoaded(firstIndex);
      const lastItemLoaded = props.isItemLoaded(lastIndex);
      const firstItemWithOverscanLoaded = props.isItemLoaded(
        firstIndex + overscan
      );
      const lastItemWithOverscanLoaded = props.isItemLoaded(
        lastIndex - overscan
      );

      // Mettre des callback props.handleSkipUpdate
      if (!firstItemWithOverscanLoaded) {
        props.handleSkipUpdate(firstIndex + overscan);
      } else if (!lastItemWithOverscanLoaded) {
        props.handleSkipUpdate(lastIndex - overscan);
      } else if (!firstItemLoaded) {
        props.handleSkipUpdate(firstIndex);
      } else if (!lastItemLoaded) {
        props.handleSkipUpdate(lastIndex);
      }
    }
  });
};

export default useUpdateSkip;
