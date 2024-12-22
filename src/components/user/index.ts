import { UserComponent } from "@craftjs/core";
import { FlexLayoutBox } from "./FlexLayoutBox";
import { FlexLayoutLabel } from "./FlexLayoutLabel";
import { SimpleGuiButton } from "./SimpleGuiButton";
import { SimpleGuiSlider } from "./SimpleGuiSlider";
import { SimpleGuiVerticalSlider } from "./SimpleGuiVerticalSlider";
import { SimpleGuiCheckBox } from "./SimpleGuiCheckBox";
import { SimpleGuiRadioButtons } from "./SimpleGuiRadioButtons";
import { SimpleGuiHorizontalRadioButtons } from "./SimpleGuiHorizontalRadioButtons";
import { SimpleGuiColorPicker } from "./SimpleGuiColorPicker";
import { SimpleGuiListBox } from "./SimpleGuiListBox";
import { SimpleGuiTextArea } from "./SimpleGuiTextArea";
import { SimpleGuiTextBox } from "./SimpleGuiTextBox";

export { FlexLayoutBox, FlexLayoutLabel };
export type { UserComponentInfo } from "./internal";

export const UserComponents: UserComponent[] = [
  FlexLayoutBox,
  FlexLayoutLabel,
  SimpleGuiButton,
  SimpleGuiCheckBox,
  SimpleGuiRadioButtons,
  SimpleGuiHorizontalRadioButtons,
  SimpleGuiColorPicker,
  SimpleGuiListBox,
  SimpleGuiSlider,
  SimpleGuiVerticalSlider,
  SimpleGuiTextArea,
  SimpleGuiTextBox,
];
