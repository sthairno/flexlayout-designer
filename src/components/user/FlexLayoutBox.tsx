import { Box } from "@chakra-ui/react";
import { useNode, UserComponent } from "@craftjs/core";

import { DefaultComponentViewProps } from "./internal";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";

export interface FlexLayoutBoxProps extends FlexLayoutCommonProps {
  children?: React.ReactNode;
}

export const FlexLayoutBox: UserComponent<FlexLayoutBoxProps> = ({
  children,
  style,
}: FlexLayoutBoxProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <Box
      display="flex"
      style={style}
      ref={(e: HTMLDivElement) => connect(drag(e))}
      {...DefaultComponentViewProps}
    >
      {children}
    </Box>
  );
};
FlexLayoutBox.craft = {
  isCanvas: true,
  name: "Box",
};
