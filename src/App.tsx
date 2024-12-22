import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Header } from "./components/Header";
import { DesignSpace } from "./components/DesignSpace";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import DesignerStateProvider from "./components/DesignerStateProvider";
import TopPanel from "./components/TopPanel";
import { system } from "./theme";

function App() {
  return (
    <ChakraProvider value={system}>
      <DesignerStateProvider>
        <Flex direction="column" width="100%" height="100vh">
          <Header />
          <Flex flex={1} minHeight={0}>
            <LeftPanel w={250} />
            <Flex
              overflow="hidden"
              direction="column"
              borderWidth={2}
              borderColor="border.emphasized"
              flex={1}
              minW={0}
            >
              <TopPanel />
              <DesignSpace flex={1} minH={0} />
            </Flex>
            <RightPanel w={260} />
          </Flex>
        </Flex>
      </DesignerStateProvider>
    </ChakraProvider>
  );
}

export default App;
