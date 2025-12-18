import type {
  NullableParsedDesignsOptions,
  ParsedDesignsOptions,
} from '../designs';

export function isNonNullableParsedDesignsOptions(
  options: NullableParsedDesignsOptions,
): options is ParsedDesignsOptions {
  const { structure, item, items } = options;
  if (!structure) return false;
  if (!item) return false;
  if (items.some((it) => !it)) return false;
  return true;
}
