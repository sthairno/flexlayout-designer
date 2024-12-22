import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { Tooltip, TooltipProps } from "./ui/tooltip";

export default function IconButtonWithTooltip({
  showArrow,
  disabled,
  portalled,
  content,
  contentProps,
  ...btnProps
}: Pick<
  TooltipProps,
  "showArrow" | "disabled" | "portalled" | "content" | "contentProps"
> &
  Omit<
    IconButtonProps,
    "showArrow" | "disabled" | "portalled" | "content" | "contentProps"
  >) {
  return (
    <Tooltip
      showArrow={showArrow}
      disabled={disabled}
      portalled={portalled}
      content={content}
      contentProps={contentProps}
    >
      <IconButton disabled={disabled} {...btnProps} />
    </Tooltip>
  );
}
