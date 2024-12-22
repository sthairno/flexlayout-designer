import { useNode, UserComponent } from "@craftjs/core";
import { FlexLayoutCommonProps } from "../../types/FlexLayoutCommonProps";
import {
  DefaultComponentViewProps,
  EditorComponentProps,
  UserComponentInfo,
  UserComponentRelated,
} from "./internal";
import { Box, Span, Textarea } from "@chakra-ui/react";
import { SimpleGuiOptions, siv3dColorFtoRGB } from "../../util/siv3d";
import { Field } from "../ui/field";
import { Fragment } from "react/jsx-runtime";

interface SimpleGuiTextAreaProps extends FlexLayoutCommonProps {
  children?: string;
}

const SimpleGuiTextAreaPropsEditor = ({
  nodeProps,
  setNodeProp,
}: EditorComponentProps) => {
  return (
    <Field label="Default Text" alignItems="stretch">
      <Textarea
        value={nodeProps.children || ""}
        onChange={(e) => setNodeProp("children", e.target.value)}
      />
    </Field>
  );
};

export const SimpleGuiTextArea: UserComponent<SimpleGuiTextAreaProps> = ({
  children,
  style,
}: SimpleGuiTextAreaProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <Box
      ref={(e: HTMLElement) => connect(drag(e))}
      style={style}
      borderColor="transparent"
      fontSize="20px"
      lineHeight="normal"
      minWidth={`${SimpleGuiOptions.minTextBoxWidth}px`}
      minHeight={`${SimpleGuiOptions.textBoxHeight}px`}
      height={0} // "height: auto"を回避 https://www.gaji.jp/blog/2021/06/17/7566/
      boxSizing="border-box"
      {...DefaultComponentViewProps}
    >
      <Box
        position="relative"
        backgroundColor="white"
        borderWidth="2px"
        borderColor={siv3dColorFtoRGB(0.5)}
        width="100%"
        height="100%"
        overflow="hidden"
        wordBreak="break-all"
        boxSizing="border-box"
      >
        <Span
          position="absolute"
          // textRenderRegion
          top="2px"
          right={`${SimpleGuiOptions.textAreaScrollBarWidth + 6}px`}
          bottom="2px"
          left="8px"
          color={SimpleGuiOptions.activeTextColor}
        >
          {children?.split("\n").map((line, i, list) => (
            <Fragment key={i}>
              {line}
              {i < list.length - 1 && <br />}
            </Fragment>
          ))}
        </Span>
      </Box>
    </Box>
  );
};
SimpleGuiTextArea.craft = {
  isCanvas: false,
  name: "SimpleGUI.TextArea",
  related: {
    editor: SimpleGuiTextAreaPropsEditor,
  } as UserComponentRelated,
  info: {
    hasTextChild: true,
  } as UserComponentInfo,
};
