import {loadSVGResource, registerResourceLoader} from '@antv/infographic';

const svgTextCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string | null>>();

registerResourceLoader(async (config) => {
  const {data, scene} = config;

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
        pendingRequests.delete(key);
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
