import { parseSVG } from '../../utils';

function isSVGResource(resource: string): boolean {
  const trimmedResource = resource.trim();
  return (
    /^(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(trimmedResource) ||
    trimmedResource.startsWith('<symbol')
  );
}

export function loadSVGResource(data: string) {
  if (!data || !isSVGResource(data)) return null;
  const str = data
    .replace(/<svg(?=[\s/>])/i, '<symbol')
    .replace(/<\/svg>/i, '</symbol>');
  return parseSVG(str);
}
