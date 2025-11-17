export function join(...paths: string[]): string {
  return paths
    .map((path) => path.replace(/^\/+|\/+$/g, ''))
    .filter((path) => path.trim().length > 0)
    .join('/');
}
