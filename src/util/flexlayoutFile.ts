import { getRandomId } from "@craftjs/utils";
import xmlFormat from "xml-formatter";
import { SerializedTree } from "./serializer";

export const IsAutoSaveSupported =
  "showSaveFilePicker" in window && "showOpenFilePicker" in window;

function serializeInlineStyles(styles: CSSStyleDeclaration) {
  const dummyElement = document.createElement("div");
  Object.assign(dummyElement.style, styles);
  const cssText = dummyElement.style.cssText;
  dummyElement.remove();
  return cssText;
}

function parseInlineStyles(cssText: string) {
  if (!cssText) {
    return {};
  }

  const dummyElement = document.createElement("div");
  dummyElement.style.cssText = cssText;

  const sourceStyle = dummyElement.style;
  const parsedStyles: Record<string, any> = {};
  for (let i = 0; i < sourceStyle.length; i++) {
    const snakeCaseName = sourceStyle[i];
    const camelCaseName = snakeCaseName.replace(/-([a-z])/g, (_, char) =>
      char.toUpperCase()
    );

    if (camelCaseName in sourceStyle) {
      parsedStyles[camelCaseName] = sourceStyle.getPropertyValue(snakeCaseName);
    }
  }

  dummyElement.remove();
  return parsedStyles;
}

export function exportTreeToXml(tree: SerializedTree, format = true) {
  function generateNodeElement(subtree: SerializedTree) {
    const element = document.createElementNS(null, subtree.type);

    // プロパティを属性に変換
    if (subtree.props) {
      for (const key of Object.keys(subtree.props)) {
        let value = subtree.props[key];

        if (key === "children") {
          if (typeof value !== "string") {
            console.warn("Unexpected 'children' value", value);
            continue;
          }

          const lines = value.split("\n");
          lines.forEach((line, i) => {
            element.appendChild(document.createTextNode(line));
            if (i < lines.length - 1) {
              element.appendChild(document.createElementNS(null, "br"));
            }
          });

          continue;
        }

        if (key === "style") {
          value = serializeInlineStyles(value || {});
        }

        switch (typeof value) {
          case "string":
            break;
          case "number":
          case "boolean":
            value = value.toString();
            break;
          case "object":
            value = JSON.stringify(value);
            break;
        }
        if (value) {
          element.setAttribute(key, value);
        }
      }
    }

    // ID属性がない場合はノードIDを設定
    if (!subtree.props?.id) {
      element.setAttribute(
        "id",
        subtree.props?.id ?? subtree.internalId ?? getRandomId()
      );
    }

    // 子ノードを再帰的に追加
    for (const childSubtree of subtree.children || []) {
      element.appendChild(generateNodeElement(childSubtree));
    }

    return element;
  }

  let layoutDocument = document.implementation.createDocument(null, "Layout");

  const rootElement = generateNodeElement(tree);
  layoutDocument.documentElement.appendChild(rootElement);

  let xml = new XMLSerializer().serializeToString(layoutDocument);

  if (format) {
    xml = xmlFormat(xml, {});
  }

  return xml;
}

export function importTreeFromXml(xml: string): SerializedTree {
  // ホワイトスペースを削除
  // https://stackoverflow.com/a/21699625
  xml = xml.replace(/>\s*/g, ">");
  xml = xml.replace(/\s*</g, "<");

  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");

  const rootElement = doc.documentElement;
  const childElement = rootElement.firstElementChild;
  if (rootElement.tagName !== "Layout" || childElement === null) {
    throw new SyntaxError("Invalid file format");
  }

  function parseNodeElement(element: Element): SerializedTree {
    const subtree: SerializedTree = {
      type: element.tagName,
    };

    // ---props---
    const props: Record<string, any> = {};

    // スタイル属性の読み込み
    let parsedStyle = parseInlineStyles(element.getAttribute("style") || "");
    if (Object.keys(parsedStyle).length > 0) {
      props.style = parsedStyle;
    }

    // テキストをchildrenに展開
    if (element.hasChildNodes()) {
      const text = element.childNodes.values().reduce((text, child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          text += child.textContent;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const element = child as Element;
          if (element.tagName.toLowerCase() === "br") {
            text += "\n";
          }
        }
        return text;
      }, "");
      if (text) {
        props.children = text;
      }
    }

    // その他の属性をpropsに展開
    for (const attr of element.attributes) {
      const key = attr.name;
      const value = attr.value;

      if (key === "style" || key === "children") {
        continue;
      }

      props[key] = value;
    }

    if (Object.keys(props).length > 0) {
      subtree.props = props;
    }

    // ---children---

    // 子ノードの再帰読み込み
    if (element.children.length > 0) {
      subtree.children = [];
      for (
        let child = element.firstElementChild;
        child !== null;
        child = child.nextElementSibling
      ) {
        subtree.children.push(parseNodeElement(child));
      }
    }

    return subtree;
  }

  return parseNodeElement(childElement);
}
