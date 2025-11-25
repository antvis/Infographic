export function getViewBox(svg: SVGSVGElement) {
  const viewBox = svg.getAttribute('viewBox');
  if (viewBox) {
    const [x, y, width, height] = viewBox.split(' ').map(Number);
    return { x, y, width, height };
  }
  const widthStr = svg.getAttribute('width');
  const heightStr = svg.getAttribute('height');
  const width = Number(widthStr) || 0;
  const height = Number(heightStr) || 0;
  return { x: 0, y: 0, width, height };
}
