import { parseSVG, traverse } from '../../utils';

function isSVGResource(resource: string): boolean {
  const trimmedResource = resource.trim();
  return (
    /^(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(trimmedResource) ||
    trimmedResource.startsWith('<symbol')
  );
}

// 可执行脚本、嵌入外部内容或通过 SMIL 篡改属性的标签，整体移除
const BLOCKED_TAGS = new Set([
  'script',
  'foreignobject',
  'iframe',
  'object',
  'embed',
  'handler',
  'listener',
  'set',
  'animate',
  'animatetransform',
  'animatemotion',
  'discard',
]);

// 可能携带可执行协议的 URL 属性
const URL_ATTRS = new Set(['href', 'xlink:href']);
const UNSAFE_PROTOCOLS = ['javascript:', 'vbscript:'];

function sanitize(node: SVGElement) {
  traverse(node, (element) => {
    if (BLOCKED_TAGS.has(element.tagName.toLowerCase())) {
      element.remove();
      return false;
    }

    Array.from(element.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on')) {
        element.removeAttribute(attr.name);
        return;
      }

      if (URL_ATTRS.has(name)) {
        const value = attr.value.replace(/\s/g, '').toLowerCase();
        if (UNSAFE_PROTOCOLS.some((protocol) => value.startsWith(protocol))) {
          element.removeAttribute(attr.name);
        }
      }
    });
  });
}

export function loadSVGResource(data: string) {
  if (!data || !isSVGResource(data)) return null;
  const str = data
    .replace(/<svg(?=[\s/>])/i, '<symbol')
    .replace(/<\/svg>/i, '</symbol>');
  const node = parseSVG(str);
  if (node) sanitize(node);
  return node;
}
