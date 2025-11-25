import { getViewBox } from '../utils';
import { exportToSVG } from './svg';
import { PNGExportOptions } from './types';

export async function exportToPNGString(
  svg: SVGSVGElement,
  options: Omit<PNGExportOptions, 'type'> = {},
): Promise<string> {
  const { dpr = globalThis.devicePixelRatio ?? 2 } = options;
  const node = await exportToSVG(svg);

  const { width, height } = getViewBox(node);

  return new Promise<string>((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 应用 DPR 缩放
      ctx.scale(dpr, dpr);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      node.setAttribute('width', String(width));
      node.setAttribute('height', String(height));

      const updatedSvgData = new XMLSerializer().serializeToString(node);
      const svgURL =
        'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(updatedSvgData);

      const img = new Image();
      img.onload = function () {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const pngURL = canvas.toDataURL('image/png');
        resolve(pngURL);
      };

      img.onerror = function (error) {
        reject(new Error('Image load failed: ' + error));
      };

      img.src = svgURL;
    } catch (error) {
      reject(error);
    }
  });
}
