import { Grid, Heading, StackProps, VStack } from "@chakra-ui/react";
import { useEditor } from "@craftjs/core";
import MaterialIcon from "../util/MaterialIcon";
import { BlockView } from "./BlockView";
import { FlexLayoutBox, FlexLayoutLabel } from "./user";
import { SimpleGuiButton } from "./user/SimpleGuiButton";
import { SimpleGuiSlider } from "./user/SimpleGuiSlider";
import React from "react";
import { expandStyleShorthands } from "../util/expandStyleShorthands";
import { SimpleGuiCheckBox } from "./user/SimpleGuiCheckBox";
import { SimpleGuiRadioButtons } from "./user/SimpleGuiRadioButtons";
import { SimpleGuiHorizontalRadioButtons } from "./user/SimpleGuiHorizontalRadioButtons";
import { SimpleGuiColorPicker } from "./user/SimpleGuiColorPicker";
import { SimpleGuiListBox } from "./user/SimpleGuiListBox";
import { SimpleGuiVerticalSlider } from "./user/SimpleGuiVerticalSlider";
import { SimpleGuiTextArea } from "./user/SimpleGuiTextArea";
import { SimpleGuiTextBox } from "./user/SimpleGuiTextBox";

const Data: ComponentTemplateGroup[] = [
  {
    id: "basic",
    displayName: "Basic",
    items: [
      {
        id: "flexlayout-box-horizontal",
        displayName: "Box (Horizontal)",
        icon: <MaterialIcon>more_horiz</MaterialIcon>,
        node: (
          <FlexLayoutBox
            style={expandStyleShorthands({
              flexDirection: "row",
              gap: "5px",
              padding: "10px",
            })}
          >
            <FlexLayoutLabel>Item 1</FlexLayoutLabel>
            <FlexLayoutLabel>Item 2</FlexLayoutLabel>
            <FlexLayoutLabel>Item 3</FlexLayoutLabel>
          </FlexLayoutBox>
        ),
      },
      {
        id: "flexlayout-box-vertical",
        displayName: "Box (Vertical)",
        icon: <MaterialIcon>more_vert</MaterialIcon>,
        node: (
          <FlexLayoutBox
            style={expandStyleShorthands({
              flexDirection: "column",
              gap: "5px",
              padding: "10px",
            })}
          >
            <FlexLayoutLabel>Item 1</FlexLayoutLabel>
            <FlexLayoutLabel>Item 2</FlexLayoutLabel>
            <FlexLayoutLabel>Item 3</FlexLayoutLabel>
          </FlexLayoutBox>
        ),
      },
      {
        id: "flexlayout-spacer",
        displayName: "Spacer",
        icon: <MaterialIcon>expand</MaterialIcon>,
        node: <FlexLayoutBox style={expandStyleShorthands({ flex: "1" })} />,
      },
      {
        id: "flexlayout-text",
        displayName: "Text",
        icon: <MaterialIcon>abc</MaterialIcon>,
        node: <FlexLayoutLabel>Text</FlexLayoutLabel>,
      },
    ],
  },
  {
    id: "simple-gui",
    displayName: "SimpleGUI",
    items: [
      {
        id: "simplegui-button",
        displayName: "Button",
        icon: <MaterialIcon>highlight_mouse_cursor</MaterialIcon>,
        node: <SimpleGuiButton>Button</SimpleGuiButton>,
      },
      {
        id: "simplegui-checkbox",
        displayName: "CheckBox",
        icon: <MaterialIcon>check_box</MaterialIcon>,
        node: <SimpleGuiCheckBox />,
      },
      {
        id: "simplegui-radio-buttons",
        displayName: "RadioButtons (Vertical)",
        icon: <MaterialIcon>radio_button_checked</MaterialIcon>,
        node: (
          <SimpleGuiRadioButtons>
            {"Option 1\nOption 2\nOption 3"}
          </SimpleGuiRadioButtons>
        ),
      },
      {
        id: "simplegui-horizontal-radio-buttons",
        displayName: "RadioButtons (Horizontal)",
        icon: <MaterialIcon>radio_button_checked</MaterialIcon>,
        node: (
          <SimpleGuiHorizontalRadioButtons>
            {"Option 1\nOption 2\nOption 3"}
          </SimpleGuiHorizontalRadioButtons>
        ),
      },
      {
        id: "simplegui-color-picker",
        displayName: "ColorPicker",
        icon: <MaterialIcon>palette</MaterialIcon>,
        node: <SimpleGuiColorPicker />,
      },
      {
        id: "simplegui-listbox",
        displayName: "ListBox",
        icon: <MaterialIcon>lists</MaterialIcon>,
        node: <SimpleGuiListBox>{"Item 1\nItem 2\nItem 3"}</SimpleGuiListBox>,
      },
      {
        id: "simplegui-slider",
        displayName: "Slider (Horizontal)",
        icon: <MaterialIcon>switches</MaterialIcon>,
        node: <SimpleGuiSlider />,
      },
      {
        id: "simplegui-vertical-slider",
        displayName: "Slider (Vertical)",
        icon: <MaterialIcon rotate="-90deg">switches</MaterialIcon>,
        node: <SimpleGuiVerticalSlider />,
      },
      {
        id: "simplegui-text-box",
        displayName: "TextBox",
        icon: <MaterialIcon>edit_square</MaterialIcon>,
        node: <SimpleGuiTextBox>TextBox</SimpleGuiTextBox>,
      },
      {
        id: "simplegui-text-area",
        displayName: "TextArea (Multiline)",
        icon: <MaterialIcon>edit_square</MaterialIcon>,
        node: <SimpleGuiTextArea>TextArea</SimpleGuiTextArea>,
      },
    ],
  },
];

export function ComponentTemplates({ ...props }: StackProps) {
  const { connectors } = useEditor();

  return (
    <VStack alignItems="stretch" borderTopWidth="1px" {...props}>
      {Data.map((group) => (
        <React.Fragment key={group.id}>
          <Heading padding={2} size="md">
            {group.displayName}
          </Heading>
          <Grid
            templateColumns="repeat(auto-fill, minmax(100px, 1fr))"
            gap={2}
            paddingX={3}
          >
            {group.items.map((template) => (
              <BlockView
                key={template.id}
                icon={template.icon}
                heading={template.displayName}
                ref={(e: HTMLDivElement) => connectors.create(e, template.node)}
              />
            ))}
          </Grid>
        </React.Fragment>
      ))}
    </VStack>
  );
}
