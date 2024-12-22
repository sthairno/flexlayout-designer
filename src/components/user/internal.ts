import { BoxProps } from "@chakra-ui/react";
import { NodeStyleClassNames } from "../../config";

export const DefaultComponentViewProps: Partial<BoxProps> = {
  className: NodeStyleClassNames.base,
};

export interface UserComponentInfo {
  hasTextChild?: boolean;
}

export interface EditorComponentProps {
  nodeProps: Record<string, any>;
  setNodeProp: (key: string, value: any) => void;
}

export interface UserComponentRelated {
  editor?: React.ElementType<EditorComponentProps>;
}
