import {
  AccordionItemContent,
  Editable,
  HStack,
  HTMLChakraProps,
  Input,
  VStack,
} from "@chakra-ui/react";
import { ROOT_NODE, useEditor, UserComponent } from "@craftjs/core";
import { Field } from "./ui/field";
import { FlexLayoutCommonProps } from "../types/FlexLayoutCommonProps";
import MaterialIcon from "../util/MaterialIcon";
import { EmptyState } from "./ui/empty-state";
import { useCallback, useEffect, useReducer } from "react";
import { Tag } from "./ui/tag";
import {
  AccordionItem,
  AccordionItemTrigger,
  AccordionRoot,
} from "./ui/accordion";
import { UserComponentRelated } from "./user/internal";
import StyleLengthInput from "./input/StyleLengthInput";
import { StyleEnumButtonInput } from "./input/StyleEnumButtonInput";
import { StyleEnumDropdownInput } from "./input/StyleEnumDropdownInput";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { StyleRatioInput } from "./input/StyleRatioInput";

type NodeProps = Partial<FlexLayoutCommonProps> & Record<string, any>;
const CLEAR: unique symbol = Symbol("CLEAR");

function temporalPropsReducer(
  state: NodeProps,
  patch: Record<string, any | undefined> | typeof CLEAR
) {
  if (patch === CLEAR) {
    return {};
  }

  for (const key in patch) {
    state[key] = patch[key];
  }

  return { ...state };
}

const openedMenuAtom = atomWithStorage<string[]>(
  "propertyeditor_opened_menu",
  []
);

export function PropertyEditor({ ...props }: HTMLChakraProps<"div">) {
  const {
    selectedNodeIds,
    selectedNodes,
    actions: { setProp: setPropCraftAction },
  } = useEditor((state, query) => {
    const selectedNodeIds = state.events.selected;
    return {
      selectedNodeIds,
      selectedNodes: [...selectedNodeIds].map((id) => query.node(id).get()),
    };
  });

  const [openedMenu, setOpenedMenu] = useAtom(openedMenuAtom);

  // 編集中のプロパティ
  const [temporalProps, setTemporalProps] = useReducer(
    temporalPropsReducer,
    {}
  );
  useEffect(() => {
    setTemporalProps(CLEAR);
  }, [selectedNodeIds]);

  const setProp = useCallback(
    (key: string, value: any | undefined) => {
      setPropCraftAction(
        selectedNodes.map((n) => n.id),
        (props: NodeProps) => {
          setTemporalProps({ [key]: CLEAR });

          if (key === "style") {
            console.assert(value && typeof value === "object");
            if (props.style === undefined) {
              props.style = {};
            }
            Object.assign(props.style, value);
            return;
          }

          if (key === "class") {
            if (value !== undefined) {
              value = [
                ...new Set(value.split(" ").filter((v: string) => v)),
              ].join(" ");
            }
          }

          props[key] = value;
        }
      );
    },
    [setPropCraftAction, selectedNodes]
  );

  // 選択されたノードがない場合の画面を表示
  if (!selectedNodes.length) {
    return (
      <EmptyState
        icon={<MaterialIcon>remove_selection</MaterialIcon>}
        title="Edit Properties"
        description="Select a component to view and modify its properties here"
        {...props}
      />
    );
  }

  // 共通のプロパティを取得 (AND)
  let commonProps: NodeProps = structuredClone(selectedNodes[0].data.props);
  for (const node of selectedNodes.slice(1)) {
    for (const key in node.data.props) {
      if (key === "class") {
        const commonSet = new Set(
          (commonProps[key] || "").split(" ").filter((value) => value)
        );
        const otherSet = new Set(
          node.data.props[key].split(" ").filter((value) => value)
        );
        commonSet.intersection(otherSet);
        commonProps[key] = [...commonSet].join(" ");
        continue;
      }

      if (key === "style") {
        const commonStyle = commonProps[key];
        const otherStyle = node.data.props[key];
        for (const styleKey in commonStyle) {
          if (commonStyle[styleKey] !== otherStyle[styleKey]) {
            delete commonStyle[styleKey];
          }
        }
        continue;
      }

      if (commonProps[key] !== node.data.props[key]) {
        delete commonProps[key];
      }
    }
  }

  // 共通の形や属性を取得
  let CommonType = selectedNodes[0].data
    .type as UserComponent<FlexLayoutCommonProps> | null;
  let isCanvas = selectedNodes[0].data.isCanvas;
  let containRoot = selectedNodes[0].id === ROOT_NODE;
  for (const node of selectedNodes.slice(1)) {
    isCanvas &&= node.data.isCanvas;
    containRoot ||= node.id === ROOT_NODE;
    if (CommonType !== node.data.type) {
      CommonType = null;
      break;
    }
  }

  // 表示用のプロパティを取得 (OR)
  const displayProps = structuredClone(commonProps);
  for (const key in temporalProps) {
    if (key === "style") {
      const displayStyle = displayProps["style"] ?? {};
      const temporalStyle = temporalProps["style"]!;
      for (const styleKey in temporalStyle) {
        displayStyle[styleKey] = temporalStyle[styleKey];
      }
      continue;
    }

    displayProps[key] = temporalProps[key];
  }

  // console.log("temporalProps", temporalProps);
  // console.log("displayProps", JSON.stringify(displayProps, null, 2));

  const EditorElement = (
    CommonType?.craft?.related as UserComponentRelated | undefined
  )?.editor;

  return (
    <VStack p={0} alignItems="stretch" gap={0} {...props}>
      <VStack p={3} css={{ "--field-label-width": "3em" }}>
        <Field label="ID" orientation="horizontal">
          <Input
            value={displayProps.id ?? ""}
            onChange={(e) => {
              // console.log("onChange", e);
              setTemporalProps({ id: e.target.value });
            }}
            onAbort={() => setTemporalProps({ id: CLEAR })}
            onBlur={(e) => setProp("id", e.target.value ?? undefined)}
            disabled={selectedNodes.length > 1}
          />
        </Field>
        <Field label="Class" orientation="horizontal">
          <Editable.Root
            value={displayProps.class ?? ""}
            onValueChange={(e: { value: string }) =>
              setTemporalProps({ class: e.value })
            }
            onValueCommit={(e: { value: string }) =>
              setProp("class", e.value || undefined)
            }
            onValueRevert={() => setTemporalProps({ class: CLEAR })}
          >
            <Editable.Preview flexWrap="wrap" gap="1" flex={1}>
              <>
                {(() => {
                  const display = commonProps.class
                    ?.split(" ")
                    .filter((value) => value)
                    .map((value, index) => <Tag key={index}>{value}</Tag>);
                  return display?.length ? display : "None";
                })()}
              </>
            </Editable.Preview>
            <Editable.Input />
          </Editable.Root>
        </Field>
      </VStack>
      <AccordionRoot
        multiple
        borderTopWidth={1}
        value={openedMenu}
        onValueChange={(e: { value: string[] }) => setOpenedMenu(e.value)}
      >
        {EditorElement && (
          <AccordionItem value="component">
            <AccordionItemTrigger paddingX={2}>
              {CommonType?.craft?.name ?? "Component"}
            </AccordionItemTrigger>
            <AccordionItemContent p={2}>
              <EditorElement nodeProps={commonProps} setNodeProp={setProp} />
            </AccordionItemContent>
          </AccordionItem>
        )}
        {isCanvas && (
          <AccordionItem value="layout">
            <AccordionItemTrigger paddingX={2}>Layout</AccordionItemTrigger>
            <AccordionItemContent asChild>
              <VStack p={2}>
                <StyleEnumButtonInput
                  property="flex-direction"
                  size="sm"
                  value={displayProps.style?.flexDirection}
                  setValue={(value) =>
                    setProp("style", { flexDirection: value })
                  }
                />
                <StyleEnumButtonInput
                  property="align-items"
                  flexDirection={displayProps.style?.flexDirection}
                  size="sm"
                  value={displayProps.style?.alignItems}
                  setValue={(value) => setProp("style", { alignItems: value })}
                />
                <StyleEnumButtonInput
                  property="justify-content"
                  flexDirection={displayProps.style?.flexDirection}
                  size="sm"
                  value={displayProps.style?.justifyContent}
                  setValue={(value) =>
                    setProp("style", { justifyContent: value })
                  }
                />
                <StyleEnumButtonInput
                  property="flex-wrap"
                  size="sm"
                  value={displayProps.style?.flexWrap}
                  setValue={(value) => setProp("style", { flexWrap: value })}
                />
                <StyleEnumButtonInput
                  property="align-content"
                  flexDirection={displayProps.style?.flexDirection}
                  size="sm"
                  value={displayProps.style?.alignContent}
                  setValue={(value) =>
                    setProp("style", { alignContent: value })
                  }
                />
              </VStack>
            </AccordionItemContent>
          </AccordionItem>
        )}
        <AccordionItem value="size">
          <AccordionItemTrigger paddingX={2}>Size</AccordionItemTrigger>
          <AccordionItemContent asChild>
            <VStack p={2} alignItems="stretch">
              <HStack p={0}>
                <StyleLengthInput
                  property="flex-grow"
                  state={displayProps.style?.flexGrow}
                  onStateChange={(state) =>
                    setTemporalProps({ style: { flexGrow: state } })
                  }
                  onValueChange={(value) =>
                    setProp("style", { flexGrow: value })
                  }
                />
                <StyleLengthInput
                  property="flex-shrink"
                  state={displayProps.style?.flexShrink}
                  onStateChange={(state) =>
                    setTemporalProps({ style: { flexShrink: state } })
                  }
                  onValueChange={(value) =>
                    setProp("style", { flexShrink: value })
                  }
                />
              </HStack>
              <StyleLengthInput
                property="flex-basis"
                state={displayProps.style?.flexBasis}
                onStateChange={(state) =>
                  setTemporalProps({ style: { flexBasis: state } })
                }
                onValueChange={(value) =>
                  setProp("style", { flexBasis: value })
                }
              />
              <HStack p={0}>
                <StyleLengthInput
                  property="width"
                  state={displayProps.style?.width}
                  onStateChange={(state) =>
                    setTemporalProps({ style: { width: state } })
                  }
                  onValueChange={(value) => setProp("style", { width: value })}
                />
                <StyleLengthInput
                  property="height"
                  state={displayProps.style?.height}
                  onStateChange={(state) =>
                    setTemporalProps({ style: { height: state } })
                  }
                  onValueChange={(value) => setProp("style", { height: value })}
                />
              </HStack>
              <HStack p={0}>
                <StyleLengthInput
                  property="min-width"
                  state={displayProps.style?.minWidth}
                  onStateChange={(state) =>
                    setTemporalProps({ style: { minWidth: state } })
                  }
                  onValueChange={(value) =>
                    setProp("style", { minWidth: value })
                  }
                />
                <StyleLengthInput
                  property="min-height"
                  state={displayProps.style?.minHeight}
                  onStateChange={(state) =>
                    setTemporalProps({ style: { minHeight: state } })
                  }
                  onValueChange={(value) =>
                    setProp("style", { minHeight: value })
                  }
                />
              </HStack>
              <HStack p={0}>
                <StyleLengthInput
                  property="max-width"
                  state={displayProps.style?.maxWidth}
                  onStateChange={(state) =>
                    setTemporalProps({ style: { maxWidth: state } })
                  }
                  onValueChange={(value) =>
                    setProp("style", { maxWidth: value })
                  }
                />
                <StyleLengthInput
                  property="max-height"
                  state={displayProps.style?.maxHeight}
                  onStateChange={(state) =>
                    setTemporalProps({ style: { maxHeight: state } })
                  }
                  onValueChange={(value) =>
                    setProp("style", { maxHeight: value })
                  }
                />
              </HStack>
              <Field label="Border Width">
                <VStack p={0} alignItems="center">
                  <StyleLengthInput
                    property="border-top-width"
                    showLabel={false}
                    state={displayProps.style?.borderTopWidth}
                    onStateChange={(state) =>
                      setTemporalProps({ style: { borderTopWidth: state } })
                    }
                    onValueChange={(value) =>
                      setProp("style", { borderTopWidth: value })
                    }
                    w="50%"
                    size="sm"
                  />
                  <HStack p={0}>
                    <StyleLengthInput
                      property="border-left-width"
                      showLabel={false}
                      state={displayProps.style?.borderLeftWidth}
                      onStateChange={(state) =>
                        setTemporalProps({ style: { borderLeftWidth: state } })
                      }
                      onValueChange={(value) =>
                        setProp("style", { borderLeftWidth: value })
                      }
                      w="50%"
                      size="sm"
                    />
                    <StyleLengthInput
                      property="border-right-width"
                      showLabel={false}
                      state={displayProps.style?.borderRightWidth}
                      onStateChange={(state) =>
                        setTemporalProps({ style: { borderRightWidth: state } })
                      }
                      onValueChange={(value) =>
                        setProp("style", { borderRightWidth: value })
                      }
                      w="50%"
                      size="sm"
                    />
                  </HStack>
                  <StyleLengthInput
                    property="border-bottom-width"
                    showLabel={false}
                    state={displayProps.style?.borderBottomWidth}
                    onStateChange={(state) =>
                      setTemporalProps({ style: { borderBottomWidth: state } })
                    }
                    onValueChange={(value) =>
                      setProp("style", { borderBottomWidth: value })
                    }
                    w="50%"
                    size="sm"
                  />
                </VStack>
              </Field>
              <StyleRatioInput
                property="aspect-ratio"
                state={displayProps.style?.aspectRatio}
                setState={(state) =>
                  setTemporalProps({ style: { aspectRatio: state } })
                }
                onBlur={(value) => setProp("style", { aspectRatio: value })}
              />
            </VStack>
          </AccordionItemContent>
        </AccordionItem>
        <AccordionItem value="space">
          <AccordionItemTrigger paddingX={2}>Space</AccordionItemTrigger>
          <AccordionItemContent asChild>
            <VStack p={2} alignItems="stretch">
              <Field label="Margin">
                <VStack p={0} alignItems="center">
                  <StyleLengthInput
                    property="margin-top"
                    showLabel={false}
                    state={displayProps.style?.marginTop}
                    onStateChange={(state) =>
                      setTemporalProps({ style: { marginTop: state } })
                    }
                    onValueChange={(value) =>
                      setProp("style", { marginTop: value })
                    }
                    w="50%"
                    size="sm"
                  />
                  <HStack p={0}>
                    <StyleLengthInput
                      property="margin-left"
                      showLabel={false}
                      state={displayProps.style?.marginLeft}
                      onStateChange={(state) =>
                        setTemporalProps({ style: { marginLeft: state } })
                      }
                      onValueChange={(value) =>
                        setProp("style", { marginLeft: value })
                      }
                      w="50%"
                      size="sm"
                    />
                    <StyleLengthInput
                      property="margin-right"
                      showLabel={false}
                      state={displayProps.style?.marginRight}
                      onStateChange={(state) =>
                        setTemporalProps({ style: { marginRight: state } })
                      }
                      onValueChange={(value) =>
                        setProp("style", { marginRight: value })
                      }
                      w="50%"
                      size="sm"
                    />
                  </HStack>
                  <StyleLengthInput
                    property="margin-bottom"
                    showLabel={false}
                    state={displayProps.style?.marginBottom}
                    onStateChange={(state) =>
                      setTemporalProps({ style: { marginBottom: state } })
                    }
                    onValueChange={(value) =>
                      setProp("style", { marginBottom: value })
                    }
                    w="50%"
                    size="sm"
                  />
                </VStack>
              </Field>
              <Field label="Padding">
                <VStack p={0} alignItems="center">
                  <StyleLengthInput
                    property="padding-top"
                    showLabel={false}
                    state={displayProps.style?.paddingTop}
                    onStateChange={(state) =>
                      setTemporalProps({ style: { paddingTop: state } })
                    }
                    onValueChange={(value) =>
                      setProp("style", { paddingTop: value })
                    }
                    w="50%"
                    size="sm"
                  />
                  <HStack p={0}>
                    <StyleLengthInput
                      property="padding-left"
                      showLabel={false}
                      state={displayProps.style?.paddingLeft}
                      onStateChange={(state) =>
                        setTemporalProps({ style: { paddingLeft: state } })
                      }
                      onValueChange={(value) =>
                        setProp("style", { paddingLeft: value })
                      }
                      w="50%"
                      size="sm"
                    />
                    <StyleLengthInput
                      property="padding-right"
                      showLabel={false}
                      state={displayProps.style?.paddingRight}
                      onStateChange={(state) =>
                        setTemporalProps({ style: { paddingRight: state } })
                      }
                      onValueChange={(value) =>
                        setProp("style", { paddingRight: value })
                      }
                      w="50%"
                      size="sm"
                    />
                  </HStack>
                  <StyleLengthInput
                    property="padding-bottom"
                    showLabel={false}
                    state={displayProps.style?.paddingBottom}
                    onStateChange={(state) =>
                      setTemporalProps({ style: { paddingBottom: state } })
                    }
                    onValueChange={(value) =>
                      setProp("style", { paddingBottom: value })
                    }
                    w="50%"
                    size="sm"
                  />
                </VStack>
              </Field>
              {isCanvas && (
                <HStack>
                  <StyleLengthInput
                    property="row-gap"
                    state={displayProps.style?.rowGap}
                    onStateChange={(state) =>
                      setTemporalProps({ style: { rowGap: state } })
                    }
                    onValueChange={(value) =>
                      setProp("style", { rowGap: value })
                    }
                  />
                  <StyleLengthInput
                    property="column-gap"
                    state={displayProps.style?.columnGap}
                    onStateChange={(state) =>
                      setTemporalProps({ style: { columnGap: state } })
                    }
                    onValueChange={(value) =>
                      setProp("style", { columnGap: value })
                    }
                  />
                </HStack>
              )}
            </VStack>
          </AccordionItemContent>
        </AccordionItem>
        {containRoot || (
          <AccordionItem value="position">
            <AccordionItemTrigger paddingX={2}>Position</AccordionItemTrigger>
            <AccordionItemContent asChild>
              <VStack p={2} alignItems="stretch">
                <StyleEnumDropdownInput
                  property="position"
                  value={displayProps.style?.position}
                  setValue={(value) => setProp("style", { position: value })}
                />
                {["static", undefined].includes(
                  commonProps.style?.position
                ) || (
                  <VStack p={0} alignItems="center">
                    <StyleLengthInput
                      property="top"
                      state={displayProps.style?.top}
                      onStateChange={(state) =>
                        setTemporalProps({ style: { top: state } })
                      }
                      onValueChange={(value) =>
                        setProp("style", { top: value })
                      }
                      w="50%"
                      size="sm"
                    />
                    <HStack p={0}>
                      <StyleLengthInput
                        property="left"
                        state={displayProps.style?.left}
                        onStateChange={(state) =>
                          setTemporalProps({ style: { left: state } })
                        }
                        onValueChange={(value) =>
                          setProp("style", { left: value })
                        }
                        w="50%"
                        size="sm"
                      />
                      <StyleLengthInput
                        property="right"
                        state={displayProps.style?.right}
                        onStateChange={(state) =>
                          setTemporalProps({ style: { right: state } })
                        }
                        onValueChange={(value) =>
                          setProp("style", { right: value })
                        }
                        w="50%"
                        size="sm"
                      />
                    </HStack>
                    <StyleLengthInput
                      property="bottom"
                      state={displayProps.style?.bottom}
                      onStateChange={(state) =>
                        setTemporalProps({ style: { bottom: state } })
                      }
                      onValueChange={(value) =>
                        setProp("style", { bottom: value })
                      }
                      w="50%"
                      size="sm"
                    />
                  </VStack>
                )}
                <StyleEnumButtonInput
                  property="align-self"
                  size="sm"
                  value={displayProps.style?.alignSelf}
                  setValue={(value) => setProp("style", { alignSelf: value })}
                />
              </VStack>
            </AccordionItemContent>
          </AccordionItem>
        )}
        <AccordionItem value="typography">
          <AccordionItemTrigger paddingX={2}>Typography</AccordionItemTrigger>
          <AccordionItemContent asChild>
            <VStack p={2} alignItems="stretch">
              <Field label="Siv3D Font" alignItems="stretch">
                <Input
                  value={displayProps["siv3d-font"] || ""}
                  onChange={(e) =>
                    setTemporalProps({ "siv3d-font": e.target.value })
                  }
                  onBlur={(e) =>
                    setProp("siv3d-font", e.target.value || undefined)
                  }
                />
              </Field>
              <StyleLengthInput
                property="font-size"
                state={displayProps.style?.fontSize}
                onStateChange={(state) =>
                  setTemporalProps({ style: { fontSize: state } })
                }
                onValueChange={(value) => setProp("style", { fontSize: value })}
              />
              <StyleLengthInput
                property="line-height"
                state={displayProps.style?.lineHeight}
                onStateChange={(state) =>
                  setTemporalProps({ style: { lineHeight: state } })
                }
                onValueChange={(value) =>
                  setProp("style", { lineHeight: value })
                }
              />
              <StyleEnumButtonInput
                property="text-align"
                size="sm"
                value={displayProps.style?.textAlign}
                setValue={(value) => setProp("style", { textAlign: value })}
              />
            </VStack>
          </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
    </VStack>
  );
}
