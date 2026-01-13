let _isBrowser: boolean | undefined;

export function isBrowser(): boolean {
  if (_isBrowser !== undefined) {
    return _isBrowser;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    _isBrowser = false;
    return false;
  }

  const body = document.body;
  if (!body) {
    _isBrowser = false;
    return false;
  }

  let hasRealLayout = false;
  try {
    const el = document.createElement('div');
    el.style.cssText = `
      position: absolute;
      left: 11px;
      top: 13px;
      width: 37px;
      height: 19px;
      padding: 0;
      margin: 0;
      border: 0;
      visibility: hidden;
    `;
    body.appendChild(el);

    void el.offsetHeight;

    const rect = el.getBoundingClientRect();
    body.removeChild(el);

    hasRealLayout =
      rect.width === 37 &&
      rect.height === 19 &&
      rect.left !== 0 &&
      rect.top !== 0;
  } catch {
    hasRealLayout = false;
  }

  if (!hasRealLayout) {
    _isBrowser = false;
    return false;
  }

  let hasRealCanvas = false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 50;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      _isBrowser = false;
      return false;
    }

    ctx.font = '20px sans-serif';
    const metrics = ctx.measureText('Hello');

    hasRealCanvas =
      typeof metrics.width === 'number' &&
      metrics.width > 0 &&
      metrics.width < 1000;
  } catch {
    hasRealCanvas = false;
  }

  _isBrowser = hasRealCanvas;
  return hasRealCanvas;
}
