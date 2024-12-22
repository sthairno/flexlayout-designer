import { Accordion, HStack } from "@chakra-ui/react";
import { forwardRef } from "react";
import MaterialIcon from "../../util/MaterialIcon";

interface AccordionItemTriggerProps extends Accordion.ItemTriggerProps {
  indicatorPlacement?: "start" | "end";
}

export const AccordionItemTrigger = forwardRef<
  HTMLButtonElement,
  AccordionItemTriggerProps
>(function AccordionItemTrigger(props, ref) {
  const { children, indicatorPlacement = "end", ...rest } = props;
  return (
    <Accordion.ItemTrigger {...rest} ref={ref}>
      {indicatorPlacement === "start" && (
        <Accordion.ItemIndicator display="flex" alignItems="center">
          <MaterialIcon>keyboard_arrow_down</MaterialIcon>
        </Accordion.ItemIndicator>
      )}
      <HStack gap="4" flex="1" textAlign="start" width="full">
        {children}
      </HStack>
      {indicatorPlacement === "end" && (
        <Accordion.ItemIndicator display="flex" alignItems="center">
          <MaterialIcon>keyboard_arrow_down</MaterialIcon>
        </Accordion.ItemIndicator>
      )}
    </Accordion.ItemTrigger>
  );
});

interface AccordionItemContentProps extends Accordion.ItemContentProps {}

export const AccordionItemContent = forwardRef<
  HTMLDivElement,
  AccordionItemContentProps
>(function AccordionItemContent(props, ref) {
  return (
    <Accordion.ItemContent>
      <Accordion.ItemBody {...props} ref={ref} />
    </Accordion.ItemContent>
  );
});

export const AccordionRoot = Accordion.Root;
export const AccordionItem = Accordion.Item;
