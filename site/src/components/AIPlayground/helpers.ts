export function formatJSON(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '';
  }
}
