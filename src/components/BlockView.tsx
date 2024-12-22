import { Box, Flex, FlexProps, Heading, Icon } from "@chakra-ui/react";
import { forwardRef } from "react";

interface BlockViewProps extends Omit<FlexProps, "children"> {
  icon: React.ReactNode;
  heading: string;
}

export const BlockView = forwardRef<HTMLDivElement, BlockViewProps>(
  ({ icon, heading, ...props }, ref) => {
    return (
      <Flex
        direction="column"
        alignItems="center"
        padding={3}
        gap={1}
        rounded="lg"
        shadow="md"
        backgroundColor="bg"
        borderWidth={1}
        borderColor="border.emphasized"
        ref={ref}
        {...props}
      >
        <Box
          fontSize="var(--chakra-sizes-10)"
          lineHeight="1rem"
          color="fg.muted"
        >
          {icon}
        </Box>
        <Heading size="sm" textAlign="center">
          {heading}
        </Heading>
      </Flex>
    );
  }
);
