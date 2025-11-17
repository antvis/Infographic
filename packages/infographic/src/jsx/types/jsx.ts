export interface JSXElement {
  type: string | symbol | ((props?: any) => JSXNode);
  props: Record<string, any>;
  key?: string | null;
}

export type JSXNode =
  | JSXElement
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXNode[];

export type RenderableNode = JSXElement | string | number;

export type JSXElementConstructor<P = {}> = (props: P) => JSXNode;

export type ComponentType<P = {}> = JSXElementConstructor<WithChildren<P>>;

export type WithChildren<T = {}> = T & {
  children?: JSXNode;
};
