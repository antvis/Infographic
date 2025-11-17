import type { JSXNode } from './jsx';
import { Point } from './point';
import { SVGAttributes } from './svg';

export interface BaseGeometryProps
  extends Omit<SVGAttributes<SVGElement>, 'children'> {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  [key: `data-${string}`]: any;
}

export interface FragmentProps {
  children?: JSXNode;
}
export interface SVGProps extends BaseGeometryProps {
  children?: JSXNode;
}
export interface DefsProps {
  children?: JSXNode;
}
export interface GroupProps extends BaseGeometryProps {
  children?: JSXNode;
}
export interface RectProps extends BaseGeometryProps {}
export interface EllipseProps extends BaseGeometryProps {}
export interface TextProps extends BaseGeometryProps {
  lineHeight?: number;
  wordWrap?: boolean;
  alignHorizontal?: 'left' | 'center' | 'right';
  alignVertical?: 'top' | 'middle' | 'bottom';
  backgroundColor?: string;
  backgroundOpacity?: number;
  backgroundRadius?: number;
  children?: string | number;
}
export interface PathProps extends BaseGeometryProps {}
export interface PolygonProps extends Omit<BaseGeometryProps, 'points'> {
  points?: Point[];
}
