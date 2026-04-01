// Re-export all types for backward compatibility
export type * from './attrs';
export type * from './data';
export type * from './element';
export type * from './event';
export type * from './font';
export type * from './padding';
export type * from './resource';
export type * from './text';
export type * from './template';

// Domain model aliases - the recommended way to import infographic data types
export type {
  Data as InfographicData,
  ItemDatum as InfographicItem,
  RelationDatum as InfographicRelation,
  BaseDatum as InfographicBaseDatum,
} from './data';

export type {
  Template,
  TemplateMetadata,
  TemplateCategory,
} from './template';
