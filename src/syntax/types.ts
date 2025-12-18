import type { InfographicOptions } from '../options';

export type SyntaxNode = ValueNode | ObjectNode | ArrayNode;

export interface ValueNode {
  kind: 'value';
  line: number;
  value: string;
}

export interface ObjectNode {
  kind: 'object';
  line: number;
  value?: string;
  entries: Record<string, SyntaxNode>;
}

export interface ArrayNode {
  kind: 'array';
  line: number;
  items: SyntaxNode[];
}

export type SyntaxErrorCode =
  | 'unknown_key'
  | 'schema_mismatch'
  | 'invalid_value'
  | 'bad_indent'
  | 'bad_list'
  | 'bad_syntax';

export interface SyntaxError {
  path: string;
  line: number;
  code: SyntaxErrorCode;
  message: string;
  raw?: string;
}

export interface SyntaxParseResult {
  options: Partial<InfographicOptions>;
  errors: SyntaxError[];
  warnings: SyntaxError[];
  ast?: ObjectNode;
}

export type SchemaNode =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | EnumSchema
  | ArraySchema
  | ObjectSchema
  | UnionSchema;

export interface StringSchema {
  kind: 'string';
}

export interface NumberSchema {
  kind: 'number';
}

export interface BooleanSchema {
  kind: 'boolean';
}

export interface EnumSchema {
  kind: 'enum';
  values: string[];
}

export interface ArraySchema {
  kind: 'array';
  item: SchemaNode;
  split?: 'space' | 'comma' | 'any';
}

export interface ObjectSchema {
  kind: 'object';
  fields: Record<string, SchemaNode>;
  allowUnknown?: boolean;
  shorthandKey?: string;
}

export interface UnionSchema {
  kind: 'union';
  variants: SchemaNode[];
}
