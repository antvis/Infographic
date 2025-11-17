import type { ComponentType } from '../../jsx';
import { Group } from '../../jsx';

export interface Text3dProps {
  /**
   * Text content to display
   */
  text: string | number;
  /**
   * X position of the text
   * @default 0
   */
  x?: number;
  /**
   * Y position of the text
   * @default 0
   */
  y?: number;
  /**
   * Font size
   * @default 56
   */
  fontSize?: number;
  /**
   * Font weight
   * @default 'bold'
   */
  fontWeight?: string | number;
  /**
   * Text fill color
   * @default '#FFFFFF'
   */
  fill?: string;
  /**
   * Text anchor alignment
   * @default 'middle'
   */
  textAnchor?: 'start' | 'middle' | 'end';
  /**
   * Dominant baseline
   * @default 'middle'
   */
  dominantBaseline?:
    | 'auto'
    | 'middle'
    | 'hanging'
    | 'alphabetic'
    | 'ideographic'
    | 'mathematical'
    | 'central'
    | 'text-before-edge'
    | 'text-after-edge'
    | 'inherit'
    | 'use-script'
    | 'no-change'
    | 'reset-size';
  /**
   * Shadow offset X for the deepest layer
   * @default 2
   */
  shadowOffsetX?: number;
  /**
   * Shadow offset Y for the deepest layer
   * @default 4
   */
  shadowOffsetY?: number;
  /**
   * Mid-layer shadow offset X
   * @default 1
   */
  midShadowOffsetX?: number;
  /**
   * Mid-layer shadow offset Y
   * @default 2
   */
  midShadowOffsetY?: number;
  /**
   * Opacity of the deepest shadow layer
   * @default 0.3
   */
  deepShadowOpacity?: number;
  /**
   * Opacity of the mid shadow layer
   * @default 0.5
   */
  midShadowOpacity?: number;
}

/**
 * A 3D text component with layered shadows to create a depth effect
 *
 * The component renders three layers of text:
 * 1. Deep shadow layer (most offset, lowest opacity)
 * 2. Mid shadow layer (medium offset, medium opacity)
 * 3. Main text layer (no offset, full opacity)
 */
export const Text3d: ComponentType<Text3dProps> = ({
  text,
  x = 0,
  y = 0,
  fontSize = 56,
  fontWeight = 'bold',
  fill = '#FFFFFF',
  textAnchor = 'middle',
  dominantBaseline = 'middle',
  shadowOffsetX = 2,
  shadowOffsetY = 4,
  midShadowOffsetX = 1,
  midShadowOffsetY = 2,
  deepShadowOpacity = 0.3,
  midShadowOpacity = 0.5,
}) => {
  return (
    <Group>
      {/* Deep shadow layer */}
      <text
        x={x}
        y={y}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fill={fill}
        fillOpacity={deepShadowOpacity}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        transform={`translate(${shadowOffsetX}, ${shadowOffsetY})`}
      >
        {text}
      </text>
      {/* Mid shadow layer */}
      <text
        x={x}
        y={y}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fill={fill}
        fillOpacity={midShadowOpacity}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        transform={`translate(${midShadowOffsetX}, ${midShadowOffsetY})`}
      >
        {text}
      </text>
      {/* Main text layer */}
      <text
        x={x}
        y={y}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fill={fill}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
      >
        {text}
      </text>
    </Group>
  );
};
