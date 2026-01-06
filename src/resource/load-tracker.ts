type SvgLoadPromise = Promise<unknown>;

const SVG_LOAD_PROMISE_MAP = new WeakMap<
  SVGSVGElement,
  Map<string, SvgLoadPromise>
>();

export function getSvgLoadPromises(svg: SVGSVGElement): SvgLoadPromise[] {
  const map = SVG_LOAD_PROMISE_MAP.get(svg);
  return map ? Array.from(map.values()) : [];
}

export function getSvgLoadPromise<T = unknown>(
  svg: SVGSVGElement,
  key: string,
): Promise<T> | undefined {
  return SVG_LOAD_PROMISE_MAP.get(svg)?.get(key) as Promise<T> | undefined;
}

export function trackSvgLoadPromise<T>(
  svg: SVGSVGElement,
  key: string,
  promise: Promise<T>,
): Promise<T> {
  let map = SVG_LOAD_PROMISE_MAP.get(svg);
  if (!map) {
    map = new Map();
    SVG_LOAD_PROMISE_MAP.set(svg, map);
  }

  map.set(key, promise as SvgLoadPromise);

  promise.finally(() => {
    const map = SVG_LOAD_PROMISE_MAP.get(svg);
    if (!map) return;
    if (map.get(key) === promise) map.delete(key);
    if (map.size === 0) SVG_LOAD_PROMISE_MAP.delete(svg);
  });

  return promise;
}

export async function waitForSvgLoads(svg: SVGSVGElement): Promise<void> {
  await Promise.resolve();
  while (true) {
    const promises = getSvgLoadPromises(svg);
    if (!promises.length) break;
    await Promise.allSettled(promises);
    await Promise.resolve();
  }
}
