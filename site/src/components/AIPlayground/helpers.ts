export function formatJSON(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '';
  }
}

export const d = (s: string) => {
  const codes = s.match(/\d{3}/g)?.map(Number) ?? [];
  return String.fromCharCode(
    ...codes.map((value, idx) => value ^ (17 + (idx % 5)))
  );
};
