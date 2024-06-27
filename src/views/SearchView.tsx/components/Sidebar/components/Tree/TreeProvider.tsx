import { useSearch } from "@/providers/SearchProvider/SearchProvider";
import {
  getSubDirectories,
  type Directory,
} from "@/services/directoryServices";
import { default as directories } from "@/stores/directoriesStore";
import { type FileEntry } from "@tauri-apps/api/fs";
import { remove, startsWith } from "lodash-es";
import {
  FlowComponent,
  createEffect,
  createResource,
  createSignal,
  mapArray,
  type Component,
} from "solid-js";
import { produce } from "solid-js/store";
import { Dynamic } from "solid-js/web";

import path from '@/lib/nanopath';

console.log(path)

export interface MappedDirectory extends Directory {
  readonly isCollapsed: boolean;
  readonly children: MappedDirectory[];
  toggleCollapseItem: () => void;
}

const TreeProvider: FlowComponent<
  {},
  Component<{
    mapped: () => MappedDirectory[];
  }>
> = (props) => {
  const [store, { setCollapse }] = useSearch();

  createEffect(() => {
    console.log(store.collapsed)
  })

  const toggleCollapseItem = (itemPath: string, isCollapsed: boolean): void => {
    if (isCollapsed) {
      setCollapse(
        produce((items) => {
          remove(
            items,
            (path) => !(itemPath !== path && !startsWith(path, itemPath))
          );
        })
      );
    } else {
      setCollapse((items) => {
        if (items) {
          return [...items, itemPath];
        }
        return [itemPath];
      });
    }
  };

  const isCollapsed = (itemPath: string): boolean => {
    return store.collapsed.some((path) => path === itemPath);
  };

  const mapDirectory = (model: Directory | FileEntry) => {
    const [getCollapsed, setCollapsed] = createSignal(false);

    const fetchDirectories = async (
      collapsed: boolean
    ): Promise<FileEntry[] | never[]> =>
      collapsed ? await getSubDirectories(model.path) : [];

    const [children] = createResource(getCollapsed, fetchDirectories);

    createEffect(() => {
      setCollapsed(() => isCollapsed(model.path));
    });

    createEffect(() => {
      console.log(path.parse(model.path))
    })

    return {
      path: model.path,
      name: model.name,

      get isCollapsed() {
        return getCollapsed();
      },

      get children() {
        return mapped(
          children()?.filter((item) => Array.isArray(item.children))
        )();
      },

      toggleCollapseItem: () => {
        toggleCollapseItem(path.normalize(model.path), getCollapsed());
      },
    };
  };

  const mapped = (child: Directory[] | FileEntry[] | undefined): any =>
    mapArray<Directory | FileEntry, any>(() => child, mapDirectory);

  return (
    <Dynamic component={props.children} mapped={mapped(directories.data)} />
  );
};

export default TreeProvider;
