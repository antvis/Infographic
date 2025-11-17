export function getSafetyId(id: string) {
  return id.replace(/#|%|\.| |\/|\(|\)/g, '').replace(/,/g, '-');
}
