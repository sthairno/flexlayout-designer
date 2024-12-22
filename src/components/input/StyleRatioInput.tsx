import { Input } from "@chakra-ui/react";
import { StyleProperties } from "../../util/styleProperties";
import { Field } from "../ui/field";

const pattern = /^(\+?\d*\.?\d+)(?: *\/ *(\+?\d*\.?\d+))?$/;

export function StyleRatioInput({
  property,
  state,
  setState,
  onBlur,
}: {
  property: string;
  state?: string | number;
  setState: (value?: string) => void;
  onBlur: (value?: string) => void;
}) {
  const data = StyleProperties[property];

  if (data.valueType !== "ratio") {
    throw new Error("Invalid property type");
  }

  switch (typeof state) {
    case "number":
      state = String(state);
      break;
    case "undefined":
      state = "";
      break;
  }

  return (
    <Field label={data.displayName} alignItems="stretch">
      <Input
        placeholder={data.defaultValue}
        value={typeof state === "number" ? String(state) : state}
        onChange={(e) => setState(e.target.value)}
        onBlur={(e) => {
          setState(undefined);

          const match = e.target.value.match(pattern);

          if (match) {
            let value = parseFloat(match[1]);
            if (match[2]) {
              value /= parseFloat(match[2]);
            }

            if (!isNaN(value) && isFinite(value) && value > 0) {
              onBlur(`${match[1]}/${match[2]}`);
              return;
            }
          }

          onBlur(undefined);
        }}
      />
    </Field>
  );
}
