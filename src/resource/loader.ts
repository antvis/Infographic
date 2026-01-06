import type { ItemDatum } from '../types';
import { getOrCreateDefs } from '../utils';
import { getSvgLoadPromise, trackSvgLoadPromise } from './load-tracker';
import {
  loadImageBase64Resource,
  loadRemoteResource,
  loadSearchResource,
  loadSVGResource,
} from './loaders';
import { getCustomResourceLoader } from './registry';
import type { Resource, ResourceConfig, ResourceScene } from './types';
import { getResourceId, parseResourceConfig } from './utils';

async function getResource(
  scene: ResourceScene,
  config: string | ResourceConfig,
  datum?: ItemDatum,
): Promise<Resource | null> {
  const cfg = parseResourceConfig(config);
  if (!cfg) return null;
  cfg.scene ||= scene;
  const { source, data, format, encoding } = cfg;

  let resource: Resource | null = null;
  try {
    if (source === 'inline') {
      const isDataURI = data.startsWith('data:');
      if (format === 'svg' && encoding === 'raw') {
        resource = loadSVGResource(data);
      } else if (format === 'svg' && isDataURI) {
        resource = await loadImageBase64Resource(data);
      } else if (isDataURI || format === 'image') {
        resource = await loadImageBase64Resource(data);
      } else {
        resource = loadSVGResource(data);
      }
    } else if (source === 'remote') {
      resource = await loadRemoteResource(data, format);
    } else if (source === 'search') {
      resource = await loadSearchResource(data, format);
    } else {
      const customLoader = getCustomResourceLoader();
      if (customLoader) resource = await customLoader(cfg);
    }
  } catch {
    resource = null;
  }

  if (resource) return resource;

  return await loadSearchResource(getFallbackQuery(cfg, scene, datum), format);
}

const RESOURCE_MAP = new Map<string, Resource>();
const RESOURCE_LOAD_MAP = new WeakMap<SVGSVGElement, Map<string, SVGElement>>();

/**
 * load resource into svg defs
 * @returns resource ref id
 */
export async function loadResource(
  svg: SVGSVGElement | null,
  scene: ResourceScene,
  config: string | ResourceConfig,
  datum?: ItemDatum,
): Promise<string | null> {
  if (!svg) return null;
  const cfg = parseResourceConfig(config);
  if (!cfg) return null;
  const id = getResourceId(cfg)!;
  const promiseKey = `resource:${id}`;

  const loadedMap = RESOURCE_LOAD_MAP.get(svg);
  if (loadedMap?.has(id)) return id;

  const existingPromise = getSvgLoadPromise<string | null>(svg, promiseKey);
  if (existingPromise) return await existingPromise;

  const loadPromise = (async () => {
    const resource = RESOURCE_MAP.has(id)
      ? RESOURCE_MAP.get(id) || null
      : await getResource(scene, cfg, datum);

    if (!resource) return null;

    if (!RESOURCE_LOAD_MAP.has(svg)) RESOURCE_LOAD_MAP.set(svg, new Map());
    const map = RESOURCE_LOAD_MAP.get(svg)!;
    if (map.has(id)) return id;

    const defs = getOrCreateDefs(svg);
    resource.id = id;
    defs.appendChild(resource);
    map.set(id, resource);

    return id;
  })();
  trackSvgLoadPromise(svg, promiseKey, loadPromise);

  return await loadPromise;
}

export { getSvgLoadPromises, waitForSvgLoads } from './load-tracker';

function getFallbackQuery(
  cfg: ResourceConfig,
  scene: ResourceScene,
  datum?: ItemDatum,
): string {
  const defaultQuery = scene === 'illus' ? 'illustration' : 'icon';
  const datumQuery =
    normalizeQuery(datum?.label) || normalizeQuery(datum?.desc);
  if (datumQuery) return datumQuery;

  const data = normalizeQuery(cfg.data);
  if (!data) return defaultQuery;
  if (cfg.source === 'inline') return defaultQuery;
  if (data.startsWith('data:')) return defaultQuery;
  if (data.startsWith('<svg') || data.startsWith('<symbol'))
    return defaultQuery;
  return data;
}

function normalizeQuery(value?: string): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
