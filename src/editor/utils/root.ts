export type OverlayContainer = HTMLElement | ShadowRoot;

function getConnectedRoot(node?: Node | null): Document | ShadowRoot {
  if (!node?.isConnected) return document;

  const root = node.getRootNode();
  return root instanceof ShadowRoot ? root : document;
}

export function getOverlayContainer(node?: Node | null): OverlayContainer {
  const root = getConnectedRoot(node);
  return root instanceof ShadowRoot ? root : document.body;
}

export function eventPathContains(event: Event, node: Node) {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
  if (path.length > 0) {
    return path.some(
      (current) =>
        current === node || (current instanceof Node && node.contains(current)),
    );
  }

  const target = event.target;
  return target instanceof Node && (target === node || node.contains(target));
}
