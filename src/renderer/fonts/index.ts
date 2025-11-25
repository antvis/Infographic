export { getFontURLs, getWoff2BaseURL, loadFont, loadFonts } from './loader';
export {
  DEFAULT_FONT,
  getFont,
  getFonts,
  registerFont,
  setDefaultFont,
} from './registry';

import { BUILT_IN_FONTS } from './built-in';
import { registerFont } from './registry';

BUILT_IN_FONTS.forEach(registerFont);
