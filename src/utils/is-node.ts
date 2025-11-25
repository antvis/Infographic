/**
 * @see https://github.com/MatthewSH/npm-packages/blob/main/packages/is-node/src/index.ts
 */
export const isNode: boolean = !!(
  typeof process !== 'undefined' &&
  process.versions &&
  process.versions.node
);
