/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping
 */
export type FontWeightName =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black'
  | 'extrablack';

export interface Font {
  font: string;
  name: string;
  /** 字体 CDN */
  fontWeight: {
    [keys in FontWeightName]?: string;
  };
}
