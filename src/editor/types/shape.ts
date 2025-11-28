import { ShapeTypeEnum } from '../../constants';
import type { TextAttributes } from '../../types';

export type ID = string;

interface BaseShapeProps {
  attributes: Record<string, any>;
}

export interface GeometryProps extends BaseShapeProps {
  type:
    | ShapeTypeEnum.Rectangle
    | ShapeTypeEnum.Circle
    | ShapeTypeEnum.Ellipse
    | ShapeTypeEnum.Line
    | ShapeTypeEnum.Polyline
    | ShapeTypeEnum.Polygon
    | ShapeTypeEnum.Path
    | ShapeTypeEnum.Image;
}

export interface TextProps extends BaseShapeProps {
  type: ShapeTypeEnum.Text;
  textContent: string;
  attributes: TextAttributes;
}

export interface GroupProps extends BaseShapeProps {
  type: ShapeTypeEnum.Group;
  children: ID[];
}

export type ShapeProps = GeometryProps | TextProps;

export type DocumentElement = {
  id: ID;
  data: ShapeProps;
};

export type DocumentSnapshot = {
  elements: Record<ID, ShapeProps>;
};

export type Vector2D = {
  x: number;
  y: number;
};
