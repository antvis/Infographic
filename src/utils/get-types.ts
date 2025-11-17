/**
 * 根据结构配置生成 TypeScript 类型字符串
 */
export function getTypes(
  composites: { structure: string[]; items: string[][] },
  commentsMap: Record<string, string> = {
    title: '信息图标题',
    desc: '信息图描述',
    items: '信息图的内容项',
    label: '项目标签文本',
    value: '项目数值内容',
    icon: '项目图标',
    illus: '项目插图',
    children: '子级项目（多层结构）',
  },
): string {
  const { structure, items } = composites;

  const lines: string[] = [];
  const indent = (level: number) => '  '.repeat(level);

  function fieldLine(name: string, type: string, level: number) {
    const comment = commentsMap[name];
    return comment
      ? `${indent(level)}/** ${comment} */\n${indent(level)}${name}: ${type};`
      : `${indent(level)}${name}: ${type};`;
  }

  function buildItemType(level: number, indentLevel: number): string {
    const fields = items[level];
    const fieldLines: string[] = [];

    for (const field of fields) {
      const type = field === 'value' ? 'number' : 'string';
      fieldLines.push(fieldLine(field, type, indentLevel + 1));
    }

    if (items[level + 1]) {
      fieldLines.push(
        fieldLine(
          'children',
          `Array<${buildItemType(level + 1, indentLevel + 1)}>`,
          indentLevel + 1,
        ),
      );
    }

    return `{\n${fieldLines.join('\n')}\n${indent(indentLevel)}}`;
  }

  lines.push('type InfographicType = {');

  // title / desc
  if (structure.includes('title')) {
    lines.push(fieldLine('title', 'string', 1));
    lines.push(fieldLine('desc', 'string', 1));
  }

  // items
  if (structure.includes('item') && items.length > 0) {
    lines.push(fieldLine('items', `Array<${buildItemType(0, 1)}>`, 1));
  }

  lines.push('}');

  return lines.join('\n');
}
