import { useNode, UserComponent } from "@craftjs/core";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";
import {
  DefaultComponentViewProps,
  EditorComponentProps,
  UserComponentInfo,
  UserComponentRelated,
} from "./internal";
import { Box, Button, Flex, Input, Span, Textarea } from "@chakra-ui/react";
import { SimpleGuiOptions, siv3dColorFtoRGB } from "../../util/siv3d";
import { Field } from "../ui/field";

interface SimpleGuiListBoxProps extends FlexLayoutCommonProps {
  children?: string;
}

const SimpleGuiListBoxPropsEditor = ({
  nodeProps,
  setNodeProp,
}: EditorComponentProps) => {
  return (
    <Field label="Items" alignItems="stretch">
      <Textarea
        value={nodeProps.children || ""}
        onChange={(e) => setNodeProp("children", e.target.value)}
      />
    </Field>
  );
};

export const SimpleGuiListBox: UserComponent<SimpleGuiListBoxProps> = ({
  children,
  style,
}: SimpleGuiListBoxProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  let items = children?.split("\n");
  if (items === undefined || items.length === 0) {
    items = [""];
  }

  const { lineHeight, fontSize, ...rest } = style || {};
  return (
    <Box
      ref={(e: HTMLElement) => connect(drag(e!))}
      style={rest}
      display="flex"
      flexDirection="column"
      fontSize="20px"
      lineHeight="normal"
      minWidth="40px"
      minHeight="1lh"
      borderWidth={`${SimpleGuiOptions.listBoxFrameThickness}px`}
      borderColor={siv3dColorFtoRGB(0.5)}
      backgroundColor="white"
      {...DefaultComponentViewProps}
    >
      {items.map((item, index) => {
        const selected = index === 0;
        return (
          <Box
            as="p"
            key={index}
            position="absolute"
            top={`calc(1lh * ${index})`}
            width="100%"
            height="1lh"
            paddingX="8px"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            color={selected ? "white" : SimpleGuiOptions.activeTextColor}
            backgroundColor={
              selected ? SimpleGuiOptions.listBoxSelectedColor : undefined
            }
          >
            {item}
          </Box>
        );
      })}
    </Box>
  );
};
SimpleGuiListBox.craft = {
  isCanvas: false,
  name: "SimpleGUI.ListBox",
  related: {
    editor: SimpleGuiListBoxPropsEditor,
  } as UserComponentRelated,
  info: {
    hasTextChild: true,
  } as UserComponentInfo,
};
