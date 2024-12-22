import {
  Flex,
  FlexProps,
  HTMLChakraProps,
  StackProps,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { Layers } from "@craftjs/layers";
import { useEffect, useState } from "react";
import MaterialIcon from "../util/MaterialIcon";
import { PropertyEditor } from "./PropertyEditor";
import { useEditor } from "@craftjs/core";

export default function RightPanel(props: HTMLChakraProps<"div">) {
  const { hasSelectedNode } = useEditor((_state, query) => ({
    hasSelectedNode: query.getEvent("selected").size() > 0,
  }));
  const [tab, setTab] = useState("layers");

  useEffect(() => {
    if (!hasSelectedNode) {
      setTab("layers");
    }
  }, [hasSelectedNode]);

  return (
    <Tabs.Root
      variant="line"
      value={tab}
      onValueChange={(e: any) => setTab(e.value)}
      fitted
      asChild
      {...props}
    >
      <Flex flexDirection="column">
        <Tabs.List>
          <Tabs.Trigger value="layers" alignItems="center">
            <MaterialIcon>account_tree</MaterialIcon>
            Layers
          </Tabs.Trigger>
          <Tabs.Trigger value="properties" alignItems="center">
            <MaterialIcon>design_services</MaterialIcon>
            Properties
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="layers" overflow="auto" paddingY={1}>
          <Layers expandRootOnLoad />
        </Tabs.Content>
        <Tabs.Content value="properties" overflow="auto" paddingY={1}>
          <PropertyEditor />
        </Tabs.Content>
      </Flex>
    </Tabs.Root>
  );
}
