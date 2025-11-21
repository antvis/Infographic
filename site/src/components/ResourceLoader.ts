import {loadSVGResource, registerResourceLoader} from '@antv/infographic';

// 缓存 SVG 文本而不是 DOM 元素
const svgTextCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string | null>>();

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
        let url: string;

        if (type === 'icon') {
          url = `https://api.iconify.design/${id}.svg`;
        } else if (type === 'illus') {
          url = `https://raw.githubusercontent.com/balazser/undraw-svg-collection/refs/heads/main/svgs/${id}.svg`;
        } else {
          return null;
        }

        try {
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
