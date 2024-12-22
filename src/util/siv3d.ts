export function siv3dColorFtoRGB(...value: number[]) {
  switch (value.length) {
    case 1:
      return `rgb(${value[0] * 255}, ${value[0] * 255}, ${value[0] * 255})`;
    case 3:
      return `rgb(${value[0] * 255}, ${value[1] * 255}, ${value[2] * 255})`;
  }
  throw new Error("Invalid number of arguments");
}

// Reference: https://github.com/Siv3D/OpenSiv3D/blob/main/Siv3D/src/Siv3D/SimpleGUI/SivSimpleGUI.cpp
export const SimpleGuiOptions = {
  cellSize: 40,
  unitSize: 36,
  backgroundColor: "white",
  disabledBackgroundColor: siv3dColorFtoRGB(0.92),
  buttonMouseOverColor: siv3dColorFtoRGB(0.9, 0.95, 1.0),
  activeTextColor: siv3dColorFtoRGB(0.11),
  disabledTextColor: siv3dColorFtoRGB(0.67),
  frameColor: siv3dColorFtoRGB(0.67),
  sliderBaseColor: siv3dColorFtoRGB(0.33),
  sliderFillColor: siv3dColorFtoRGB(0.35, 0.7, 1.0),
  sliderDisabledBaseColor: siv3dColorFtoRGB(0.75),
  sliderDisabledFillColor: siv3dColorFtoRGB(0.75, 0.85, 1.0),
  checkBoxFillColor: siv3dColorFtoRGB(0.35, 0.7, 1.0),
  checkBoxHighlightedFillColor: siv3dColorFtoRGB(0.45, 0.8, 1.0),
  checkBoxBaseColor: siv3dColorFtoRGB(0.67),
  checkBoxDisabledBaseColor: siv3dColorFtoRGB(0.75),
  checkBoxDisabledFillColor: siv3dColorFtoRGB(0.75, 0.85, 1.0),
  checkBoxMouseOverColor: siv3dColorFtoRGB(0.9, 0.95, 1.0),
  radioButtonFillColor: siv3dColorFtoRGB(0.35, 0.7, 1.0),
  radioButtonBaseColor: siv3dColorFtoRGB(0.5),
  radioButtonDisabledBaseColor: siv3dColorFtoRGB(0.75),
  fontYOffset: -1,
  roundSize: 4.8,
  sliderBarRoundSize: 2.0,
  sliderMinLength: 40.0,
  checkBoxSize: 24,
  checkBoxPadding: 8,
  radioButtonSize: 19,
  radioButtonPadding: 8,
  textBoxHeight: 36,
  colorPickerSize: { width: 160, height: 116 },
  listBoxFrameThickness: 1,
  scrollBarWidth: 18,
  listBoxSelectedColor: siv3dColorFtoRGB(0.2, 0.4, 0.8),
  listBoxSelectedDisabledColor: siv3dColorFtoRGB(0.75, 0.85, 1.0),
  minTextBoxWidth: 40.0,
  minTextAreaHeight: 36.0,
  textAreaScrollBarWidth: 3.0,
  textAreaScrollBarMinHeight: 16.0,
  textAreaEditingTextBackgroundColor: siv3dColorFtoRGB(0.8),
  textAreaScrollBarColor: siv3dColorFtoRGB(0.67),
  candidateWindowColor: siv3dColorFtoRGB(0.98),
  candidateWindowFrameColor: siv3dColorFtoRGB(0.75),
  candidateSelectedBackgroundColor: siv3dColorFtoRGB(0.55, 0.85, 1.0),
  candidateTextColor: siv3dColorFtoRGB(0.11),
  candidateMinimapColor: siv3dColorFtoRGB(0.67),
  candidateMargin: 4.0,
  candidatePadding: 12.0,
  candidateMinimapWidth: 20.0,
};
