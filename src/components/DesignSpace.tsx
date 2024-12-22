import { Box, BoxProps } from "@chakra-ui/react";
import { useEditor } from "@craftjs/core";
import { ResizableCanvas } from "./ResizableCanvas";
import { NodeBorderThickness, NodeStyleClassNames } from "../config";
import { useAtomValue, useSetAtom } from "jotai";
import {
  designSpaceElementAtom,
  outlineVisibleAtom,
} from "./DesignerStateProvider";
import ResizeHandleSvg from "../assets/resize_handle.svg";

export function DesignSpace(props: BoxProps) {
  const setElement = useSetAtom(designSpaceElementAtom);
  const {
    connectors: { select },
  } = useEditor();
  const outlineVisible = useAtomValue(outlineVisibleAtom);

  return (
    <Box
      position="relative"
      ref={(el: HTMLElement) => {
        select(el, "");
        setElement(el);
      }}
      {...props}
    >
      <Box
        overflow="auto"
        bg="bg.emphasized"
        w="100%"
        h="100%"
        fontSize="16px"
        lineHeight={1.2}
        textAlign="start"
        css={{
          [`& .${NodeStyleClassNames.base}`]: {
            position: "relative",
            fontFamily: "Noto Sans, sans-serif",
            fontOpticalSizing: "auto",
            fontWeight: 400,
            fontStyle: "normal",
            fontVariationSettings: { wdth: 100 },
          },
          [`& .${NodeStyleClassNames.base}::after`]: {
            content: '""',
            display: "block",
            position: "absolute",
            pointerEvents: "none",
            inset: `-${NodeBorderThickness}px`,
            outlineStyle: "dashed",
            outlineColor: "gray.500",
            outlineOffset: `-${NodeBorderThickness + 1}px`,
            outlineWidth: outlineVisible ? 1 : 0,
          },
          [`& .${NodeStyleClassNames.hovered}::after`]: {
            borderColor: "colorPalette.focusRing/60",
            borderWidth: `${NodeBorderThickness}px`,
          },
          [`& .${NodeStyleClassNames.selected}::after`]: {
            borderColor: "colorPalette.focusRing",
            borderWidth: `${NodeBorderThickness}px`,
          },
          // react-resizable CSS
          // https://github.com/react-grid-layout/react-resizable/blob/HEAD/css/styles.css
          "& .react-resizable": {
            position: "relative",
          },
          "& .react-resizable-handle": {
            position: "absolute",
            width: "20px",
            height: "20px",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "content-box",
            boxSizing: "border-box",
            backgroundImage: `url(${ResizeHandleSvg})`,
            backgroundPosition: "bottom right",
            padding: "0 3px 3px 0",
          },
          "& .react-resizable-handle-se": {
            bottom: 0,
            right: 0,
            cursor: "se-resize",
          },
          "& .react-resizable-handle-e": {
            top: "50%",
            right: 0,
            marginTop: "-10px",
            cursor: "ew-resize",
            transform: "rotate(315deg)",
          },
          "& .react-resizable-handle-s": {
            bottom: 0,
            left: "50%",
            marginLeft: "-10px",
            cursor: "ns-resize",
            transform: "rotate(45deg)",
          },
        }}
      >
        <ResizableCanvas />
      </Box>
    </Box>
  );
}
