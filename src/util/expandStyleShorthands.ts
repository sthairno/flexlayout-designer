import * as Expanders from "css-shorthand-expanders";

export function expandStyleShorthands(style: React.CSSProperties) {
  const expandedStyle: React.CSSProperties = {};
  for (const key in style) {
    const value = style[key as keyof React.CSSProperties];
    if (typeof value === "string" && key in Expanders) {
      const expander = Expanders[key as keyof typeof Expanders];
      const args = value.split(" ").filter((v) => v);
      Object.assign(expandedStyle, expander(...args));
    } else {
      expandedStyle[key] = style[key];
    }
  }
  return expandedStyle;
}
