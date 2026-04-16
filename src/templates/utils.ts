function normalizeTemplateKey(type: string): string {
  return type
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-');
}

function getLevenshteinDistance(source: string, target: string): number {
  if (source === target) return 0;
  if (!source.length) return target.length;
  if (!target.length) return source.length;

  const previous = Array.from(
    { length: target.length + 1 },
    (_, index) => index,
  );
  const current = new Array<number>(target.length + 1);

  for (let sourceIndex = 1; sourceIndex <= source.length; sourceIndex += 1) {
    current[0] = sourceIndex;
    const sourceCode = source.charCodeAt(sourceIndex - 1);

    for (let targetIndex = 1; targetIndex <= target.length; targetIndex += 1) {
      const replaceCost =
        sourceCode === target.charCodeAt(targetIndex - 1) ? 0 : 1;
      current[targetIndex] = Math.min(
        previous[targetIndex] + 1,
        current[targetIndex - 1] + 1,
        previous[targetIndex - 1] + replaceCost,
      );
    }

    for (let index = 0; index < current.length; index += 1) {
      previous[index] = current[index];
    }
  }

  return previous[target.length];
}

function getCommonPrefixLength(source: string, target: string): number {
  const limit = Math.min(source.length, target.length);
  let index = 0;

  while (
    index < limit &&
    source.charCodeAt(index) === target.charCodeAt(index)
  ) {
    index += 1;
  }

  return index;
}

function isBetterMatch(
  bestMatch: string | undefined,
  bestDistance: number,
  bestPrefixLength: number,
  candidateKey: string,
  candidateDistance: number,
  candidatePrefixLength: number,
): boolean {
  return (
    candidateDistance < bestDistance ||
    (candidateDistance === bestDistance &&
      candidatePrefixLength > bestPrefixLength) ||
    (candidateDistance === bestDistance &&
      candidatePrefixLength === bestPrefixLength &&
      (!bestMatch || candidateKey < bestMatch))
  );
}

export function findClosestTemplateKey(
  type: string,
  keys: Iterable<string>,
): string | undefined {
  const normalizedType = normalizeTemplateKey(type);
  if (!normalizedType) return undefined;

  let bestMatch: string | undefined;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestPrefixLength = -1;

  for (const key of keys) {
    const normalizedKey = normalizeTemplateKey(key);
    if (normalizedKey === normalizedType) {
      return key;
    }

    const distance = getLevenshteinDistance(normalizedType, normalizedKey);
    const prefixLength = getCommonPrefixLength(normalizedType, normalizedKey);

    if (
      isBetterMatch(
        bestMatch,
        bestDistance,
        bestPrefixLength,
        key,
        distance,
        prefixLength,
      )
    ) {
      bestMatch = key;
      bestDistance = distance;
      bestPrefixLength = prefixLength;
    }
  }

  return bestMatch;
}
