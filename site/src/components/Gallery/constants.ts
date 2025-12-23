import {Language, t} from '../../utils/i18n';
import {translations} from '../../utils/translations';

export const getTypeDisplayNames = (lang: Language) => translations[lang].gallery.types;

export const getSeriesDisplayNames = (lang: Language) => translations[lang].gallery.series;
