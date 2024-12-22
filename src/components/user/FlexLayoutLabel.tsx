import { useNode, UserComponent } from "@craftjs/core";
import { Box, Textarea } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import {
  DefaultComponentViewProps,
  EditorComponentProps,
  UserComponentInfo,
  UserComponentRelated,
} from "./internal";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";
import { Field } from "../ui/field";

interface FlexLayoutTextProps extends FlexLayoutCommonProps {
  children?: string;
}

const FlexLayoutLabelPropsEditor = ({
  nodeProps,
  setNodeProp,
}: EditorComponentProps) => {
  return (
    <Field label="Text" alignItems="stretch">
      <Textarea
        value={nodeProps.children || ""}
        onChange={(e) => setNodeProp("children", e.target.value)}
      />
    </Field>
  );
};

export const FlexLayoutLabel: UserComponent<FlexLayoutTextProps> = ({
  children,
  style,
}: FlexLayoutTextProps) => {
  const {
    isSelected,
    isDragging,
    actions: { setProp },
    connectors: { connect, drag },
  } = useNode((node) => ({
    isSelected: node.events.selected,
    isDragging: node.events.dragged,
  }));

  const [edit, setEdit] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const isEditable = isSelected && !isDragging;

  useEffect(() => {
    if (!isEditable) {
      setEdit(false);
    }
  }, [isSelected, isDragging]);

  return (
    <Box
      position="relative"
      whiteSpace="pre-line"
      wordBreak="break-all"
      color={edit ? "transparent" : "white"}
      style={style}
      ref={(e: HTMLDivElement) => connect(drag(e))}
      onClick={() => {
        if (edit) {
          textAreaRef.current?.focus();
        } else if (isEditable) {
          setEdit(true);
        }
      }}
      {...DefaultComponentViewProps}
    >
      {
        /* 最後の行が空だった場合レイアウトに影響しないためゼロ幅空白を使う */
        children ? children + "\u200B" : ""
      }
      {edit && (
        <Textarea
          // 親要素とサイズを同期
          position="absolute"
          left={0}
          top={0}
          width="100%"
          height="100%"
          // 親要素とプロパティを同期
          padding="inherit"
          border="none"
          outline="none"
          resize="none"
          whiteSpace="inherit"
          wordBreak="inherit"
          lineHeight="inherit"
          textAlign="inherit"
          font="inherit"
          overflow="visible"
          scrollbarWidth="none"
          // イベント処理
          color="white"
          value={children}
          onBlur={() => setEdit(false)}
          onChange={(e) =>
            setProp(
              (prop: FlexLayoutTextProps) => (prop.children = e.target.value),
              1000
            )
          }
          ref={textAreaRef}
        />
      )}
    </Box>
  );
};
FlexLayoutLabel.craft = {
  isCanvas: false,
  name: "Label",
  related: {
    editor: FlexLayoutLabelPropsEditor,
  } as UserComponentRelated,
  info: {
    hasTextChild: true,
  } as UserComponentInfo,
};
