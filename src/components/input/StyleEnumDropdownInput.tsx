import { NativeSelectRootProps } from "@chakra-ui/react";
import { StyleProperties } from "../../util/styleProperties";
import { NativeSelectField, NativeSelectRoot } from "../ui/native-select";

export function StyleEnumDropdownInput({
  property,
  size,
  value,
  setValue,
}: {
  property: string;
  size: Pick<NativeSelectRootProps, "size">;
  value?: string;
  setValue: (value?: string) => void;
}) {
  const data = StyleProperties[property];

  if (data.valueType !== "enum") {
    throw new Error("Invalid property type");
  }

  return (
    <NativeSelectRoot size={size}>
      <NativeSelectField
        placeholder="---"
        items={Object.entries(data.choices).map(([value, valueData]) => ({
          value,
          label: valueData.displayName,
        }))}
        value={value ?? data.defaultValue}
        onChange={(e) => setValue(e.currentTarget.value || undefined)}
      />
    </NativeSelectRoot>
  );
}
