import { Flex, FlexProps, Heading, Span } from "@chakra-ui/react";
import { ComponentTemplates } from "./ComponentTemplates";
import MaterialIcon from "../util/MaterialIcon";

export default function LeftPanel({ ...props }: FlexProps) {
  return (
    <Flex flexDirection="column" {...props}>
      <Heading size="md" m={3} display="inline-flex" alignItems="center">
        <MaterialIcon marginX={1}>widgets</MaterialIcon>
        Components
      </Heading>
      <ComponentTemplates flex={1} minHeight={0} overflow="auto" />
    </Flex>
  );
}
