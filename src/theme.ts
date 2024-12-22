import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    semanticTokens: {
      colors: {
        autoSave: {
          contrast: {
            value: "{colors.blue.contrast}",
          },
          fg: {
            value: "{colors.green.fg}",
          },
          subtle: {
            value: "{colors.green.subtle}",
          },
          muted: {
            value: "{colors.green.muted}",
          },
          emphasized: {
            value: "{colors.green.emphasized}",
          },
          solid: {
            value: "{colors.green.solid}",
          },
          focusRing: {
            value: "{colors.green.focusRing}",
          },
        },
      },
    },
  },
  globalCss: {
    html: {
      colorPalette: "cyan", // ここで希望するカラーパレットを指定
    },
  },
});
