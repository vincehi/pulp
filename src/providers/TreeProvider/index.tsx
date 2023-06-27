import { directories, type Directory } from "@/services/directories";
import { readDir, type FileEntry } from "@tauri-apps/api/fs";
import { remove, startsWith } from "lodash-es";
import {
  createEffect,
  createResource,
  createSignal,
  mapArray,
  type Component,
} from "solid-js";
import { produce } from "solid-js/store";
import { Dynamic } from "solid-js/web";
import { useSearch } from "../SearchProvider";

export interface MappedDirectory extends Directory {
  readonly isCollapsed: boolean;
  readonly children: MappedDirectory[];
  toggleCollapseItem: () => void;
}

const TreeProvider: Component<{
  children: Component<{
    mapped: () => MappedDirectory[];
  }>;
}> = (props) => {
  const [store, { setCollapse }] = useSearch();

  createEffect(() => {
    setCollapse((prevCollapsed) => {
      return directories.map((dir) => {
        const dirPath = dir.path;
        const currentCollapsed = prevCollapsed.find(({ rootDirectory }) =>
          startsWith(dirPath, rootDirectory)
        );
        return {
          rootDirectory: dirPath,
          collapsed: currentCollapsed != null ? currentCollapsed.collapsed : [],
        };
      });
    });
  });

  const toggleCollapseItem = (itemPath: string, isCollapsed: boolean): void => {
    const itemPathSlash = itemPath + "/";
    const index = store.collapsed.findIndex(({ rootDirectory }) =>
      startsWith(itemPathSlash, rootDirectory)
    );
    switch (isCollapsed) {
      case true: {
        // setCollapse(index, "collapsed", (items) => [
        //   ...items.filter((path) => {
        //     return itemPathSlash !== path && !startsWith(path, itemPathSlash);
        //   }),
        // ]);
        setCollapse(
          index,
          "collapsed",
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
        setCollapse(
          index,
          "collapsed",
          produce((items) => items.push(itemPathSlash))
        );
        // setCollapse(index, "collapsed", (items) => [...items, itemPathSlash]);
        break;
      }
    }
  };

  const isCollapsed = (itemPath: string): boolean => {
    return (
      Boolean(
        store.collapsed
          .find(({ rootDirectory }) => startsWith(itemPath, rootDirectory))
          ?.collapsed.some((path) => path === itemPath + "/") ?? false // TODO: I think `?? false` is not utilized
      ) || false
    );
  };

  const mapped = (child: Directory[] | FileEntry[] | undefined): any =>
    mapArray<Directory | FileEntry, any>(
      () => child,
      (model) => {
        const [getCollapsed, setCollapsed] = createSignal(
          isCollapsed(model.path)
        );

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

  return <Dynamic component={props.children} mapped={mapped(directories)} />;
};

export default TreeProvider;
