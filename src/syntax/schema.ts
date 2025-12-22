import type { ObjectSchema, SchemaNode } from './types';

const string = (): SchemaNode => ({ kind: 'string' });
const number = (): SchemaNode => ({ kind: 'number' });
// const boolean = (): SchemaNode => ({ kind: 'boolean' });
const enumOf = (values: string[]): SchemaNode => ({ kind: 'enum', values });
const color = (options: { soft?: boolean } = {}): SchemaNode => ({
  kind: 'color',
  soft: options.soft,
});
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
const palette = (): SchemaNode => ({ kind: 'palette' });

const nullableColorFields = {
  fill: color({ soft: true }),
  stroke: color({ soft: true }),
};

const textStyleSchema = object(nullableColorFields, { allowUnknown: true });
const shapeStyleSchema = object(nullableColorFields, { allowUnknown: true });

const itemDatumSchema: ObjectSchema = object({}, { allowUnknown: true });
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
    colorBg: color(),
    colorPrimary: color(),
    palette: palette(),
    title: textStyleSchema,
    desc: textStyleSchema,
    shape: shapeStyleSchema,
    base: object({
      global: object({}, { allowUnknown: true }),
      shape: shapeStyleSchema,
      text: textStyleSchema,
    }),
    stylize: object(
      {
        type: enumOf(['rough', 'pattern']),
        roughness: number(),
        bowing: number(),
        fillWeight: number(),
        hachureGap: number(),
        pattern: string(),
        backgroundColor: color(),
        foregroundColor: color(),
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
