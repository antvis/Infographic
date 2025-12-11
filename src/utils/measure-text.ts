import { measureText as measure, registerFont } from 'measury';
import AlibabaPuHuiTi from 'measury/fonts/AlibabaPuHuiTi-Regular';
import { TextProps } from '../jsx';
import { DEFAULT_FONT } from '../renderer';

registerFont(AlibabaPuHuiTi);

export function measureText(
  text: string | number | undefined = '',
  attrs: TextProps,
): { width: number; height: number } {
  if (attrs.width && attrs.height) {
    return { width: attrs.width, height: attrs.height };
  }

  let width = 0;
  let height = 0;

  const {
    fontFamily = DEFAULT_FONT,
    fontSize = 14,
    fontWeight = 'normal',
    lineHeight = 1.4,
  } = attrs;

  const metrics = measure(text.toString(), {
    fontFamily,
    fontSize: +fontSize,
    fontWeight,
    lineHeight,
  });

  // 额外添加 1% 宽高
  width ||= Math.ceil(metrics.width * 1.01);
  height ||= Math.ceil(metrics.height * 1.01);

  return { width, height };
}
