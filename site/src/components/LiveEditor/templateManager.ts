/**
 * Helpers for manipulating the template/infographic line in syntax text.
 *
 * Motivation: avoid generating invalid lines like `infographic ` (empty template),
 * which can break downstream parsing and UI controls (theme/palette etc).
 */

export function replaceTemplateLine(syntax: string, template: string): string {
  const trimmedSyntax = syntax.trim();
  const trimmedTemplate = template.trim();

  if (!trimmedSyntax) {
    return trimmedTemplate ? `infographic ${trimmedTemplate}` : '';
  }

  const lines = syntax.split('\n');
  const templateLineIndex = lines.findIndex((line) => {
    const trimmedLine = line.trim();
    return (
      trimmedLine === 'infographic' ||
      trimmedLine.startsWith('infographic ') ||
      trimmedLine === 'template' ||
      trimmedLine.startsWith('template ')
    );
  });

  if (templateLineIndex < 0) {
    return trimmedTemplate
      ? `infographic ${trimmedTemplate}\n${syntax}`
      : syntax;
  }

  const indent = lines[templateLineIndex].match(/^\s*/)?.[0] || '';
  const keyword = lines[templateLineIndex].trim().startsWith('template')
    ? 'template'
    : 'infographic';
  lines[templateLineIndex] = trimmedTemplate
    ? `${indent}${keyword} ${trimmedTemplate}`
    : `${indent}${keyword}`;
  return lines.join('\n');
}
