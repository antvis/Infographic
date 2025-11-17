import { JSXElement, JSXNode } from '../types';

export function isJSXElement(element: JSXNode): element is JSXElement {
  return (
    element !== null &&
    typeof element === 'object' &&
    !Array.isArray(element) &&
    'type' in element
  );
}
