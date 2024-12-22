import { useNode, UserComponent } from "@craftjs/core";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";
import {
  DefaultComponentViewProps,
  EditorComponentProps,
  UserComponentInfo,
  UserComponentRelated,
} from "./internal";
import { Box, Button, Grid, Input, Span } from "@chakra-ui/react";
import { SimpleGuiOptions } from "../../util/siv3d";
import { Field } from "../ui/field";

interface SimpleGuiButtonProps extends FlexLayoutCommonProps {
  children?: string;
}

const SimpleGuiButtonPropsEditor = ({
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

const buttonFrameThickness = 1;

export const SimpleGuiButton: UserComponent<SimpleGuiButtonProps> = ({
  children,
  style,
}: SimpleGuiButtonProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <Box
      ref={(e: HTMLElement) => connect(drag(e))}
      style={style}
      height={`${SimpleGuiOptions.unitSize}px`}
      minWidth="fit-content"
      borderColor="transparent"
      {...DefaultComponentViewProps}
    >
      <Grid
        paddingX={`${20 - buttonFrameThickness}px`}
        backgroundColor={SimpleGuiOptions.backgroundColor}
        borderWidth={`${buttonFrameThickness}px`}
        borderColor={SimpleGuiOptions.frameColor}
        borderRadius={`${SimpleGuiOptions.roundSize}px`}
        color={SimpleGuiOptions.activeTextColor}
        width="100%"
        height="100%"
        textAlign="center"
        placeItems={"center"}
      >
        <Span fontSize="20px" lineHeight="normal">
          {children}
        </Span>
      </Grid>
    </Box>
  );
};
SimpleGuiButton.craft = {
  isCanvas: false,
  name: "SimpleGUI.Button",
  related: {
    editor: SimpleGuiButtonPropsEditor,
  } as UserComponentRelated,
  info: {
    hasTextChild: true,
  } as UserComponentInfo,
};
