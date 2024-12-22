interface ComponentTemplate {
  id: string;
  displayName: string;
  icon: React.ReactNode;
  node: React.ReactElement;
}

interface ComponentTemplateGroup {
  id: string;
  displayName: string;
  items: ComponentTemplate[];
}
