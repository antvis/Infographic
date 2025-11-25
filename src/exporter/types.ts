export interface SVGExportOptions {
  type: 'svg';
  /**
   * 是否将远程资源嵌入到 SVG 中
   * @default true
   */
  embedResources?: boolean;
}

export interface PNGExportOptions {
  type: 'png';
  /**
   * 设备像素比，默认为浏览器的 devicePixelRatio
   * @default globalThis.devicePixelRatio || 2
   */
  dpr?: number;
}

export type ExportOptions = SVGExportOptions | PNGExportOptions;
