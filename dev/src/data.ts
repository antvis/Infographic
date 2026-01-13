import { DATASET } from '../../shared/datasets';

export { DATASET };

export type DataKey = keyof typeof DATASET;

export const DATA_KEYS = Object.keys(DATASET) as DataKey[];

export const DEFAULT_DATA_KEY: DataKey = 'LIST';
