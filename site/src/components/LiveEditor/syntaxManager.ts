const getLeadingSpaces = (line: string) => line.match(/^\s*/)?.[0].length ?? 0;

type PaletteInfo = {
  lineIndex: number;
  blockEnd: number;
  indent: string;
  value: string;
};

const findPaletteInfo = (lines: string[]): PaletteInfo | null => {
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('palette ') || trimmed === 'palette') {
      const indent = lines[i].match(/^\s*/)?.[0] || '';
      if (trimmed === 'palette') {
        const baseIndent = getLeadingSpaces(lines[i]);
        const colors: string[] = [];
        let end = i + 1;

        for (; end < lines.length; end += 1) {
          const line = lines[end];
          const lineTrimmed = line.trim();
          const lineIndent = getLeadingSpaces(line);

          if (lineTrimmed && lineIndent <= baseIndent) {
            break;
          }
          if (lineTrimmed.startsWith('-')) {
            colors.push(lineTrimmed.slice(1).trim());
          }
        }

        return {
          lineIndex: i,
          blockEnd: end,
          indent,
          value: colors.join(' '),
        };
      }

      return {
        lineIndex: i,
        blockEnd: i + 1,
        indent,
        value: trimmed.slice('palette '.length).trim(),
      };
    }
  }
  return null;
};

export const findConfigInsertionIndex = (lines: string[]): number => {
  let insertIndex = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('infographic ') || trimmed.startsWith('template ')) {
      insertIndex = i + 1;
      continue;
    }
    if (trimmed.startsWith('data')) {
      break;
    }
  }
  return insertIndex;
};

export const getPaletteFromSyntax = (syntax: string): string => {
  const info = findPaletteInfo(syntax.split('\n'));
  return info?.value ?? '';
};

export const updatePaletteInSyntax = (
  syntax: string,
  palette: string
): string => {
  const lines = syntax.split('\n');
  const info = findPaletteInfo(lines);

  if (!palette) {
    if (info) {
      lines.splice(info.lineIndex, info.blockEnd - info.lineIndex);
    }
    return lines.join('\n');
  }

  if (info) {
    lines.splice(
      info.lineIndex,
      info.blockEnd - info.lineIndex,
      `${info.indent}palette ${palette}`
    );
    return lines.join('\n');
  }

  const themeLineIndex = lines.findIndex((line) =>
    line.trim().startsWith('theme')
  );
  if (themeLineIndex >= 0) {
    const indent = lines[themeLineIndex].match(/^\s*/)?.[0] || '';
    lines.splice(themeLineIndex + 1, 0, `${indent}  palette ${palette}`);
    return lines.join('\n');
  }

  const insertIndex = findConfigInsertionIndex(lines);
  lines.splice(insertIndex, 0, 'theme', `  palette ${palette}`);
  return lines.join('\n');
};
