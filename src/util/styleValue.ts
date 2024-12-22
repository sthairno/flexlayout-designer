export function parseLength(value: string | number): {
  value: number;
  unit: string;
} | null {
  if (typeof value === "number") {
    return { value, unit: "" };
  }
  const match = value.match(/^([+-]?\d*\.?\d+)(\w*|%)$/);
  if (!match) {
    return null;
  }
  return { value: parseFloat(match[1]), unit: match[2] };
}
