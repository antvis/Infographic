import {
  formatHex,
  formatHex8,
  modeOklch,
  oklch,
  parse,
  useMode,
  wcagContrast,
  type Color,
} from 'culori';
import { ThemeColors, ThemeSeed } from './types';

useMode(modeOklch);

export const generateThemeColors = ({
  colorPrimary,
  colorBg = '#ffffff',
  isDarkMode = false,
}: ThemeSeed): ThemeColors => {
  const pc = parse(colorPrimary)!;
  const bg = parse(colorBg)!;
  const baseTheme = createBaseTheme({ primaryColor: pc, bgColor: bg });

  return addDerivedColors(baseTheme, {
    primaryColor: pc,
    bgColor: bg,
    isDarkMode,
  });
};

const generatePrimaryBg = (
  primaryColor: Color,
  isDarkMode: boolean,
): string => {
  return (
    formatHex8({ ...primaryColor, alpha: isDarkMode ? 0.2 : 0.1 }) || '#ffffff'
  );
};

const generateTextColor = (bgColor: Color, isDarkMode: boolean): string => {
  if (isDarkMode) {
    return '#ffffff';
  }
  const darkText = parse('#262626')!;
  const contrast = wcagContrast(darkText, bgColor);
  return contrast >= 7 ? formatHex(darkText) : '#000000';
};

const generateSecondaryTextColor = (colorText: string): string => {
  const parsed = oklch(parse(colorText)!);
  const lighter = { ...parsed, l: Math.min(1, parsed.l + 0.2) };
  return formatHex(lighter);
};

const generatePrimaryTextColor = (
  colorPrimaryBg: string,
  isDarkMode: boolean,
): string => {
  const bg = parse(colorPrimaryBg)!;
  const darkText = parse('#262626')!;
  const lightText = parse('#ffffff')!;

  const darkContrast = wcagContrast(darkText, bg);
  const lightContrast = wcagContrast(lightText, bg);

  // For primary color backgrounds, prefer light text if contrast is reasonable
  if (lightContrast >= 3.0) {
    return formatHex(lightText);
  }

  // Fall back to dark text only if light text contrast is too low
  if (darkContrast >= 4.5) {
    return formatHex(darkText);
  }

  // Default fallback
  return isDarkMode ? '#ffffff' : '#ffffff';
};

const generateElevatedBg = (bgColor: Color, isDarkMode: boolean): string => {
  const parsed = oklch(bgColor);

  if (isDarkMode) {
    const lightened = { ...parsed, l: Math.min(1, parsed.l + 0.1) };
    return safeFormatHex(lightened, '#1f1f1f');
  } else {
    if (parsed.l > 0.95) {
      return '#ffffff';
    } else {
      const lightened = { ...parsed, l: Math.min(1, parsed.l + 0.05) };
      return safeFormatHex(lightened, '#ffffff');
    }
  }
};

const createBaseTheme = ({
  primaryColor,
  bgColor,
}: {
  primaryColor: Color;
  bgColor: Color;
}) => ({
  colorPrimary: safeFormatHex(primaryColor, '#1677ff'),
  colorBg: safeFormatHex(bgColor, '#ffffff'),
  colorWhite: '#ffffff',
});

const addDerivedColors = (
  baseTheme: ReturnType<typeof createBaseTheme>,
  {
    primaryColor,
    bgColor,
    isDarkMode,
  }: { primaryColor: Color; bgColor: Color; isDarkMode: boolean },
): ThemeColors => {
  const textColor = generateTextColor(bgColor, isDarkMode);
  const colorPrimaryBg = generatePrimaryBg(primaryColor, isDarkMode);
  return {
    ...baseTheme,
    isDarkMode,
    colorPrimaryBg,
    colorText: textColor,
    colorTextSecondary: generateSecondaryTextColor(textColor),
    colorPrimaryText: generatePrimaryTextColor(colorPrimaryBg, isDarkMode),
    colorBgElevated: generateElevatedBg(bgColor, isDarkMode),
  };
};

function safeFormatHex(color: Color, fallback = '#000000'): string {
  return formatHex(color) ?? fallback;
}
