import { getOrCreateDefs } from '../utils';
import {
  loadImageBase64Resource,
  loadRemoteResource,
  loadSVGResource,
} from './loaders';
import { getCustomResourceLoader } from './registry';
import type { Resource, ResourceConfig } from './types';
import { getResourceId, parseResourceConfig } from './utils';

async function getResource(
  config: string | ResourceConfig,
): Promise<Resource | null> {
  const cfg = parseResourceConfig(config);
  if (!cfg) return null;
  const { type, data } = cfg;

  if (type === 'image') {
    return await loadImageBase64Resource(data);
  } else if (type === 'svg') {
    return loadSVGResource(data);
  } else if (type === 'remote') {
    return await loadRemoteResource(data);
  } else {
    const customLoader = getCustomResourceLoader();
    if (customLoader) return await customLoader(cfg);
  }

  return null;
}

const RESOURCE_MAP = new Map<string, Resource>();
const RESOURCE_LOAD_MAP = new WeakMap<SVGSVGElement, Map<string, SVGElement>>();

/**
 * load resource into svg defs
 * @returns resource ref id
 */
export async function loadResource(
  svg: SVGSVGElement | null,
  config: string | ResourceConfig,
): Promise<string | null> {
  if (!svg) return null;
  const cfg = parseResourceConfig(config);
  if (!cfg) return null;
  const id = getResourceId(cfg)!;

  const resource = RESOURCE_MAP.has(id)
    ? RESOURCE_MAP.get(id) || null
    : await getResource(cfg);

  if (!resource) return null;

  if (!RESOURCE_LOAD_MAP.has(svg)) RESOURCE_LOAD_MAP.set(svg, new Map());
  const map = RESOURCE_LOAD_MAP.get(svg)!;
  if (map.has(id)) return id;

  const defs = getOrCreateDefs(svg);
  resource.id = id;
  defs.appendChild(resource);
  map.set(id, resource);

  return id;
}
