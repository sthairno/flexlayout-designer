import { Box } from "@chakra-ui/react";
import { Frame, useEditor } from "@craftjs/core";
import { Resizable } from "react-resizable";
import { useAtom } from "jotai";
import { MinimumCanvasSize, NodeStyleClassNames } from "../config";

import { canvasSizeAtom } from "./DesignerStateProvider";
import { FlexLayoutBox, FlexLayoutLabel } from "./user";
import { expandStyleShorthands } from "../util/expandStyleShorthands";

const InitialLayout: React.ReactElement = (
  <FlexLayoutBox
    style={expandStyleShorthands({
      padding: "10px",
      gap: "5px",
      justifyContent: "center",
      alignItems: "center",
    })}
  >
    <FlexLayoutLabel>Hello, World!</FlexLayoutLabel>
  </FlexLayoutBox>
);

export function ResizableCanvas() {
  const {
    actions: { setOptions },
  } = useEditor();
  const [canvasSize, setCanvasSize] = useAtom(canvasSizeAtom);

  return (
    <Resizable
      width={canvasSize.width}
      height={canvasSize.height}
      minConstraints={[MinimumCanvasSize.width, MinimumCanvasSize.height]}
      onResizeStart={() => setOptions((opt) => (opt.enabled = false))}
      onResizeStop={() => setOptions((opt) => (opt.enabled = true))}
      onResize={(_e, { size }) =>
        setCanvasSize({ width: size.width, height: size.height })
      }
      resizeHandles={["s", "e", "se"]}
    >
      <Box
        bg="rgb(11, 22, 33)"
        m={10}
        css={{
          [`& > .${NodeStyleClassNames.base}`]: {
            width: "100%",
            height: "100%",
          },
        }}
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
        }}
      >
        <Frame>{InitialLayout}</Frame>
      </Box>
    </Resizable>
  );
}
