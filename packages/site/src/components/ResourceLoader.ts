import { loadSVGResource, registerResourceLoader } from '@antv/infographic';

// 缓存 SVG 文本而不是 DOM 元素
const svgTextCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string>>();

registerResourceLoader(async (config) => {
  const { data } = config;
  const [type, id] = data.split(':');
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

      const text = await fetch(url).then((res) => {
        if (!res.ok) throw new Error(`Failed to load: ${url}`);
        return res.text();
      });

      // 缓存文本
      svgTextCache.set(key, text);
      return text;
    })();

    pendingRequests.set(key, fetchPromise);

    try {
      svgText = await fetchPromise;
    } finally {
      pendingRequests.delete(key);
    }
  }

  return loadSVGResource(svgText);
});
