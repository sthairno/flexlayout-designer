import { Span, SpanProps } from "@chakra-ui/react";

export default function MaterialIcon({
  children,
  ...props
}: { children: string } & SpanProps) {
  return (
    <Span className="material-symbols-rounded" fontSize="1.2em" {...props}>
      {children}
    </Span>
  );
}
