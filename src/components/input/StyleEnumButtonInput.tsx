import { ButtonProps, Group } from "@chakra-ui/react";
import { FlexDirection, StyleProperties } from "../../util/styleProperties";
import { Field } from "../ui/field";
import IconButtonWithTooltip from "../IconButtonWithTooltip";
import MaterialIcon from "../../util/MaterialIcon";

export function StyleEnumButtonInput({
  property,
  flexDirection,
  size,
  value,
  setValue,
}: {
  property: string;
  flexDirection?: FlexDirection;
  size: Pick<ButtonProps, "size">;
  value?: string;
  setValue: (value?: string) => void;
}) {
  const data = StyleProperties[property];

  if (data.valueType !== "enum") {
    throw new Error("Invalid property type");
  }

  const selectedValue = value && value in data.choices ? value : "none";

  return (
    <Field label={data.displayName} alignItems="stretch">
      <Group attached>
        <IconButtonWithTooltip
          content="None"
          flex={1}
          minWidth={0}
          variant={selectedValue === "none" ? "solid" : "outline"}
          size={size}
          onClick={() => setValue(undefined)}
        >
          <MaterialIcon>disabled_by_default</MaterialIcon>
        </IconButtonWithTooltip>
        {Object.entries(data.choices).map(([value, valueData]) => (
          <IconButtonWithTooltip
            key={value}
            content={valueData.displayName}
            flex={1}
            minWidth={0}
            variant={selectedValue === value ? "solid" : "outline"}
            size={size}
            onClick={() => setValue(value)}
          >
            {valueData.getIcon!(flexDirection ?? "row")}
          </IconButtonWithTooltip>
        ))}
      </Group>
    </Field>
  );
}
