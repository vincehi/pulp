import { useSearch } from "@/application/providers/SearchProvider/SearchProvider";
import {
  default as directories,
  default as directoriesStore,
} from "@/application/stores/directoriesStore";
import { type Directory } from "@/infrastructure/services/directoryServices";
import { readDir, type FileEntry } from "@tauri-apps/api/fs";
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

  // createEffect(() => {
  //   setCollapse((prevCollapsed) => {
  //     return directories.data.map((dir) => {
  //       const dirPath = dir.path;
  //       const currentCollapsed = prevCollapsed.find(({ rootDirectory }) =>
  //         startsWith(dirPath, rootDirectory)
  //       );
  //       return {
  //         rootDirectory: dirPath,
  //         collapsed: currentCollapsed != null ? currentCollapsed.collapsed : [],
  //       };
  //     });
  //   });
  // });

  const toggleCollapseItem = (itemPath: string, isCollapsed: boolean): void => {
    const itemPathSlash = itemPath + "/";
    const currentKey = directoriesStore.data.find((item) =>
      startsWith(itemPathSlash, item.path)
    ).path;

    switch (isCollapsed) {
      case true: {
        setCollapse(
          currentKey,
          produce((items) => {
            remove(
              items,
              (path) =>
                !(itemPathSlash !== path && !startsWith(path, itemPathSlash))
            );
          })
        );
        break;
      }
      case false: {
        setCollapse(currentKey, (items) => {
          if (items) {
            return [...items, itemPathSlash];
          }
          return [itemPathSlash];
        });
        // setCollapse(index, "collapsed", (items) => [...items, itemPathSlash]);
        break;
      }
    }
  };

  const isCollapsed = (itemPath: string): boolean => {
    const currentKey = Object.keys(store.collapsed).find((item) =>
      startsWith(itemPath, item)
    );
    return (
      Boolean(
        store.collapsed[currentKey]?.some((path) => path === itemPath + "/") ??
          false // TODO: I think `?? false` is not utilized
      ) || false
    );
  };

  const mapped = (child: Directory[] | FileEntry[] | undefined): any =>
    mapArray<Directory | FileEntry, any>(
      () => child,
      (model) => {
        const [getCollapsed, setCollapsed] = createSignal(false);

        const fetchDir = async (
          collapsed: boolean
        ): Promise<FileEntry[] | never[]> =>
          collapsed
            ? await readDir(model.path, {
                recursive: false,
              })
            : [];

        const [children] = createResource(getCollapsed, fetchDir);

        createEffect(() => {
          setCollapsed(() => isCollapsed(model.path));
        });

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
            toggleCollapseItem(model.path, getCollapsed());
          },
        };
      }
    );

  return (
    <Dynamic component={props.children} mapped={mapped(directories.data)} />
  );
};

export default TreeProvider;
