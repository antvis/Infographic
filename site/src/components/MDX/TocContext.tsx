import type {ReactNode} from 'react';
import {createContext} from 'react';

export type TocItem = {
  url: string;
  text: ReactNode;
  depth: number;
};
export type Toc = Array<TocItem>;

export const TocContext = createContext<Toc>([]);
