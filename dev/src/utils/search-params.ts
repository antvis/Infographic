export function getSearchParam(key: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

export function setSearchParam(key: string, value: string) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(key, value);
  window.history.replaceState(null, '', `?${urlParams.toString()}`);
}
