import type { JSXElement } from '../types';

export const cloneElement = (element: JSXElement, props?: any): JSXElement => {
  const { type, props: originalProps, ...rest } = element;
  return { type, props: { ...originalProps, ...props }, ...rest };
};
