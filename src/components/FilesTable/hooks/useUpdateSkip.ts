import { VirtualItem } from "@tanstack/solid-virtual";
import { first, last } from "lodash-es";
import { createEffect } from "solid-js";

interface UseUpdateSkipProps {
  enabled: () => boolean;
  getVirtualItems: () => VirtualItem[];
  overscan: number;
  isItemLoaded: (index: number) => boolean;
  handleSkipUpdate: (skip: number) => void;
}

export const useUpdateSkip: (props: UseUpdateSkipProps) => void = (props) => {
  createEffect(() => {
    if (props.enabled()) {
      const virtualItems = props.getVirtualItems();

      const firstIndex = first<any>(virtualItems)?.index;
      const lastIndex = last<any>(virtualItems)?.index;

      const firstItemLoaded = props.isItemLoaded(firstIndex);
      const lastItemLoaded = props.isItemLoaded(lastIndex);
      const firstItemWithOverscanLoaded = props.isItemLoaded(
        firstIndex + props.overscan
      );
      const lastItemWithOverscanLoaded = props.isItemLoaded(
        lastIndex - props.overscan
      );

      if (!firstItemWithOverscanLoaded) {
        props.handleSkipUpdate(firstIndex + props.overscan);
      } else if (!lastItemWithOverscanLoaded) {
        props.handleSkipUpdate(lastIndex - props.overscan);
      } else if (!firstItemLoaded) {
        props.handleSkipUpdate(firstIndex);
      } else if (!lastItemLoaded) {
        props.handleSkipUpdate(lastIndex);
      }
    }
  });
};

export default useUpdateSkip;
