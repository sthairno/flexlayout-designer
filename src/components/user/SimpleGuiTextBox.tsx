import { useNode, UserComponent } from "@craftjs/core";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";
import {
  DefaultComponentViewProps,
  EditorComponentProps,
  UserComponentInfo,
  UserComponentRelated,
} from "./internal";
import { Box, Input, Span } from "@chakra-ui/react";
import { SimpleGuiOptions, siv3dColorFtoRGB } from "../../util/siv3d";
import { Field } from "../ui/field";

interface SimpleGuiTextBoxProps extends FlexLayoutCommonProps {
  children?: string;
}

const SimpleGuiTextBoxPropsEditor = ({
  nodeProps,
  setNodeProp,
}: EditorComponentProps) => {
  return (
    <Field label="Default Text" alignItems="stretch">
      <Input
        value={nodeProps.children || ""}
        onChange={(e) => setNodeProp("children", e.target.value)}
      />
    </Field>
  );
};

export const SimpleGuiTextBox: UserComponent<SimpleGuiTextBoxProps> = ({
  children,
  style,
}: SimpleGuiTextBoxProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <Box
      ref={(e: HTMLElement) => connect(drag(e))}
      style={style}
      borderColor="transparent"
      fontSize="20px"
      lineHeight="normal"
      minWidth={`${SimpleGuiOptions.minTextBoxWidth}px`}
      height={`${SimpleGuiOptions.textBoxHeight}px`}
      {...DefaultComponentViewProps}
    >
      <Box
        position="relative"
        backgroundColor="white"
        borderWidth="2px"
        borderColor={siv3dColorFtoRGB(0.5)}
        width="100%"
        height="100%"
        whiteSpace="nowrap"
      >
        <Span
          position="absolute"
          // textRenderRegion
          top="2px"
          right={`${SimpleGuiOptions.textAreaScrollBarWidth + 6}px`}
          bottom="2px"
          left="8px"
          color={SimpleGuiOptions.activeTextColor}
        >
          {children}
        </Span>
      </Box>
    </Box>
  );
};
SimpleGuiTextBox.craft = {
  isCanvas: false,
  name: "SimpleGUI.TextBox",
  related: {
    editor: SimpleGuiTextBoxPropsEditor,
  } as UserComponentRelated,
  info: {
    hasTextChild: true,
  } as UserComponentInfo,
};
