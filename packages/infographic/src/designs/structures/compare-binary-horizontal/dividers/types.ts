import type { ComponentType } from '../../../../jsx';

export interface DividerProps {
  x: number;
  y: number;
  colorPrimary: string;
  colorPositive: string;
  colorNegative: string;
  colorBg: string;
}

const dividerRegistry = new Map<string, ComponentType<DividerProps>>();

export const registerDivider = (
  type: string,
  component: ComponentType<DividerProps>,
) => {
  dividerRegistry.set(type, component);
};

export const getDividerComponent = (
  type?: string,
): ComponentType<DividerProps> | null => {
  if (!type) return null;
  return dividerRegistry.get(type) ?? null;
};
