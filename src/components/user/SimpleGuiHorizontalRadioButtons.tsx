import { useNode, UserComponent } from "@craftjs/core";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";
import {
  DefaultComponentViewProps,
  EditorComponentProps,
  UserComponentInfo,
  UserComponentRelated,
} from "./internal";
import { Box, Circle, Grid, GridItem, Textarea } from "@chakra-ui/react";
import { SimpleGuiOptions } from "../../util/siv3d";
import { Field } from "../ui/field";

interface SimpleGuiHorizontalRadioButtonsProps extends FlexLayoutCommonProps {
  children?: string;
}

const SimpleGuiHorizontalRadioButtonsPropsEditor = ({
  nodeProps,
  setNodeProp,
}: EditorComponentProps) => {
  return (
    <Field label="Options" alignItems="stretch">
      <Textarea
        value={nodeProps.children || ""}
        onChange={(e) => setNodeProp("children", e.target.value)}
      />
    </Field>
  );
};

export const SimpleGuiHorizontalRadioButtons: UserComponent<
  SimpleGuiHorizontalRadioButtonsProps
> = ({ children, style }: SimpleGuiHorizontalRadioButtonsProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  let options = children?.split("\n");
  if (options === undefined || options.length === 0) {
    options = [""];
  }

  return (
    <Box
      ref={(e: HTMLElement) => connect(drag(e))}
      style={style}
      borderColor="transparent"
      minWidth="fit-content"
      height={`${SimpleGuiOptions.unitSize}px`}
      {...DefaultComponentViewProps}
    >
      <Grid
        templateColumns={`repeat(${options.length},1fr)`}
        backgroundColor={SimpleGuiOptions.backgroundColor}
        alignItems="center"
        height={`${SimpleGuiOptions.unitSize}px`}
        fontSize="20px"
        lineHeight={1}
      >
        {options.map((option, i) => {
          const selected = i == 0;
          const color = selected
            ? SimpleGuiOptions.radioButtonFillColor
            : SimpleGuiOptions.radioButtonBaseColor;
          return (
            <GridItem
              key={i}
              display="flex"
              paddingX={`${SimpleGuiOptions.radioButtonPadding}px`}
              gapX={`${SimpleGuiOptions.radioButtonPadding}px`}
            >
              <Circle
                size={`${SimpleGuiOptions.radioButtonSize}px`}
                borderWidth="2.5px"
                borderColor={color}
              >
                {selected && (
                  <Circle size="60%" aspectRatio={1} backgroundColor={color} />
                )}
              </Circle>
              <p>{option}</p>
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
};
SimpleGuiHorizontalRadioButtons.craft = {
  isCanvas: false,
  name: "SimpleGUI.HorizontalRadioButtons",
  related: {
    editor: SimpleGuiHorizontalRadioButtonsPropsEditor,
  } as UserComponentRelated,
  info: {
    hasTextChild: true,
  } as UserComponentInfo,
};
