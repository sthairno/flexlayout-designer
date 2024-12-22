import {
  Resolver,
  ROOT_NODE,
  SerializedNode,
  SerializedNodes,
  UserComponentConfig,
} from "@craftjs/core";
import { getRandomId } from "@craftjs/utils";
import { UserComponentInfo } from "../components/user";

export interface SerializedTree {
  type: string;
  internalId?: string;
  props?: Record<string, any>;
  children?: SerializedTree[];
}

export function serializeCjsTree(nodeStorage: SerializedNodes) {
  function generateNodeElement(nodeId: string, node: SerializedNode) {
    const typeName =
      typeof node.type === "string" ? node.type : node.type.resolvedName;
    const subtree: SerializedTree = {
      type: typeName,
      internalId: nodeId,
      props: {},
    };

    // その他のプロパティを属性に変換
    for (const key in node.props) {
      let value = node.props[key];

      if (key === "children") {
        if (typeof value !== "string") {
          console.warn("Unexpected 'children' value", value);
          continue;
        }

        subtree.props!.children = value;

        continue;
      }

      if (key === "style") {
        const style: CSSStyleDeclaration = { ...value };
        if (node.hidden) {
          style.display = "none";
        }

        if (Object.keys(style).length === 0) {
          continue;
        }

        value = style;
      }

      subtree.props![key] = value;
    }

    // propsが空の場合は削除
    if (Object.keys(subtree.props!).length === 0) {
      delete subtree.props;
    }

    // 子ノードを再帰的に追加
    for (const childId of node.nodes) {
      const childNode = nodeStorage[childId];
      const childSubtree = generateNodeElement(childId, childNode);
      if (!subtree.children) {
        subtree.children = [];
      }
      subtree.children.push(childSubtree);
    }

    return subtree;
  }

  return generateNodeElement(ROOT_NODE, nodeStorage[ROOT_NODE]);
}

export function deserializeCjsTree(
  tree: SerializedTree,
  resolver: Resolver
): SerializedNodes {
  const nodeStorage: SerializedNodes = {};

  function parseNodeElement(
    subtree: SerializedTree,
    parentNodeId: string | null
  ) {
    // タグ名の解決
    const lowerTypeName = subtree.type.toLowerCase();
    const resolvedTypeName = Object.keys(resolver).find(
      (key) => key.toLowerCase() === lowerTypeName
    );
    if (!resolvedTypeName) {
      throw new SyntaxError(`Unknown component type: ${subtree.type}`);
    }
    const ResolvedComponent = resolver[resolvedTypeName];
    console.assert(
      (ResolvedComponent as any).craft !== undefined,
      "Unsupported ComponentType"
    );
    const craft = (ResolvedComponent as any).craft as Partial<
      Omit<UserComponentConfig<any>, "info">
    > & { info?: UserComponentInfo };

    // ノードIDの生成
    const isRootNode = parentNodeId === null;
    let nodeId: string = isRootNode
      ? ROOT_NODE
      : subtree.internalId ?? getRandomId();

    // スタイル属性の読み込み
    let style = subtree.props?.style ?? {};
    const hidden = style.display === "none";
    if (hidden) {
      delete style.display;
    }

    // 属性をpropsに展開
    const props: Record<string, any> = {};
    if (subtree.props) {
      for (const [key, value] of Object.entries(subtree.props)) {
        if (key === "style" || key === "children") {
          continue;
        }
        props[key] = value;
      }
    }
    props.style = style;

    // 子ノードの再帰読み込み
    const childNodeIds: string[] = [];

    if (craft.info?.hasTextChild) {
      props.children = subtree.props?.children ?? "";
    } else if (subtree.children) {
      for (const childSubtree of subtree.children) {
        const childNodeId = parseNodeElement(childSubtree, nodeId);
        childNodeIds.push(childNodeId);
      }
    }

    // ノードを生成,登録
    const node: SerializedNode = {
      type: {
        resolvedName: resolvedTypeName,
      },
      isCanvas: craft.isCanvas ?? false,
      props: props,
      displayName: craft?.displayName ?? resolvedTypeName,
      custom: {},
      parent: parentNodeId,
      hidden: hidden,
      nodes: childNodeIds,
      linkedNodes: {},
    };
    nodeStorage[nodeId] = node;

    return nodeId;
  }

  parseNodeElement(tree, null);

  return nodeStorage;
}
