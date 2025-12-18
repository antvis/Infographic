import type { ObjectSchema, SchemaNode } from './types';

const string = (): SchemaNode => ({ kind: 'string' });
const number = (): SchemaNode => ({ kind: 'number' });
// const boolean = (): SchemaNode => ({ kind: 'boolean' });
const enumOf = (values: string[]): SchemaNode => ({ kind: 'enum', values });
const array = (item: SchemaNode, split: 'space' | 'comma' | 'any' = 'any') => ({
  kind: 'array' as const,
  item,
  split,
});
const object = (
  fields: Record<string, SchemaNode>,
  options: { allowUnknown?: boolean; shorthandKey?: string } = {},
): ObjectSchema => ({
  kind: 'object',
  fields,
  allowUnknown: options.allowUnknown,
  shorthandKey: options.shorthandKey,
});
const union = (...variants: SchemaNode[]): SchemaNode => ({
  kind: 'union',
  variants,
});

const itemDatumSchema: ObjectSchema = object({});
itemDatumSchema.fields = {
  label: string(),
  value: union(number(), string()),
  desc: string(),
  icon: string(),
  children: array(itemDatumSchema),
};

export const ThemeSchema = object(
  {
    type: string(),
    colorBg: string(),
    colorPrimary: string(),
    palette: array(string(), 'any'),
    title: object({}, { allowUnknown: true }),
    desc: object({}, { allowUnknown: true }),
    base: object({
      global: object({}, { allowUnknown: true }),
      shape: object({}, { allowUnknown: true }),
      text: object({}, { allowUnknown: true }),
    }),
    stylize: object(
      {
        type: enumOf(['rough', 'pattern']),
        roughness: number(),
        bowing: number(),
        fillWeight: number(),
        hachureGap: number(),
        pattern: string(),
        backgroundColor: string(),
        foregroundColor: string(),
        scale: number(),
      },
      { shorthandKey: 'type' },
    ),
  },
  { shorthandKey: 'type' },
);

const designNodeSchema = object(
  {},
  { allowUnknown: true, shorthandKey: 'type' },
);

export const DesignSchema = object({
  structure: designNodeSchema,
  item: designNodeSchema,
  items: array(designNodeSchema),
  title: designNodeSchema,
});

export const DataSchema = object({
  title: string(),
  desc: string(),
  items: array(itemDatumSchema),
});

export const TemplateSchema = object(
  {
    type: string(),
  },
  { shorthandKey: 'type' },
);

export const RootSchema = object({
  template: TemplateSchema,
  design: DesignSchema,
  data: DataSchema,
  theme: ThemeSchema,
  width: union(number(), string()),
  height: union(number(), string()),
});
