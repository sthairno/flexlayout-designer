import {
  DefaultEventHandlers,
  Editor,
  useEditor,
  UserComponent,
} from "@craftjs/core";
import { UserComponents } from "./user";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { MinimumCanvasSize } from "../config";
import {
  exportTreeToXml,
  importTreeFromXml,
  IsAutoSaveSupported,
} from "../util/flexlayoutFile";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { RESET, useAtomCallback } from "jotai/utils";
import openFileDialogAsync, {
  saveFileAsync,
  showSaveFileDialogAsync,
} from "../util/filesystem";
import { RenderNode } from "./RenderNode";
import { CanvasSize } from "../types/CanvasSize";
import { deserializeCjsTree, serializeCjsTree } from "../util/serializer";
import { decodePermalinkAsync, encodePermalinkAsync } from "../util/permalink";

export const outlineVisibleAtom = atom(true);
export const dirtyFlagAtom = atom(false);
export const projectNameAtom = atom("New Layout", (_get, set, name: string) => {
  name = name.trim();
  if (name.length === 0) {
    set(projectNameAtom, "New Layout");
  } else if (name.length > 200) {
    set(projectNameAtom, name.substring(0, 200));
  } else {
    set(projectNameAtom, name);
  }
});
export const canvasSizeAtom = atom<
  CanvasSize,
  [CanvasSize | typeof RESET],
  void
>({ width: 800, height: 600 }, (_get, set, size) => {
  if (size === RESET) {
    set(canvasSizeAtom, { width: 800, height: 600 });
  } else {
    size.width = Math.max(size.width, MinimumCanvasSize.width);
    size.height = Math.max(size.height, MinimumCanvasSize.height);
    set(canvasSizeAtom, size);
  }
});
export const enableAutoSaveAtom = atom(false, (_get, set, enabled: boolean) => {
  if (enabled && !IsAutoSaveSupported) {
    throw new Error("This browser does not support auto-save feature");
  }
  set(enableAutoSaveAtom, enabled);
});
export const fileHandleAtom = atom<FileSystemFileHandle | null>(null);
export const autoSaveAvailableAtom = atom(
  (get) => get(fileHandleAtom) !== null
);
export const designSpaceElementAtom = atom<HTMLElement | null>(null);

export const useFlexLayoutFileAction = () => {
  const {
    serialize,
    resolver,
    actions: { deserialize, history },
  } = useEditor((editor, query) => {
    return {
      serialize: query.getSerializedNodes,
      resolver: editor.options.resolver,
    };
  });

  return {
    exportProjectToFile: useAtomCallback(
      useCallback(
        async (get, set) => {
          const nodes = serialize();

          let fileName = get(projectNameAtom);
          fileName.endsWith(".xml") || (fileName += ".xml");

          let fileHandle = get(fileHandleAtom);

          if (!fileHandle && IsAutoSaveSupported) {
            fileHandle = await showSaveFileDialogAsync(fileName);
            set(projectNameAtom, fileHandle?.name ?? "");
            set(fileHandleAtom, fileHandle);
          }

          const tree = serializeCjsTree(nodes);
          const xml = exportTreeToXml(tree);
          await saveFileAsync(xml, fileName, fileHandle);

          set(dirtyFlagAtom, false);
        },
        [serialize]
      )
    ),
    importProjectFromFile: useAtomCallback(
      useCallback(
        async (_get, set) => {
          const { file, handle } = await openFileDialogAsync();

          if (!file) {
            return;
          }

          const xml = await file.text();
          const tree = importTreeFromXml(xml);
          const nodes = deserializeCjsTree(tree, resolver);

          deserialize(nodes);
          history.clear();

          set(projectNameAtom, file.name);
          set(fileHandleAtom, handle);
          set(dirtyFlagAtom, false);
        },
        [deserialize, history, resolver]
      )
    ),
  };
};

export const usePermalinkAction = () => {
  const { serialize } = useEditor((editor, query) => {
    return {
      serialize: query.getSerializedNodes,
      resolver: editor.options.resolver,
    };
  });

  return {
    createPermalinkAsync: useAtomCallback(
      useCallback(
        async (get, set) => {
          const nodes = serialize();
          let projectName = get(projectNameAtom);
          let canvasSize = get(canvasSizeAtom);

          const tree = serializeCjsTree(nodes);
          const data = await encodePermalinkAsync({
            projectName,
            canvasSize,
            tree,
          });

          // https://stackoverflow.com/questions/11471008/location-hash-and-back-history
          let newUrl = window.location.href.split("#")[0];
          newUrl += `#pj:${data}`;
          window.location.replace(newUrl);

          let success = false;
          if (navigator.clipboard) {
            try {
              await navigator.clipboard.writeText(newUrl);
              success = true;
            } catch (e) {
              console.error(e);
            }
          }

          set(dirtyFlagAtom, false);

          return {
            url: newUrl,
            clipboard: success,
          };
        },
        [serialize]
      )
    ),
  };
};

function DesignerStateManager({ children }: { children: React.ReactNode }) {
  const {
    resolver,
    actions: { deserialize, history },
  } = useEditor((state) => ({
    resolver: state.options.resolver,
  }));
  const isDirty = useAtomValue(dirtyFlagAtom);
  const isAutoSaveEnabled = useAtomValue(enableAutoSaveAtom);
  const autoUpdateTaskId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { exportProjectToFile } = useFlexLayoutFileAction();

  // 未保存のときページを離れるときに警告を表示する
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // 自動保存
  useEffect(() => {
    if (autoUpdateTaskId.current) {
      clearTimeout(autoUpdateTaskId.current);
      autoUpdateTaskId.current = null;
    }
    if (isDirty && isAutoSaveEnabled) {
      autoUpdateTaskId.current = setTimeout(exportProjectToFile, 1000);
    }
  }, [isDirty, isAutoSaveEnabled, exportProjectToFile]);

  // 起動時にPeralinkを読み込む
  const initFlag = useRef(false);
  const loadPermalinkCallback = useAtomCallback(
    useCallback(
      async (_get, set) => {
        const hash = window.location.hash;
        try {
          if (hash.startsWith("#pj:")) {
            const data = hash.substring(4);
            const { projectName, canvasSize, tree } =
              await decodePermalinkAsync(data);

            const nodes = deserializeCjsTree(tree, resolver);

            deserialize(nodes);
            history.clear();
            set(projectNameAtom, projectName);
            set(canvasSizeAtom, canvasSize);
            set(dirtyFlagAtom, false);
          }
        } catch (e) {
          console.error(e);
        }
      },
      [deserialize, history, resolver]
    )
  );
  useEffect(() => {
    if (initFlag.current) {
      return;
    }

    loadPermalinkCallback();

    initFlag.current = true;
  }, [loadPermalinkCallback]);

  return <>{children}</>;
}

export default function DesignerStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setDirty = useSetAtom(dirtyFlagAtom);
  const resolver = useMemo(
    () =>
      UserComponents.reduce<Record<string, UserComponent<any>>>((obj, c) => {
        const name = c.craft?.name;
        if (name) {
          obj[name] = c;
        }
        return obj;
      }, {}),
    []
  );

  return (
    <Editor
      onNodesChange={(query) => {
        if (query.history.canUndo() || query.history.canRedo()) {
          setDirty(true);
        }
      }}
      handlers={(store) =>
        new DefaultEventHandlers({
          store,
          removeHoverOnMouseleave: true,
          isMultiSelectEnabled: (e) => !!e.metaKey,
        })
      }
      onRender={RenderNode}
      resolver={resolver}
    >
      <DesignerStateManager>{children}</DesignerStateManager>
    </Editor>
  );
}
