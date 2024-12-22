import { Button } from "@chakra-ui/react";
import { Tooltip } from "./ui/tooltip";
import { useState } from "react";
import MaterialIcon from "../util/MaterialIcon";
import { usePermalinkAction } from "./DesignerStateProvider";

interface ShareButtonProps {
  size: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
}

export default function ShareButton({ size }: ShareButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const { createPermalinkAsync } = usePermalinkAction();

  return (
    <Tooltip
      showArrow
      content={tooltipContent}
      open={showTooltip}
      onOpenChange={({ open }: { open: boolean }) =>
        !open && setShowTooltip(open)
      }
      closeDelay={2000}
    >
      <Button
        variant="solid"
        size={size}
        onClick={async () => {
          const result = await createPermalinkAsync();
          if (result.clipboard) {
            setTooltipContent("Copied to clipboard!");
          } else {
            setTooltipContent("Permalink created to address bar!");
          }
          setShowTooltip(true);
        }}
      >
        <MaterialIcon>link</MaterialIcon>
        Share
      </Button>
    </Tooltip>
  );
}
