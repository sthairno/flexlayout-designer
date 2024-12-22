import { useNode, UserComponent } from "@craftjs/core";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";
import {
  DefaultComponentViewProps,
  EditorComponentProps,
  UserComponentInfo,
  UserComponentRelated,
} from "./internal";
import { Box, Button, Input, Span } from "@chakra-ui/react";
import { SimpleGuiOptions, siv3dColorFtoRGB } from "../../util/siv3d";
import { Field } from "../ui/field";

interface SimpleGuiCheckBoxProps extends FlexLayoutCommonProps {
  children?: string;
}

const SimpleGuiCheckBoxPropsEditor = ({
  nodeProps,
  setNodeProp,
}: EditorComponentProps) => {
  return (
    <Field label="Text" alignItems="stretch">
      <Input
        value={nodeProps.children || ""}
        onChange={(e) => setNodeProp("children", e.target.value)}
      />
    </Field>
  );
};

export const SimpleGuiCheckBox: UserComponent<SimpleGuiCheckBoxProps> = ({
  children,
  style,
}: SimpleGuiCheckBoxProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <Box
      ref={(e: HTMLElement) => connect(drag(e))}
      style={style}
      borderColor="transparent"
      minWidth="fit-content"
      fontSize="20px"
      lineHeight="normal"
      {...DefaultComponentViewProps}
    >
      <Box
        display="flex"
        alignItems="center"
        width="100%"
        height={`${SimpleGuiOptions.unitSize}px`}
        padding={`${SimpleGuiOptions.checkBoxPadding}px`}
        gapX={`${SimpleGuiOptions.checkBoxPadding}px`}
        backgroundColor={SimpleGuiOptions.backgroundColor}
      >
        <Box
          width={`${SimpleGuiOptions.checkBoxSize - 1.25}px`}
          height={`${SimpleGuiOptions.checkBoxSize - 1.25}px`}
          borderWidth="1.25px"
          borderRadius="3.2px"
          borderColor={SimpleGuiOptions.checkBoxBaseColor}
          backgroundColor={siv3dColorFtoRGB(0.95)}
        />
        <p>{children}</p>
      </Box>
    </Box>
  );
};
SimpleGuiCheckBox.craft = {
  isCanvas: false,
  name: "SimpleGUI.CheckBox",
  related: {
    editor: SimpleGuiCheckBoxPropsEditor,
  } as UserComponentRelated,
  info: {
    hasTextChild: true,
  } as UserComponentInfo,
};
