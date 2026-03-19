type StyleTarget = Document | ShadowRoot | Node | null | undefined;

function resolveStyleRoot(target?: StyleTarget): Document | ShadowRoot {
  if (!target) return document;
  if (target instanceof Document || target instanceof ShadowRoot) return target;
  if (!target.isConnected) return document;

  const root = target.getRootNode();
  return root instanceof ShadowRoot ? root : document;
}

function hasStyle(root: Document | ShadowRoot, id: string) {
  if (root instanceof Document) return Boolean(root.getElementById(id));
  return Boolean(root.querySelector(`#${id}`));
}

export function injectStyleOnce(
  id: string,
  styles: string,
  target?: StyleTarget,
) {
  const root = resolveStyleRoot(target);
  if (hasStyle(root, id)) return;

  const doc = root instanceof Document ? root : (root.ownerDocument ?? document);
  const style = doc.createElement('style');
  style.id = id;
  style.textContent = styles;

  if (root instanceof Document) {
    root.head.appendChild(style);
  } else {
    root.appendChild(style);
  }
}
