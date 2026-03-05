export interface SVGExportOptions {
  type: 'svg';
  /**
   * 是否移除背景（SVG 背景样式 + 背景矩形）
   * @default false
   */
  removeBackground?: boolean;
  /**
   * 是否将远程资源嵌入到 SVG 中
   * @default true
   */
  embedResources?: boolean;
  /**
   * 是否移除 id 依赖（展开 <use> 并内联 defs 引用）
   * @default false
   */
  removeIds?: boolean;
}

export interface PNGExportOptions {
  type: 'png';
  /**
   * 是否移除背景（SVG 背景样式 + 背景矩形）
   * @default false
   */
  removeBackground?: boolean;
  /**
   * 设备像素比，默认为浏览器的 devicePixelRatio
   * @default globalThis.devicePixelRatio || 2
   */
  dpr?: number;
}

export type ExportOptions = SVGExportOptions | PNGExportOptions;
