import type { InfographicOptions } from '@antv/infographic';
import {
  loadSVGResource,
  registerResourceLoader,
  Infographic as Renderer,
} from '@antv/infographic';
import { useEffect, useRef } from 'react';

const svgTextCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string | null>>();

registerResourceLoader(async (config) => {
  const { data, scene } = config;

  try {
    const key = `${scene}::${data}`;
    let svgText: string | null;

    // 1. 命中缓存
    if (svgTextCache.has(key)) {
      svgText = svgTextCache.get(key)!;
    }
    // 2. 已有请求在进行中
    else if (pendingRequests.has(key)) {
      svgText = await pendingRequests.get(key)!;
    }
    // 3. 发起新请求
    else {
      const fetchPromise = (async () => {
        try {
          let url: string | null;

          if (scene === 'icon') {
            url = `https://api.iconify.design/${data}.svg`;
          } else if (scene === 'illus') {
            url = `https://raw.githubusercontent.com/balazser/undraw-svg-collection/refs/heads/main/svgs/${data}.svg`;
          } else return null;

          if (!url) return null;

          const response = await fetch(url);

          if (!response.ok) {
            console.error(`HTTP ${response.status}: Failed to load ${url}`);
            return null;
          }

          const text = await response.text();

          if (!text || !text.trim().startsWith('<svg')) {
            console.error(`Invalid SVG content from ${url}`);
            return null;
          }

          svgTextCache.set(key, text);
          return text;
        } catch (fetchError) {
          console.error(`Failed to fetch resource ${key}:`, fetchError);
          return null;
        }
      })();

      pendingRequests.set(key, fetchPromise);

      try {
        svgText = await fetchPromise;
      } catch (error) {
        console.error(`Error loading resource ${key}:`, error);
        return null;
      } finally {
        pendingRequests.delete(key);
      }
    }

    if (!svgText) {
      return null;
    }

    const resource = loadSVGResource(svgText);

    if (!resource) {
      console.error(`loadSVGResource returned null for ${key}`);
      svgTextCache.delete(key);
      return null;
    }

    return resource;
  } catch (error) {
    console.error('Unexpected error in resource loader:', error);
    return null;
  }
});

export const Infographic = ({
  options,
  init,
  onError,
}: {
  options: string | InfographicOptions;
  init?: Partial<InfographicOptions>;
  onError?: (error: Error | null) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Renderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (instanceRef.current) return;

    const instance = new Renderer({
      container: containerRef.current,
      svg: {
        attributes: {
          width: '100%',
          height: '100%',
        },
        style: {
          maxHeight: '80vh',
        },
      },
      ...init,
    });
    instanceRef.current = instance;
    Object.assign(window, { infographic: instance });

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, [init]);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance || !options) return;

    try {
      onError?.(null);
      instance.render(options);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Dev Infographic render error', error);
      onError?.(error);
    }
  }, [options, onError]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};
