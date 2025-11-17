export type Palette =
  | string
  | string[]
  | ((ratio: number, index: number, count: number) => string);
