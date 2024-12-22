import { useNode, UserComponent } from "@craftjs/core";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";
import {
  DefaultComponentViewProps,
  EditorComponentProps,
  UserComponentInfo,
  UserComponentRelated,
} from "./internal";
import {
  Box,
  Button,
  Circle,
  Grid,
  GridItem,
  Input,
  Span,
  Textarea,
} from "@chakra-ui/react";
import { SimpleGuiOptions } from "../../util/siv3d";
import { Field } from "../ui/field";
import { Fragment } from "react/jsx-runtime";

interface SimpleGuiRadioButtonsProps extends FlexLayoutCommonProps {
  children?: string;
}

const SimpleGuiRadioButtonsPropsEditor = ({
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

export const SimpleGuiRadioButtons: UserComponent<
  SimpleGuiRadioButtonsProps
> = ({ children, style }: SimpleGuiRadioButtonsProps) => {
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
      minHeight="fit-content"
      {...DefaultComponentViewProps}
    >
      <Grid
        templateColumns={`${SimpleGuiOptions.radioButtonSize}px 1fr`}
        templateRows={`repeat(${options.length}, ${SimpleGuiOptions.unitSize}px)`}
        gapX={`${SimpleGuiOptions.radioButtonPadding}px`}
        gapY={`${SimpleGuiOptions.cellSize - SimpleGuiOptions.unitSize}px`}
        paddingX={`${SimpleGuiOptions.radioButtonPadding}px`}
        backgroundColor={SimpleGuiOptions.backgroundColor}
        alignItems="center"
        fontSize="20px"
        lineHeight="normal"
      >
        {options.map((option, i) => {
          const selected = i == 0;
          const color = selected
            ? SimpleGuiOptions.radioButtonFillColor
            : SimpleGuiOptions.radioButtonBaseColor;
          return (
            <Fragment key={i}>
              <GridItem>
                <Circle
                  width="100%"
                  aspectRatio={1}
                  borderWidth="2.5px"
                  borderColor={color}
                >
                  {selected && (
                    <Circle
                      size="60%"
                      aspectRatio={1}
                      backgroundColor={color}
                    />
                  )}
                </Circle>
              </GridItem>
              <GridItem>
                <p>{option}</p>
              </GridItem>
            </Fragment>
          );
        })}
      </Grid>
    </Box>
  );
};
SimpleGuiRadioButtons.craft = {
  isCanvas: false,
  name: "SimpleGUI.RadioButtons",
  related: {
    editor: SimpleGuiRadioButtonsPropsEditor,
  } as UserComponentRelated,
  info: {
    hasTextChild: true,
  } as UserComponentInfo,
};
