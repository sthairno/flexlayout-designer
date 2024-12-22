import {
  Group,
  HStack,
  Input,
  InputProps,
  Separator,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useEditor } from "@craftjs/core";
import { useAtom } from "jotai";
import { canvasSizeAtom, outlineVisibleAtom } from "./DesignerStateProvider";
import MaterialIcon from "../util/MaterialIcon";
import IconButtonWithTooltip from "./IconButtonWithTooltip";

function CanvasSizeInput() {
  const [canvasSize, setCanvasSize] = useAtom(canvasSizeAtom);
  const [width, setWidth] = useState(canvasSize.width.toString());
  const [height, setHeight] = useState(canvasSize.height.toString());

  useEffect(() => {
    setWidth(canvasSize.width.toString());
    setHeight(canvasSize.height.toString());
  }, [canvasSize]);

  const commonProps: InputProps = {
    size: "xs",
    placeholder: "Width",
    variant: "flushed",
    w: "4ch",
    type: "text",
    inputMode: "numeric",
    pattern: "\\d*",
  };

  const handleBlur = () => {
    setCanvasSize({
      width: Math.max(+width, 1),
      height: Math.max(+height, 1),
    });
  };

  return (
    <HStack mx={2}>
      <Text textStyle="sm">Canvas Size</Text>
      <Input
        {...commonProps}
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        onBlur={handleBlur}
      />
      ×
      <Input
        {...commonProps}
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        onBlur={handleBlur}
      />
    </HStack>
  );
}

export default function TopPanel() {
  const { canUndo, canRedo, actions } = useEditor((_state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));
  const [outlineVisible, setOutlineVisible] = useAtom(outlineVisibleAtom);

  return (
    <HStack p={1} borderBottomWidth={1}>
      <CanvasSizeInput />
      <Spacer />
      <IconButtonWithTooltip
        content="Outline"
        variant={outlineVisible ? "surface" : "ghost"}
        size="sm"
        onClick={() => setOutlineVisible(!outlineVisible)}
      >
        <MaterialIcon>select</MaterialIcon>
      </IconButtonWithTooltip>
      <Separator orientation="vertical" />
      <Group attached>
        <IconButtonWithTooltip
          content="Undo"
          variant="ghost"
          size="sm"
          disabled={!canUndo}
          onClick={() => actions.history.undo()}
        >
          <MaterialIcon>undo</MaterialIcon>
        </IconButtonWithTooltip>
        <IconButtonWithTooltip
          content="Redo"
          variant="ghost"
          size="sm"
          disabled={!canRedo}
          onClick={() => actions.history.redo()}
        >
          <MaterialIcon>redo</MaterialIcon>
        </IconButtonWithTooltip>
      </Group>
    </HStack>
  );
}
