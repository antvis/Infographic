export function uuid() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
