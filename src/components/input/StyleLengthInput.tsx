import { Box, HTMLChakraProps, Input, InputProps } from "@chakra-ui/react";
import { StyleProperties } from "../../util/styleProperties";
import { parseLength } from "../../util/styleValue";
import { Field } from "../ui/field";
import { InputGroup } from "../ui/input-group";
import { useMemo } from "react";
import { NativeSelectField, NativeSelectRoot } from "../ui/native-select";

function LengthUnitSelector({
  value,
  units,
  onChange,
}: {
  value: string;
  units: string[];
  onChange: (value: string) => void;
}) {
  // 選択肢に含まれていない場合、正しく表示されないため仮の選択肢を追加
  if (!units.includes(value)) {
    units = [value, ...units];
  }

  return (
    <NativeSelectRoot size="xs" variant="plain" width="auto">
      <NativeSelectField
        value={value}
        items={units}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </NativeSelectRoot>
  );
}

interface StyleLengthInputInternalState {
  value: string;
  unit: string;
}

function stateToString(state: StyleLengthInputInternalState): string {
  return `${state.value}${state.unit}`;
}

export default function StyleLengthInput({
  property,
  state,
  size,
  showLabel,
  onStateChange,
  onValueChange,
  ...props
}: {
  property: string;
  state?: string | number | StyleLengthInputInternalState;
  showLabel?: boolean;
  onStateChange: (state: StyleLengthInputInternalState | undefined) => void;
  onValueChange: (value: string | undefined) => void;
} & HTMLChakraProps<"div"> &
  Pick<InputProps, "size">) {
  const data = StyleProperties[property];

  if (data.valueType !== "number") {
    throw new Error("Invalid property type");
  }

  const defaultState = useMemo(() => {
    const length = parseLength(data.defaultValue);
    return length
      ? { value: length.value.toString(), unit: length.unit }
      : { value: String(data.defaultValue), unit: "" };
  }, [data.defaultValue]);

  // 入力値を内部ステートへ変換
  switch (typeof state) {
    case "string":
    case "number":
      const length = parseLength(state);
      state = length
        ? { value: length.value.toString(), unit: length.unit }
        : { value: "", unit: "" };
      break;
    case "object":
      break;
    default:
      state = { value: "", unit: "" };
      break;
  }

  const onBlur = () => {
    if (state.value) {
      onValueChange(stateToString(state));
    } else {
      onValueChange(undefined);
    }
  };

  const input = (
    <InputGroup
      endElement={
        (data.units.length === 1 && data.units[0] === "") || (
          <LengthUnitSelector
            value={state.value ? state.unit : defaultState.unit}
            units={data.units}
            onChange={(unit) => {
              onStateChange(undefined);

              // valueが空だった場合は適当な小さい値を入れる
              if (!state.value) {
                let value = 0;
                if (data.min !== undefined) {
                  value = data.min;
                }
                if (data.max !== undefined) {
                  value = data.max;
                }
                state.value = value.toString();
              }

              state.unit = unit;

              onBlur();
            }}
          />
        )
      }
      endElementProps={{ paddingInline: 1 }}
    >
      <Input
        placeholder={defaultState.value}
        value={state.value}
        size={size}
        onChange={(e) => onStateChange({ ...state, value: e.target.value })}
        onAbort={() => onStateChange(undefined)}
        onBlur={(e) => {
          onStateChange(undefined);

          const parsed = parseLength(e.target.value);
          if (parsed) {
            // テキストボックスに単位が入力されていた場合、正しい値であれば更新
            if (parsed.unit && data.units.includes(parsed.unit)) {
              state.unit = parsed.unit;
            }

            // クランプ処理
            if (data.max !== undefined && parsed.value > data.max) {
              parsed.value = data.max;
            }
            if (data.min !== undefined && parsed.value < data.min) {
              parsed.value = data.min;
            }

            // 単位がない場合は適当な単位を設定する
            if (!data.units.includes(state.unit)) {
              state.unit = data.units[0];
            }

            state.value = parsed.value.toString();
          } else {
            // 不正なフォーマットの場合リセット
            state.value = "";
          }

          onBlur();
        }}
      />
    </InputGroup>
  );

  return showLabel === undefined || showLabel ? (
    <Field label={data.displayName} alignItems="stretch" {...props}>
      {input}
    </Field>
  ) : (
    <Box {...props}>{input}</Box>
  );
}
