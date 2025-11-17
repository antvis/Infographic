export type StylizeConfig = RoughConfig | PatternConfig | GradientConfig;

export interface RoughConfig {
  type: 'rough';
  roughness?: number;
  bowing?: number;
  fillWeight?: number;
  hachureGap?: number;
}

export interface PatternConfig extends PatternStyle {
  type: 'pattern';
  pattern: string;
}

export interface PatternStyle {
  backgroundColor?: string | null;
  foregroundColor?: string | null;
  scale?: number | null;
}

export interface PatternGenerator {
  (style: PatternStyle): SVGElement;
}

export type GradientConfig = LinearGradient | RadialGradient;

export interface LinearGradient {
  type: 'linear-gradient';
  colors?: string[] | { color: string; offset: string }[];
  /**
   * 颜色角度
   *          270
   *   180 <-  ·  -> 0
   *          90
   */
  angle?: number;
}

export interface RadialGradient {
  type: 'radial-gradient';
  colors?: string[] | { color: string; offset: string }[];
}
