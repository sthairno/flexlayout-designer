import { useNode, UserComponent } from "@craftjs/core";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";
import { DefaultComponentViewProps, UserComponentInfo } from "./internal";
import { Box } from "@chakra-ui/react";
import { SimpleGuiOptions, siv3dColorFtoRGB } from "../../util/siv3d";

interface SimpleGuiSliderProps extends FlexLayoutCommonProps {
  min: number;
  max: number;
  value: number;
}

export const SimpleGuiSlider: UserComponent<SimpleGuiSliderProps> = ({
  style,
}: SimpleGuiSliderProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <Box
      ref={(e: HTMLElement) => connect(drag(e))}
      borderColor="transparent"
      style={style}
      minWidth={`${SimpleGuiOptions.sliderMinLength}px`}
      height={`${SimpleGuiOptions.unitSize}px`}
      {...DefaultComponentViewProps}
    >
      <Box
        display="flex"
        alignItems="center"
        backgroundColor={SimpleGuiOptions.backgroundColor}
        width="100%"
        padding="8px"
      >
        <Box
          flex={1}
          height="6px"
          borderLeftRadius={`${SimpleGuiOptions.roundSize}px`}
          backgroundColor={SimpleGuiOptions.sliderFillColor}
          marginY="auto"
        />
        <Box
          width="14px"
          height="22px"
          backgroundColor={SimpleGuiOptions.backgroundColor}
          borderRadius="4.2px"
          borderWidth={1}
          borderColor={siv3dColorFtoRGB(0.33)}
        />
        <Box
          flex={1}
          height="6px"
          borderRightRadius={`${SimpleGuiOptions.roundSize}px`}
          backgroundColor={SimpleGuiOptions.sliderBaseColor}
          marginY="auto"
        />
      </Box>
    </Box>
  );
};
SimpleGuiSlider.craft = {
  isCanvas: false,
  name: "SimpleGUI.Slider",
  info: {
    hasTextChild: false,
  } as UserComponentInfo,
};
