import { ROOT_NODE, useEditor, useNode } from "@craftjs/core";
import { Property } from "csstype";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NodeBorderThickness, NodeStyleClassNames } from "../config";
import { designSpaceElementAtom } from "./DesignerStateProvider";
import { FlexLayoutCommonProps } from "../types/FlexLayoutCommonProps";
import {
  Box,
  Group,
  Heading,
  HeadingProps,
  HStack,
  IconButton,
  IconButtonProps,
  Span,
  StackProps,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { createPortal } from "react-dom";
import MaterialIcon from "../util/MaterialIcon";
import IconButtonWithTooltip from "./IconButtonWithTooltip";
import {
  MenuContent,
  MenuItem,
  MenuItemCommand,
  MenuRoot,
  MenuTrigger,
} from "./ui/menu";
import { StyleProperties } from "../util/styleProperties";

type NodeProps = FlexLayoutCommonProps & Record<string, any>;

function QuickEditToggleButton({
  property,
  flexDirection,
  value,
  onToggle,
  ...props
}: {
  property: string;
  flexDirection?: FlexDirection;
  value?: string;
  onToggle: (nextValue: string) => void;
} & IconButtonProps) {
  // Craft.jsのマウスイベントと競合するため伝播を止める
  const onMouseDownCapture = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation(),
    []
  );

  const data = StyleProperties[property];

  if (data.valueType !== "enum") {
    throw new Error("Invalid property type");
  }

  const displayValue =
    value !== undefined && value in data.choices ? value : data.defaultValue;

  const onClick = useCallback(() => {
    const choices = Object.keys(data.choices);
    const selectedIndex = value
      ? choices.indexOf(value)
      : choices.indexOf(data.defaultValue);
    const nextValue = choices[(selectedIndex + 1) % choices.length];
    onToggle(nextValue);
  }, [onToggle, value, property]);

  return (
    <IconButtonWithTooltip
      content={`${property}: ${value ?? data.defaultValue}`}
      size="2xs"
      fontSize="lg"
      onMouseDownCapture={onMouseDownCapture}
      onClick={onClick}
      {...props}
    >
      {data.choices[displayValue].getIcon!(
        flexDirection ?? StyleProperties["flex-direction"].defaultValue
      )}
    </IconButtonWithTooltip>
  );
}

function QuickEditButtons(props: StackProps) {
  const {
    nodeId,
    isRoot,
    isCanvas,
    nodeProps,
    actions: { setProp },
  } = useNode((node) => ({
    nodeId: node.id,
    isRoot: node.id === ROOT_NODE,
    isCanvas: node.data.isCanvas,
    nodeProps: node.data.props as NodeProps,
  }));
  const {
    toNodeTree,
    actions: { delete: deleteNode },
  } = useEditor((_state, query) => {
    const nodeQuery = query.node(nodeId);
    return {
      toNodeTree: () => nodeQuery.toNodeTree("childNodes"),
    };
  });

  const iconDirection = (() => {
    const value = nodeProps.style?.flexDirection;
    return value !== undefined &&
      value in StyleProperties["flex-direction"].choices
      ? value
      : "row";
  })();
  const isWrapped = (() => {
    const value = nodeProps.style?.flexWrap;
    return value !== undefined && value !== "nowrap";
  })();

  return (
    <HStack gap={1} alignItems="center" {...props}>
      {isCanvas && (
        <>
          <Group attached>
            <QuickEditToggleButton
              property="flex-direction"
              value={nodeProps.style?.flexDirection}
              onToggle={(nextValue) =>
                setProp((props: NodeProps) => {
                  props.style = {
                    ...props.style,
                    flexDirection: nextValue as Property.FlexDirection,
                  };
                }, 1000)
              }
            />
            <QuickEditToggleButton
              property="justify-content"
              flexDirection={iconDirection}
              value={nodeProps.style?.justifyContent}
              onToggle={(nextValue) =>
                setProp((props: NodeProps) => {
                  props.style = {
                    ...props.style,
                    justifyContent: nextValue as Property.JustifyContent,
                  };
                }, 1000)
              }
            />
            <QuickEditToggleButton
              property="align-items"
              flexDirection={iconDirection}
              value={nodeProps.style?.alignItems}
              onToggle={(nextValue) =>
                setProp((props: NodeProps) => {
                  props.style = {
                    ...props.style,
                    alignItems: nextValue as Property.AlignItems,
                  };
                }, 1000)
              }
            />
          </Group>
          <Group attached={isWrapped}>
            {isWrapped && (
              <QuickEditToggleButton
                property="align-content"
                flexDirection={iconDirection}
                value={nodeProps.style?.alignContent}
                onToggle={(nextValue) =>
                  setProp((props: NodeProps) => {
                    props.style = {
                      ...props.style,
                      alignContent: nextValue as Property.AlignContent,
                    };
                  }, 1000)
                }
              />
            )}
            <QuickEditToggleButton
              property="flex-wrap"
              value={nodeProps.style?.flexWrap}
              onToggle={(nextValue) =>
                setProp((props: NodeProps) => {
                  props.style = {
                    ...props.style,
                    flexWrap: nextValue as Property.FlexWrap,
                  };
                }, 1000)
              }
            />
          </Group>
        </>
      )}
      <MenuRoot
        positioning={{ placement: "bottom-end" }}
        onSelect={(details: { value: string }) => {
          switch (details.value) {
            case "cut":
              deleteNode(nodeId);
              break;
            case "copy":
              console.log(toNodeTree());
              break;
            case "remove":
              // Craft.jsのレイヤーマネージャーでエラーが表示される場合がある
              // https://github.com/prevwong/craft.js/issues/62
              deleteNode(nodeId);
              break;
          }
        }}
      >
        <MenuTrigger asChild>
          <IconButton
            size="2xs"
            onMouseDownCapture={(e) => e.stopPropagation()}
          >
            <MaterialIcon fontSize="lg">more_vert</MaterialIcon>
          </IconButton>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="cut" valueText="cut" disabled={true}>
            <MaterialIcon>content_cut</MaterialIcon>
            <Box flex="1">Cut</Box>
            <MenuItemCommand>⌘X</MenuItemCommand>
          </MenuItem>
          <MenuItem value="copy" valueText="copy" disabled={true}>
            <MaterialIcon>content_copy</MaterialIcon>
            <Box flex="1">Copy</Box>
            <MenuItemCommand>⌘C</MenuItemCommand>
          </MenuItem>
          <MenuItem value="remove" valueText="remove" disabled={isRoot}>
            <MaterialIcon>delete</MaterialIcon>
            <Box flex="1">Remove</Box>
            <MenuItemCommand>Del</MenuItemCommand>
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </HStack>
  );
}

function SelectedNodeHeader(props: HeadingProps) {
  const { displayName, userSpecifiedId } = useNode((node) => ({
    displayName: node.data.displayName,
    userSpecifiedId: node.data.props.id as string | undefined,
  }));

  return (
    <Heading
      size="sm"
      bg="colorPalette.focusRing"
      color="colorPalette.contrast"
      pointerEvents="none"
      paddingX={2}
      paddingY={1}
      textWrap="nowrap"
      {...props}
    >
      {displayName}
      {userSpecifiedId && (
        <Span color="colorPalette.contrast/60">#{userSpecifiedId}</Span>
      )}
    </Heading>
  );
}

function StickyItems() {
  const { isHovered, isSelected, dom } = useNode((node) => ({
    isHovered: node.events.hovered,
    isSelected: node.events.selected,
    dom: node.dom,
  }));
  const canvasDom = useAtomValue(designSpaceElementAtom);
  const [canvasRect, setCanvasRect] = useState<DOMRect | null>(null);
  const [nodeRect, setNodeRect] = useState<DOMRect | null>(null);

  const updateNodeRect = () => dom && setNodeRect(dom.getBoundingClientRect());

  // キャンバスのサイズ変更検知
  useEffect(() => {
    const onScroll = () => dom && updateNodeRect();
    const updateCanvasRect = (el: Element) =>
      setCanvasRect(el.getBoundingClientRect());
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      updateCanvasRect(entry.target);
    });

    if (canvasDom) {
      updateCanvasRect(canvasDom);
      observer.observe(canvasDom);

      canvasDom.firstElementChild?.addEventListener("scroll", onScroll);
    }

    return () => {
      observer.disconnect();
      canvasDom?.firstElementChild?.removeEventListener("scroll", onScroll);
    };
  }, [canvasDom]);

  // 要素のサイズ変更検知
  useEffect(() => {
    const updateNodeRect = (el: Element) => {
      setNodeRect(el.getBoundingClientRect());
    };
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      updateNodeRect(entry.target);
    });

    if (dom) {
      updateNodeRect(dom);
      observer.observe(dom);
    }

    return () => observer.disconnect();
  }, [dom]);

  // キャンバスDOM内における相対位置
  const nodeLocalOffset = useMemo(() => {
    if (!canvasRect || !nodeRect) {
      return null;
    }

    return {
      top: nodeRect.top - canvasRect.top,
      left: nodeRect.left - canvasRect.left,
      right: canvasRect.right - nodeRect.right,
      bottom: canvasRect.bottom - nodeRect.bottom,
    };
  }, [canvasRect, nodeRect]);

  return !nodeLocalOffset || !canvasDom
    ? null
    : createPortal(
        <HStack
          gap={1}
          position="absolute"
          justifyContent="space-between"
          alignItems="end"
          css={{
            "--sticky-items-top": `${
              nodeLocalOffset.top - NodeBorderThickness
            }px`,
            "--sticky-items-left": `${
              nodeLocalOffset.left - NodeBorderThickness
            }px`,
            "--sticky-items-right": `${
              nodeLocalOffset.right - NodeBorderThickness
            }px`,
            "--sticky-items-height": "1.8em",
          }}
          top="max(calc(var(--sticky-items-top) - var(--sticky-items-height)), 0px)"
          height="var(--sticky-items-height)"
          left="max(var(--sticky-items-left), 0px)"
          right="max(var(--sticky-items-right), 0px)"
          pointerEvents="none"
        >
          <SelectedNodeHeader />
          {isSelected && (
            <QuickEditButtons pointerEvents="auto" paddingBottom={1} />
          )}
        </HStack>,
        canvasDom
      );
}

export const RenderNode = ({ render }: { render: React.ReactElement }) => {
  const { isHovered, isSelected, dom } = useNode((node) => ({
    isHovered: node.events.hovered,
    isSelected: node.events.selected,
    dom: node.dom,
  }));

  useEffect(() => {
    if (dom) {
      isSelected
        ? dom.classList.add(NodeStyleClassNames.selected)
        : dom.classList.remove(NodeStyleClassNames.selected);
      isHovered && !isSelected
        ? dom.classList.add(NodeStyleClassNames.hovered)
        : dom.classList.remove(NodeStyleClassNames.hovered);
    }
  }, [dom, isHovered, isSelected]);

  // const getLocalRect = useCallback(() => {
  //   if (!canvasDom) {
  //     return {};
  //   }

  //   const canvasRect = canvasDom.getBoundingClientRect();

  //   const scrollbarWidth = canvasDom.offsetWidth - canvasDom.clientWidth;
  //   const scrollbarHeight = canvasDom.offsetHeight - canvasDom.clientHeight;
  //   const scroll = {
  //     left: canvasDom.scrollLeft,
  //     top: canvasDom.scrollTop,
  //   };

  //   return {
  //     offset: {
  //       left: globalRect.left - canvasRect.left + scroll.left,
  //       top: globalRect.top - canvasRect.top + scroll.top,
  //       right:
  //         canvasRect.right - globalRect.right - scroll.left - scrollbarWidth,
  //       bottom:
  //         canvasRect.bottom - globalRect.bottom - scroll.top - scrollbarHeight,
  //     },
  //     size: {
  //       width: globalRect.width,
  //       height: globalRect.height,
  //     },
  //   };
  // }, [globalRect, canvasDom]);

  return (
    <>
      {render}
      {(isHovered || isSelected) && <StickyItems />}
    </>
  );
};
