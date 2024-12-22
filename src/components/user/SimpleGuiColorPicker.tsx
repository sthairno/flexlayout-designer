import { useNode, UserComponent } from "@craftjs/core";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";
import { DefaultComponentViewProps, UserComponentInfo } from "./internal";
import { Box, Image } from "@chakra-ui/react";
import { SimpleGuiOptions } from "../../util/siv3d";
import ColorPickerImage from "../../assets/simplegui_colorpicker.png";

interface SimpleGuiColorPickerProps extends FlexLayoutCommonProps {
  children?: string;
}

export const SimpleGuiColorPicker: UserComponent<SimpleGuiColorPickerProps> = ({
  children,
  style,
}: SimpleGuiColorPickerProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <Box
      ref={(e: HTMLElement) => connect(drag(e))}
      style={style}
      minWidth="fit-content"
      minHeight="fit-content"
      {...DefaultComponentViewProps}
    >
      <Image
        width={`${SimpleGuiOptions.colorPickerSize.width}px`}
        height={`${SimpleGuiOptions.colorPickerSize.height}px`}
        backgroundColor={SimpleGuiOptions.backgroundColor}
        src={ColorPickerImage}
      />
    </Box>
  );
};
SimpleGuiColorPicker.craft = {
  isCanvas: false,
  name: "SimpleGUI.ColorPicker",
  info: {
    hasTextChild: false,
  } as UserComponentInfo,
};
