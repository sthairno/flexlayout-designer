import {
  Box,
  Button,
  Editable,
  Group,
  HStack,
  IconButton,
  Span,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./ui/menu";
import { Switch } from "./ui/switch";
import { useEffect, useState } from "react";
import ShareButton from "./ShareButton";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  autoSaveAvailableAtom,
  dirtyFlagAtom,
  enableAutoSaveAtom,
  projectNameAtom,
  useFlexLayoutFileAction,
} from "./DesignerStateProvider";
import MaterialIcon from "../util/MaterialIcon";

const buttonSize = "sm";
const fileNameTextSize = "lg";

export function Header(props: StackProps) {
  const [projectName, setProjectName] = useAtom(projectNameAtom);
  const isDirty = useAtomValue(dirtyFlagAtom);
  const isAutoSaveAvailable = useAtomValue(autoSaveAvailableAtom);
  const [enableAutoSave, setEnableAutoSave] = useAtom(enableAutoSaveAtom);
  const { importProjectFromFile, exportProjectToFile } =
    useFlexLayoutFileAction();

  const [temporaryProjectName, setTemporaryProjectName] = useState(projectName);
  useEffect(() => {
    setTemporaryProjectName(projectName);
  }, [projectName]);

  return (
    <HStack
      id="header"
      padding={4}
      borderWidth={1}
      bgColor="bg.subtle"
      border="border.subtle"
      zIndex="docked"
      shadow="md"
      {...props}
    >
      <Editable.Root
        value={temporaryProjectName}
        onValueChange={(e: { value: string }) =>
          setTemporaryProjectName(e.value)
        }
        onValueRevert={() => setTemporaryProjectName(projectName)}
        onValueCommit={(e: { value: string }) => setProjectName(e.value)}
        placeholder="Layout Name"
        maxLength={100}
        minWidth={0}
      >
        <Editable.Preview
          fontSize={fileNameTextSize}
          fontWeight="semibold"
          truncate
        >
          {temporaryProjectName}
          {isDirty && (
            <MaterialIcon fontSize="sm" margin={1}>
              edit
            </MaterialIcon>
          )}
        </Editable.Preview>
        <Editable.Input fontSize={fileNameTextSize} />
      </Editable.Root>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={importProjectFromFile}
      >
        <MaterialIcon>upload</MaterialIcon>
        Import File
      </Button>
      <MenuRoot>
        <Group
          attached={isAutoSaveAvailable}
          colorPalette={enableAutoSave ? "autoSave" : undefined}
        >
          <Button
            variant={enableAutoSave ? "surface" : "outline"}
            size={buttonSize}
            onClick={exportProjectToFile}
          >
            <MaterialIcon>save</MaterialIcon>
            {enableAutoSave ? "Auto Save: ON" : "Save File"}
          </Button>
          {isAutoSaveAvailable && (
            <MenuTrigger asChild>
              <IconButton
                variant={enableAutoSave ? "surface" : "outline"}
                size={buttonSize}
              >
                <MaterialIcon>more_horiz</MaterialIcon>
              </IconButton>
            </MenuTrigger>
          )}
        </Group>
        <MenuContent colorPalette={enableAutoSave ? "autoSave" : undefined}>
          <MenuItem value="auto-save" closeOnSelect={false}>
            <Switch
              size="sm"
              rounded="sm"
              bg={enableAutoSave ? "autoSave.subtle" : undefined}
              p={2}
              checked={enableAutoSave}
              onCheckedChange={(e: { checked: boolean }) =>
                setEnableAutoSave(e.checked)
              }
            >
              <Text color="autoSave.fg" fontWeight="bold">
                Auto Save
              </Text>
            </Switch>
          </MenuItem>
        </MenuContent>
      </MenuRoot>
      <ShareButton size={buttonSize} />
    </HStack>
  );
}
