import {loadSVGResource, registerResourceLoader} from '@antv/infographic';

// 缓存 SVG 文本而不是 DOM 元素
const svgTextCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string>>();

registerResourceLoader(async (config) => {
  const {data} = config;

  try {
    const [type, id] = data.split(':');

    // 验证数据格式
    if (!type || !id) {
      console.error(`Invalid resource data format: ${data}`);
      return null;
    }

    const key = `${type}:${id}`;
    let svgText: string;

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
        let url: string;

        if (type === 'icon') {
          url = `https://api.iconify.design/${id}.svg`;
        } else if (type === 'illus') {
          url = `https://raw.githubusercontent.com/balazser/undraw-svg-collection/refs/heads/main/svgs/${id}.svg`;
        } else {
          throw new Error(`Unknown resource type: ${type}`);
        }

        try {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to load ${url}`);
          }

          const text = await response.text();

          if (!text || !text.trim().startsWith('<svg')) {
            throw new Error(`Invalid SVG content from ${url}`);
          }

          svgTextCache.set(key, text);
          return text;
        } catch (fetchError) {
          console.error(`Failed to fetch resource ${key}:`, fetchError);
          throw fetchError;
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
