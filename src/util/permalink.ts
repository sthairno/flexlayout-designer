import { decode, diagnose, encode } from "cbor2";
import { CanvasSize } from "../types/CanvasSize";
import { SerializedTree } from "./serializer";
import { StyleProperties } from "./styleProperties";

async function compressData(data: Uint8Array) {
  const upstream = new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    },
  });

  const stream = upstream.pipeThrough(new CompressionStream("deflate"));

  const compressedBytes = new Uint8Array(
    await new Response(stream).arrayBuffer()
  );

  return compressedBytes;
}

async function decompressData(data: Uint8Array) {
  const upstream = new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    },
  });

  const stream = upstream.pipeThrough(new DecompressionStream("deflate"));

  const decompressedBytes = new Uint8Array(
    await new Response(stream).arrayBuffer()
  );

  return decompressedBytes;
}

function encodeDataToUrlSafeBase64(data: Uint8Array) {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function decodeDataFromUrlSafeBase64(urlsafe: string) {
  const base64 = urlsafe
    .padEnd(urlsafe.length + ((4 - (urlsafe.length % 4)) % 4), "=")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const data = atob(base64);
  return new Uint8Array(data.split("").map((c) => c.charCodeAt(0)));
}

interface ProjectData {
  projectName: string;
  canvasSize: CanvasSize;
  tree: SerializedTree;
}

type CanvasData = [
  // 横幅
  number,
  // 縦幅
  number
];

// 型名→型IDの辞書
type TypeDictionary = string[];

// ツリー情報
type TreeData = [
  number, // 型ID
  Record<string, any>, // プロパティ
  TreeData[] // サブツリー
];

const Version = 1;

type PermalinkData = [
  typeof Version,
  string, // プロジェクト名
  CanvasData, // キャンバス情報
  TypeDictionary, // 型名→型IDの辞書
  TreeData // ルートノード
];

function generateStyleDic() {
  return Object.keys(StyleProperties)
    .map((key) => {
      // ケバブケースをキャメルケースに変換
      return key.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
    })
    .sort();
}

export async function encodePermalinkAsync({
  projectName,
  canvasSize,
  tree,
}: ProjectData) {
  const typeDic: TypeDictionary = [];
  const styleDic = generateStyleDic();

  function encodeTree(tree: SerializedTree): TreeData {
    const typeName = tree.type;
    let typeId = typeDic.indexOf(typeName);
    if (typeId === -1) {
      typeDic.push(typeName);
      typeId = typeDic.length - 1;
    }

    const props = { ...tree.props };

    // スタイル情報を最小化
    if (props.style) {
      const minimizedStyle = new Map<number, any>();
      for (const key in props.style) {
        const styleId = styleDic.indexOf(key);
        if (styleId !== -1) {
          minimizedStyle.set(styleId, props.style[key]);
        }
      }
      props.style = minimizedStyle;
    }

    const subtree: TreeData = [typeId, props, []];

    if (tree.children) {
      for (const child of tree.children) {
        subtree[2].push(encodeTree(child));
      }
    }

    return subtree;
  }

  const treeData = encodeTree(tree);
  const data: PermalinkData = [
    Version,
    projectName,
    [canvasSize.width, canvasSize.height],
    typeDic,
    treeData,
  ];

  const binaryData = encode(data, {});
  const compressed = await compressData(binaryData);
  const base64 = encodeDataToUrlSafeBase64(compressed);

  return base64;
}

export async function decodePermalinkAsync(base64: string) {
  const compressed = decodeDataFromUrlSafeBase64(base64);
  const binaryData = await decompressData(compressed);
  const data = decode(binaryData);

  if (!Array.isArray(data)) {
    throw new Error("Invalid permalink data");
  }

  const [version, projectName, canvasData, typeDic, treeData] = data;

  if (version !== Version) {
    throw new Error("Unsupported permalink version");
  }

  const styleDic = generateStyleDic();

  const canvasSize: CanvasSize = {
    width: canvasData[0],
    height: canvasData[1],
  };

  function decodeTree(treeData: TreeData): SerializedTree {
    const typeId = treeData[0];
    const typeName = typeDic[typeId];
    const props = { ...treeData[1] };

    // スタイル情報を復元
    if (props.style) {
      const minimizedStyle = props.style as Map<number, any>;
      const style: Record<string, any> = {};
      for (const [id, value] of minimizedStyle) {
        style[styleDic[id]] = value;
      }
      props.style = style;
    }

    const children = treeData[2].map(decodeTree);

    return { type: typeName, props, children };
  }

  const tree = decodeTree(treeData);

  return { projectName, canvasSize, tree };
}
