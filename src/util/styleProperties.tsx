import { ReactElement } from "react";
import MaterialIcon from "./MaterialIcon";

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";

export interface StylePropertyValue {
  displayName: string;
  getIcon?: (direction: FlexDirection) => ReactElement;
}

export type StyleProperty = {
  displayName: string;
  defaultValue: any;
} & (
  | {
      valueType: "enum";
      choices: Record<string, StylePropertyValue>;
    }
  | {
      valueType: "number";
      max?: number;
      min?: number;
      step?: number;
      units: string[];
    }
  | {
      valueType: "ratio";
    }
);

export type StylePropertyRecord = Record<string, StyleProperty>;

export const StyleProperties: StylePropertyRecord = {
  "flex-direction": {
    displayName: "Flex Direction",
    defaultValue: "row",
    valueType: "enum",
    choices: {
      row: {
        displayName: "Row",
        getIcon: () => <MaterialIcon>arrow_forward</MaterialIcon>,
      },
      column: {
        displayName: "Column",
        getIcon: () => <MaterialIcon>arrow_downward</MaterialIcon>,
      },
      "row-reverse": {
        displayName: "Row (Reverse)",
        getIcon: () => <MaterialIcon>arrow_back</MaterialIcon>,
      },
      "column-reverse": {
        displayName: "Column (Reverse)",
        getIcon: () => <MaterialIcon>arrow_upward</MaterialIcon>,
      },
    },
  },
  "justify-content": {
    displayName: "Justify Content",
    defaultValue: "flex-start",
    valueType: "enum",
    choices: {
      "flex-start": {
        displayName: "Start",
        getIcon: (flexDirection: FlexDirection) => {
          switch (flexDirection) {
            case "row":
              return <MaterialIcon>align_justify_flex_start</MaterialIcon>;
            case "column":
              return <MaterialIcon>align_start</MaterialIcon>;
            case "row-reverse":
              return <MaterialIcon>align_justify_flex_end</MaterialIcon>;
            case "column-reverse":
              return <MaterialIcon>align_end</MaterialIcon>;
          }
        },
      },
      center: {
        displayName: "Center",
        getIcon: (flexDirection: FlexDirection) => {
          if (flexDirection.startsWith("column")) {
            return <MaterialIcon>align_center</MaterialIcon>;
          } else {
            return <MaterialIcon>align_justify_center</MaterialIcon>;
          }
        },
      },
      "flex-end": {
        displayName: "End",
        getIcon: (flexDirection: FlexDirection) => {
          switch (flexDirection) {
            case "row":
              return <MaterialIcon>align_justify_flex_end</MaterialIcon>;
            case "column":
              return <MaterialIcon>align_end</MaterialIcon>;
            case "row-reverse":
              return <MaterialIcon>align_justify_flex_start</MaterialIcon>;
            case "column-reverse":
              return <MaterialIcon>align_start</MaterialIcon>;
          }
        },
      },
      "space-between": {
        displayName: "Space Between",
        getIcon: (flexDirection: FlexDirection) => {
          if (flexDirection.startsWith("column")) {
            return <MaterialIcon>align_space_between</MaterialIcon>;
          } else {
            return <MaterialIcon>align_justify_space_between</MaterialIcon>;
          }
        },
      },
      "space-around": {
        displayName: "Space Around",
        getIcon: (flexDirection: FlexDirection) => {
          if (flexDirection.startsWith("column")) {
            return <MaterialIcon>align_space_around</MaterialIcon>;
          } else {
            return <MaterialIcon>align_justify_space_around</MaterialIcon>;
          }
        },
      },
      "space-evenly": {
        displayName: "Space Evenly",
        getIcon: (flexDirection: FlexDirection) => {
          if (flexDirection.startsWith("column")) {
            return <MaterialIcon>align_space_even</MaterialIcon>;
          } else {
            return <MaterialIcon>align_justify_space_even</MaterialIcon>;
          }
        },
      },
    },
  },
  "align-items": {
    displayName: "Align Items",
    defaultValue: "stretch",
    valueType: "enum",
    choices: {
      stretch: {
        displayName: "Stretch",
        getIcon: (flexDirection: FlexDirection) => (
          <MaterialIcon
            rotate={flexDirection.startsWith("column") ? "90deg" : undefined}
          >
            align_items_stretch
          </MaterialIcon>
        ),
      },
      "flex-start": {
        displayName: "Start",
        getIcon: (flexDirection: FlexDirection) => {
          switch (flexDirection) {
            case "row":
              return <MaterialIcon>align_vertical_top</MaterialIcon>;
            case "column":
              return <MaterialIcon>align_horizontal_left</MaterialIcon>;
            case "row-reverse":
              return (
                <MaterialIcon transform="scaleX(-1)">
                  align_vertical_top
                </MaterialIcon>
              );
            case "column-reverse":
              return (
                <MaterialIcon transform="scaleY(-1)">
                  align_horizontal_left
                </MaterialIcon>
              );
          }
        },
      },
      center: {
        displayName: "Center",
        getIcon: (flexDirection: FlexDirection) => {
          switch (flexDirection) {
            case "row":
              return <MaterialIcon>align_vertical_center</MaterialIcon>;
            case "column":
              return <MaterialIcon>align_horizontal_center</MaterialIcon>;
            case "row-reverse":
              return (
                <MaterialIcon transform="scaleX(-1)">
                  align_vertical_center
                </MaterialIcon>
              );
            case "column-reverse":
              return (
                <MaterialIcon transform="scaleY(-1)">
                  align_horizontal_center
                </MaterialIcon>
              );
          }
        },
      },
      "flex-end": {
        displayName: "End",
        getIcon: (flexDirection: FlexDirection) => {
          switch (flexDirection) {
            case "row":
              return <MaterialIcon>align_vertical_bottom</MaterialIcon>;
            case "column":
              return <MaterialIcon>align_horizontal_right</MaterialIcon>;
            case "row-reverse":
              return (
                <MaterialIcon transform="scaleX(-1)">
                  align_vertical_bottom
                </MaterialIcon>
              );
            case "column-reverse":
              return (
                <MaterialIcon transform="scaleY(-1)">
                  align_horizontal_right
                </MaterialIcon>
              );
          }
        },
      },
      baseline: {
        displayName: "Baseline",
        getIcon: () => <MaterialIcon>text_fields</MaterialIcon>,
      },
    },
  },
  "align-content": {
    displayName: "Align Content",
    defaultValue: "stretch",
    valueType: "enum",
    choices: {
      stretch: {
        displayName: "Stretch",
        getIcon: (flexDirection: FlexDirection) => {
          if (flexDirection.startsWith("column")) {
            return <MaterialIcon>align_stretch</MaterialIcon>;
          } else {
            return <MaterialIcon rotate="90deg">align_stretch</MaterialIcon>;
          }
        },
      },
      "flex-start": {
        displayName: "Start",
        getIcon: (flexDirection: FlexDirection) => {
          if (flexDirection.startsWith("column")) {
            return <MaterialIcon>align_justify_flex_start</MaterialIcon>;
          } else {
            return <MaterialIcon>align_start</MaterialIcon>;
          }
        },
      },
      center: {
        displayName: "Center",
        getIcon: (flexDirection: FlexDirection) => {
          if (flexDirection.startsWith("column")) {
            return <MaterialIcon>align_justify_center</MaterialIcon>;
          } else {
            return <MaterialIcon>align_center</MaterialIcon>;
          }
        },
      },
      "flex-end": {
        displayName: "End",
        getIcon: (flexDirection: FlexDirection) => {
          if (flexDirection.startsWith("column")) {
            return <MaterialIcon>align_justify_flex_end</MaterialIcon>;
          } else {
            return <MaterialIcon>align_end</MaterialIcon>;
          }
        },
      },
    },
  },
  "flex-wrap": {
    displayName: "Flex Wrap",
    defaultValue: "nowrap",
    valueType: "enum",
    choices: {
      nowrap: {
        displayName: "No wrap",
        getIcon: () => <MaterialIcon>flex_no_wrap</MaterialIcon>,
      },
      wrap: {
        displayName: "Wrap",
        getIcon: () => <MaterialIcon>flex_wrap</MaterialIcon>,
      },
      "wrap-reverse": {
        displayName: "Wrap (Reverse)",
        getIcon: () => (
          // 絵柄を上下反転 (苦肉の策)
          <MaterialIcon transform="scale(1,-1)">flex_wrap</MaterialIcon>
        ),
      },
    },
  },
  "flex-grow": {
    displayName: "Flex Grow",
    valueType: "number",
    defaultValue: 0,
    min: 0,
    units: [""],
  },
  "flex-shrink": {
    displayName: "Flex Shrink",
    valueType: "number",
    defaultValue: 1,
    min: 0,
    units: [""],
  },
  "flex-basis": {
    displayName: "Flex Basis",
    valueType: "number",
    defaultValue: "auto",
    min: 0,
    units: ["", "px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  width: {
    displayName: "Width",
    valueType: "number",
    defaultValue: "auto",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  height: {
    displayName: "Height",
    valueType: "number",
    defaultValue: "auto",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "min-width": {
    displayName: "Min Width",
    valueType: "number",
    defaultValue: "auto",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "min-height": {
    displayName: "Min Height",
    valueType: "number",
    defaultValue: "auto",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "max-width": {
    displayName: "Max Width",
    valueType: "number",
    defaultValue: "none",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "max-height": {
    displayName: "Max Height",
    valueType: "number",
    defaultValue: "none",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  position: {
    displayName: "Position",
    defaultValue: "static",
    valueType: "enum",
    choices: {
      static: {
        displayName: "Static",
      },
      relative: {
        displayName: "Relative",
      },
      absolute: {
        displayName: "Absolute",
      },
    },
  },
  "align-self": {
    displayName: "Align Self",
    defaultValue: "auto",
    valueType: "enum",
    choices: {
      stretch: {
        displayName: "Stretch",
        getIcon: (flexDirection: FlexDirection) => (
          <MaterialIcon
            rotate={flexDirection.startsWith("column") ? "90deg" : undefined}
          >
            align_items_stretch
          </MaterialIcon>
        ),
      },
      "flex-start": {
        displayName: "Start",
        getIcon: (flexDirection: FlexDirection) => {
          switch (flexDirection) {
            case "row":
              return <MaterialIcon>align_vertical_top</MaterialIcon>;
            case "column":
              return <MaterialIcon>align_horizontal_left</MaterialIcon>;
            case "row-reverse":
              return (
                <MaterialIcon transform="scaleX(-1)">
                  align_vertical_top
                </MaterialIcon>
              );
            case "column-reverse":
              return (
                <MaterialIcon transform="scaleY(-1)">
                  align_horizontal_left
                </MaterialIcon>
              );
          }
        },
      },
      center: {
        displayName: "Center",
        getIcon: (flexDirection: FlexDirection) => {
          switch (flexDirection) {
            case "row":
              return <MaterialIcon>align_vertical_center</MaterialIcon>;
            case "column":
              return <MaterialIcon>align_horizontal_center</MaterialIcon>;
            case "row-reverse":
              return (
                <MaterialIcon transform="scaleX(-1)">
                  align_vertical_center
                </MaterialIcon>
              );
            case "column-reverse":
              return (
                <MaterialIcon transform="scaleY(-1)">
                  align_horizontal_center
                </MaterialIcon>
              );
          }
        },
      },
      "flex-end": {
        displayName: "End",
        getIcon: (flexDirection: FlexDirection) => {
          switch (flexDirection) {
            case "row":
              return <MaterialIcon>align_vertical_bottom</MaterialIcon>;
            case "column":
              return <MaterialIcon>align_horizontal_right</MaterialIcon>;
            case "row-reverse":
              return (
                <MaterialIcon transform="scaleX(-1)">
                  align_vertical_bottom
                </MaterialIcon>
              );
            case "column-reverse":
              return (
                <MaterialIcon transform="scaleY(-1)">
                  align_horizontal_right
                </MaterialIcon>
              );
          }
        },
      },
      baseline: {
        displayName: "Baseline",
        getIcon: () => <MaterialIcon>text_fields</MaterialIcon>,
      },
    },
  },
  top: {
    displayName: "Top",
    valueType: "number",
    defaultValue: "auto",
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  right: {
    displayName: "Right",
    valueType: "number",
    defaultValue: "auto",
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  bottom: {
    displayName: "Bottom",
    valueType: "number",
    defaultValue: "auto",
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  left: {
    displayName: "Left",
    valueType: "number",
    defaultValue: "auto",
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "font-size": {
    displayName: "Font Size",
    valueType: "number",
    defaultValue: "16px",
    min: 1,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "line-height": {
    displayName: "Line Height",
    valueType: "number",
    defaultValue: 1.2,
    min: 0.01,
    units: [""],
  },
  "text-align": {
    displayName: "Text Align",
    defaultValue: "left",
    valueType: "enum",
    choices: {
      left: {
        displayName: "Left",
        getIcon: () => <MaterialIcon>format_align_left</MaterialIcon>,
      },
      center: {
        displayName: "Center",
        getIcon: () => <MaterialIcon>format_align_center</MaterialIcon>,
      },
      right: {
        displayName: "Right",
        getIcon: () => <MaterialIcon>format_align_right</MaterialIcon>,
      },
    },
  },
  "aspect-ratio": {
    displayName: "Aspect Ratio",
    defaultValue: "auto",
    valueType: "ratio",
  },
  "border-top-width": {
    displayName: "Top",
    valueType: "number",
    defaultValue: "0px",
    min: 0,
    units: ["px", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "border-right-width": {
    displayName: "Right",
    valueType: "number",
    defaultValue: "0px",
    min: 0,
    units: ["px", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "border-bottom-width": {
    displayName: "Bottom",
    valueType: "number",
    defaultValue: "0px",
    min: 0,
    units: ["px", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "border-left-width": {
    displayName: "Left",
    valueType: "number",
    defaultValue: "0px",
    min: 0,
    units: ["px", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "margin-top": {
    displayName: "Top",
    valueType: "number",
    defaultValue: "auto",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "margin-right": {
    displayName: "Right",
    valueType: "number",
    defaultValue: "auto",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "margin-bottom": {
    displayName: "Bottom",
    valueType: "number",
    defaultValue: "auto",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "margin-left": {
    displayName: "Left",
    valueType: "number",
    defaultValue: "auto",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "padding-top": {
    displayName: "Top",
    valueType: "number",
    defaultValue: "0",
    min: 0,
    units: ["px", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "padding-right": {
    displayName: "Right",
    valueType: "number",
    defaultValue: "0",
    min: 0,
    units: ["px", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "padding-bottom": {
    displayName: "Bottom",
    valueType: "number",
    defaultValue: "0",
    min: 0,
    units: ["px", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "padding-left": {
    displayName: "Left",
    valueType: "number",
    defaultValue: "0",
    min: 0,
    units: ["px", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "row-gap": {
    displayName: "Row Gap",
    valueType: "number",
    defaultValue: "0",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
  "column-gap": {
    displayName: "Column Gap",
    valueType: "number",
    defaultValue: "0",
    min: 0,
    units: ["px", "%", "pc", "ch", "em", "ex", "ic", "lh"],
  },
};
