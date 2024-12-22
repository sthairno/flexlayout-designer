import { useNode, UserComponent } from "@craftjs/core";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";
import { DefaultComponentViewProps, UserComponentInfo } from "./internal";
import { Box } from "@chakra-ui/react";
import { SimpleGuiOptions, siv3dColorFtoRGB } from "../../util/siv3d";

interface SimpleGuiVerticalSliderProps extends FlexLayoutCommonProps {
  min: number;
  max: number;
  value: number;
}

export const SimpleGuiVerticalSlider: UserComponent<
  SimpleGuiVerticalSliderProps
> = ({ style }: SimpleGuiVerticalSliderProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <Box
      ref={(e: HTMLElement) => connect(drag(e))}
      borderColor="transparent"
      style={style}
      width={`${SimpleGuiOptions.unitSize}px`}
      minHeight={`${SimpleGuiOptions.sliderMinLength}px`}
      {...DefaultComponentViewProps}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="100%"
        backgroundColor={SimpleGuiOptions.backgroundColor}
        padding="8px"
      >
        <Box
          flex={1}
          width="6px"
          borderTopRadius={`${SimpleGuiOptions.roundSize}px`}
          backgroundColor={SimpleGuiOptions.sliderBaseColor}
          marginY="auto"
        />
        <Box
          width="22px"
          height="14px"
          backgroundColor={SimpleGuiOptions.backgroundColor}
          borderRadius="4.2px"
          borderWidth={1}
          borderColor={siv3dColorFtoRGB(0.33)}
        />
        <Box
          flex={1}
          width="6px"
          borderBottomRadius={`${SimpleGuiOptions.roundSize}px`}
          backgroundColor={SimpleGuiOptions.sliderFillColor}
          marginY="auto"
        />
      </Box>
    </Box>
  );
};
SimpleGuiVerticalSlider.craft = {
  isCanvas: false,
  name: "SimpleGUI.VerticalSlider",
  info: {
    hasTextChild: false,
  } as UserComponentInfo,
};
