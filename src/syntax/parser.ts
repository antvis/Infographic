import type { ArrayNode, ObjectNode, SyntaxError } from './types';

interface StackFrame {
  indent: number;
  node: ObjectNode | ArrayNode;
  parent?: ObjectNode | ArrayNode | null;
  key?: string | null;
}

interface ParseResult {
  ast: ObjectNode;
  errors: SyntaxError[];
}

function isWhitespace(char: string) {
  return char === ' ' || char === '\t';
}

function getIndentInfo(line: string) {
  let indent = 0;
  let index = 0;
  while (index < line.length) {
    const char = line[index];
    if (char === ' ') {
      indent += 1;
      index += 1;
      continue;
    }
    if (char === '\t') {
      indent += 2;
      index += 1;
      continue;
    }
    break;
  }
  return { indent, content: line.slice(index) };
}

function stripComments(content: string) {
  return content.trimEnd();
}

function looksLikeRelationExpression(text: string) {
  return /[<>=o.x-]{2,}/.test(text);
}

function parseKeyValue(raw: string) {
  const text = raw.trim();
  if (!text) return null;
  const match = text.match(/^([^:\s=]+)\s*[:=]\s*(.*)$/);
  if (match) {
    return { key: match[1], value: match[2].trim() };
  }
  const matchSpace = text.match(/^([^\s]+)\s+(.*)$/);
  if (matchSpace) {
    return { key: matchSpace[1], value: matchSpace[2].trim() };
  }
  return { key: text, value: undefined };
}

function createObjectNode(line: number, value?: string): ObjectNode {
  return { kind: 'object', line, value, entries: {} };
}

function createArrayNode(line: number): ArrayNode {
  return { kind: 'array', line, items: [] };
}

export function parseSyntaxToAst(input: string): ParseResult {
  const errors: SyntaxError[] = [];
  const root: ObjectNode = createObjectNode(0);
  const stack: StackFrame[] = [
    { indent: -1, node: root, parent: null, key: null },
  ];

  const lines = input.split(/\r?\n/);
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (!line.trim()) return;
    const { indent, content } = getIndentInfo(line);
    const stripped = stripComments(content);
    if (!stripped.trim()) return;

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const parentFrame = stack[stack.length - 1];
    let parentNode = parentFrame.node;

    const trimmed = stripped.trim();
    if (
      trimmed.startsWith('-') &&
      (trimmed.length === 1 || isWhitespace(trimmed[1]))
    ) {
      if (parentNode.kind !== 'array') {
        if (
          parentNode.kind === 'object' &&
          Object.keys(parentNode.entries).length === 0 &&
          parentNode.value === undefined &&
          parentFrame.parent &&
          parentFrame.key
        ) {
          const arrayNode = createArrayNode(parentNode.line);
          if (parentFrame.parent.kind === 'object') {
            parentFrame.parent.entries[parentFrame.key] = arrayNode;
          } else if (parentFrame.parent.kind === 'array') {
            const indexInParent = parentFrame.parent.items.indexOf(parentNode);
            if (indexInParent >= 0)
              parentFrame.parent.items[indexInParent] = arrayNode;
          }
          parentFrame.node = arrayNode;
          parentNode = arrayNode;
        } else {
          errors.push({
            path: '',
            line: lineNumber,
            code: 'bad_list',
            message: 'List item is not under an array container.',
            raw: trimmed,
          });
          return;
        }
      }

      const itemContent = trimmed.slice(1).trim();
      const itemNode = createObjectNode(lineNumber, itemContent || undefined);
      parentNode.items.push(itemNode);
      stack.push({
        indent,
        node: itemNode,
        parent: parentNode,
      });
      return;
    }

    if (
      parentFrame.key === 'relations' &&
      !trimmed.startsWith('-') &&
      looksLikeRelationExpression(trimmed)
    ) {
      if (parentNode.kind !== 'array') {
        if (
          parentNode.kind === 'object' &&
          Object.keys(parentNode.entries).length === 0 &&
          parentNode.value === undefined &&
          parentFrame.parent &&
          parentFrame.key
        ) {
          const arrayNode = createArrayNode(parentNode.line);
          if (parentFrame.parent.kind === 'object') {
            parentFrame.parent.entries[parentFrame.key] = arrayNode;
          } else if (parentFrame.parent.kind === 'array') {
            const indexInParent = parentFrame.parent.items.indexOf(parentNode);
            if (indexInParent >= 0)
              parentFrame.parent.items[indexInParent] = arrayNode;
          }
          parentFrame.node = arrayNode;
          parentNode = arrayNode;
        } else {
          errors.push({
            path: '',
            line: lineNumber,
            code: 'bad_list',
            message: 'List item is not under an array container.',
            raw: trimmed,
          });
          return;
        }
      }

      const itemNode = createObjectNode(lineNumber, trimmed);
      parentNode.items.push(itemNode);
      stack.push({
        indent,
        node: itemNode,
        parent: parentNode,
      });
      return;
    }

    const parsed = parseKeyValue(trimmed);
    if (!parsed) {
      errors.push({
        path: '',
        line: lineNumber,
        code: 'bad_syntax',
        message: 'Invalid syntax line.',
        raw: trimmed,
      });
      return;
    }

    if (parentNode.kind !== 'object') {
      errors.push({
        path: '',
        line: lineNumber,
        code: 'bad_syntax',
        message: 'Key-value pair is not under an object container.',
        raw: trimmed,
      });
      return;
    }

    const node = createObjectNode(lineNumber, parsed.value);
    parentNode.entries[parsed.key] = node;
    stack.push({
      indent,
      node,
      parent: parentNode,
      key: parsed.key,
    });
  });

  return { ast: root, errors };
}

export function parseInlineKeyValue(value: string) {
  return parseKeyValue(value);
}
