import type { ItemDatum, RelationEdgeDatum } from '../types';
import { mapWithSchema } from './mapper';
import { RelationSchema } from './schema';
import type { SyntaxError, SyntaxNode } from './types';

const RELATION_TOKEN = /[<>=o.x-]{2,}/;
const ARROW_TOKEN = /[<>=o.x-]{2,}/g;

interface ParsedNode {
  id: string;
  label?: string;
}

interface ParsedEdge {
  label?: string;
  direction: 'forward' | 'both' | 'none';
  reverse: boolean;
  nextIndex: number;
}

function normalizeLabel(text: string) {
  let label = text.trim();
  if (!label) return '';
  const first = label[0];
  const last = label[label.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    label = label.slice(1, -1);
  }
  label = label
    .replace(/\\(["'])/g, '$1')
    .replace(/(&quot;|&#quot;|#quot;)/g, '"')
    .replace(/(&apos;|&#39;|#apos;)/g, "'");
  return label.trim();
}

function stripEdgeLabelPrefix(text: string) {
  const trimmed = text
    .trim()
    .replace(/^[-=.ox]+/, '')
    .trim();
  return normalizeLabel(trimmed);
}

function skipSpaces(text: string, index: number) {
  let cursor = index;
  while (cursor < text.length && /\s/.test(text[cursor])) {
    cursor += 1;
  }
  return cursor;
}

function readNode(text: string, startIndex: number) {
  let index = skipSpaces(text, startIndex);
  if (index >= text.length) return null;
  const idStart = index;
  while (index < text.length) {
    const char = text[index];
    if (
      /\s/.test(char) ||
      char === '[' ||
      char === '(' ||
      char === '@' ||
      char === '|' ||
      char === '<' ||
      char === '>'
    ) {
      break;
    }
    if (
      char === '-' &&
      (text[index + 1] === '-' ||
        text[index + 1] === '>' ||
        text[index + 1] === '<')
    ) {
      break;
    }
    index += 1;
  }
  if (index === idStart) return null;
  const id = text.slice(idStart, index).trim();
  if (!id) return null;

  if (text.startsWith('@{', index)) {
    const braceEnd = text.indexOf('}', index + 2);
    if (braceEnd !== -1) {
      index = braceEnd + 1;
    }
  }

  index = skipSpaces(text, index);
  let label: string | undefined;
  if (text[index] === '[') {
    const end = text.indexOf(']', index + 1);
    if (end !== -1) {
      label = normalizeLabel(text.slice(index + 1, end));
      index = end + 1;
    }
  } else if (text[index] === '(') {
    const end = text.indexOf(')', index + 1);
    if (end !== -1) {
      let content = text.slice(index + 1, end).trim();
      if (content.startsWith('[') && content.endsWith(']')) {
        content = content.slice(1, -1).trim();
      }
      label = normalizeLabel(content);
      index = end + 1;
    }
  }

  return {
    node: { id, label } as ParsedNode,
    nextIndex: index,
  };
}

function readEdge(text: string, startIndex: number): ParsedEdge | null {
  ARROW_TOKEN.lastIndex = startIndex;
  const match = ARROW_TOKEN.exec(text);
  if (!match) return null;
  const arrowToken = match[0];
  const arrowStart = match.index;
  const arrowEnd = arrowStart + arrowToken.length;
  const labelPrefix = stripEdgeLabelPrefix(text.slice(startIndex, arrowStart));
  let label = labelPrefix || undefined;
  let directionToken = arrowToken;
  let index = arrowEnd;

  index = skipSpaces(text, index);
  if (text[index] === '|') {
    const pipeEnd = text.indexOf('|', index + 1);
    if (pipeEnd !== -1) {
      const pipeLabel = normalizeLabel(text.slice(index + 1, pipeEnd));
      label = pipeLabel || label;
      index = pipeEnd + 1;
      const afterLabel = skipSpaces(text, index);
      ARROW_TOKEN.lastIndex = afterLabel;
      const tail = ARROW_TOKEN.exec(text);
      if (tail && tail.index === afterLabel) {
        directionToken += tail[0];
        index = tail.index + tail[0].length;
      } else {
        index = afterLabel;
      }
    }
  }

  const hasLeft = directionToken.includes('<');
  const hasRight = directionToken.includes('>');
  const markerMatch = directionToken.match(/[xo]/gi) || [];
  const markerLeft = /^[xo]/i.test(directionToken);
  const markerRight = /[xo]$/i.test(directionToken);
  let direction: ParsedEdge['direction'] = 'none';
  let reverse = false;
  if (
    (hasLeft && hasRight) ||
    (hasLeft && markerRight) ||
    (hasRight && markerLeft) ||
    (markerLeft && markerRight)
  ) {
    direction = 'both';
  } else if (hasLeft || hasRight || markerMatch.length > 0) {
    direction = 'forward';
    reverse = hasLeft && !hasRight;
  }

  return { label, direction, reverse, nextIndex: index };
}

function parseRelationLine(text: string) {
  const relations: RelationEdgeDatum[] = [];
  const nodes: ParsedNode[] = [];
  const nodeMap = new Map<string, ParsedNode>();
  let index = 0;
  const first = readNode(text, index);
  if (!first) return { relations, nodes };
  let current = first.node;
  if (!nodeMap.has(current.id)) {
    nodeMap.set(current.id, current);
    nodes.push(current);
  }
  index = first.nextIndex;

  while (index < text.length) {
    const edge = readEdge(text, index);
    if (!edge) break;
    index = edge.nextIndex;
    const nextNode = readNode(text, index);
    if (!nextNode) break;
    index = nextNode.nextIndex;

    let from = current.id;
    let to = nextNode.node.id;
    const direction = edge.direction;
    if (edge.reverse) {
      from = nextNode.node.id;
      to = current.id;
    }

    const relation: RelationEdgeDatum = {
      from,
      to,
    };
    if (edge.label) relation.label = edge.label;
    if (direction === 'both') relation.direction = 'both';
    if (direction === 'none') relation.direction = 'none';
    relations.push(relation);

    if (!nodeMap.has(current.id)) {
      nodeMap.set(current.id, current);
      nodes.push(current);
    }
    if (!nodeMap.has(nextNode.node.id)) {
      nodeMap.set(nextNode.node.id, nextNode.node);
      nodes.push(nextNode.node);
    }
    current = nextNode.node;
  }

  return { relations, nodes };
}

function ensureItemLabel(
  items: Map<string, ItemDatum>,
  list: ItemDatum[],
  id: string,
  label?: string,
) {
  if (!id) return;
  const existing = items.get(id);
  if (existing) {
    if (!existing.label && label) existing.label = label;
    return;
  }
  const item: ItemDatum = { id, label: label || id };
  items.set(id, item);
  list.push(item);
}

function parseExplicitRelation(
  node: SyntaxNode,
  path: string,
  errors: SyntaxError[],
) {
  const value = mapWithSchema(node, RelationSchema, path, errors);
  if (!value || typeof value !== 'object') return null;
  if (typeof value.from !== 'string' || typeof value.to !== 'string') {
    return null;
  }
  return value as RelationEdgeDatum;
}

export function parseRelationsNode(
  node: SyntaxNode,
  errors: SyntaxError[],
  path: string,
) {
  const relations: RelationEdgeDatum[] = [];
  const items: ItemDatum[] = [];
  const itemMap = new Map<string, ItemDatum>();

  const parseLine = (line: string) => {
    if (!RELATION_TOKEN.test(line)) return;
    const parsed = parseRelationLine(line);
    parsed.nodes.forEach((nodeItem) => {
      ensureItemLabel(itemMap, items, nodeItem.id, nodeItem.label);
    });
    relations.push(...parsed.relations);
  };

  if (node.kind === 'array') {
    node.items.forEach((item, index) => {
      if (
        item.kind === 'object' &&
        item.value &&
        Object.keys(item.entries).length === 0 &&
        RELATION_TOKEN.test(item.value)
      ) {
        parseLine(item.value);
        return;
      }
      const relation = parseExplicitRelation(item, `${path}[${index}]`, errors);
      if (relation) {
        relations.push(relation);
      }
    });
  } else if (node.kind === 'object' && node.value) {
    parseLine(node.value);
  }

  return { relations, items };
}
