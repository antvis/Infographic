import type {SyntaxError} from '@antv/infographic';
import {
  getPalettes,
  getTemplates,
  getThemes,
  parseSyntax,
} from '@antv/infographic';
import type {Diagnostic} from '@codemirror/lint';
import type {EditorView} from '@codemirror/view';
import {TEMPLATES} from 'components/Gallery/templates';
import {IconClose} from 'components/Icon/IconClose';
import {IconLink} from 'components/Icon/IconLink';
import {IconRestart} from 'components/Icon/IconRestart';
import {CodeEditor} from 'components/MDX/CodeEditor';
import {useLocaleBundle} from 'hooks/useTranslation';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {DEFAULT_SYNTAX} from './defaultSyntax';

const CATEGORY_STORAGE_KEY = 'live-editor-category-data';
type TemplateCategory =
  | 'list'
  | 'timeline'
  | 'hierarchy'
  | 'compare'
  | 'swot'
  | 'wordcloud'
  | 'chart'
  | 'quadrant'
  | 'relation';

const TEMPLATE_SYNTAX_MAP = new Map(
  TEMPLATES.map(({template, syntax}) => [template, syntax])
);

const CATEGORY_DEFAULT_TEMPLATES: Record<
  Exclude<TemplateCategory, 'list'>,
  string
> = {
  timeline: 'list-column-simple-vertical-arrow',
  hierarchy: 'hierarchy-tree-tech-style-capsule-item',
  compare: 'compare-binary-horizontal-simple-fold',
  swot: 'compare-swot',
  wordcloud: 'chart-wordcloud',
  chart: 'chart-bar-plain-text',
  quadrant: 'quadrant-quarter-simple-card',
  relation: 'relation-circle-icon-badge',
};

const getLeadingSpaces = (line: string) => line.match(/^\s*/)?.[0].length ?? 0;

const getDataBlockRange = (lines: string[]) => {
  const dataIndex = lines.findIndex(
    (line) => line.trim().startsWith('data') && getLeadingSpaces(line) === 0
  );
  if (dataIndex < 0) return null;
  const baseIndent = getLeadingSpaces(lines[dataIndex]);
  let end = dataIndex + 1;
  for (; end < lines.length; end++) {
    const line = lines[end];
    if (!line.trim()) continue;
    const indent = getLeadingSpaces(line);
    if (indent <= baseIndent) break;
  }
  return {start: dataIndex, end};
};

const extractDataBlock = (syntax: string) => {
  const lines = syntax.split('\n');
  const range = getDataBlockRange(lines);
  if (!range) return '';
  return lines.slice(range.start, range.end).join('\n');
};

const getTemplateFromSyntax = (syntax: string) => {
  const firstLine =
    syntax
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.length > 0) ?? '';
  if (firstLine.startsWith('infographic ')) {
    return firstLine.slice('infographic '.length).trim();
  }
  if (firstLine.startsWith('template ')) {
    return firstLine.slice('template '.length).trim();
  }
  return '';
};

const getCategoryForTemplate = (
  template: string | null | undefined
): TemplateCategory | null => {
  if (!template) return null;
  if (template === 'compare-swot') return 'swot';
  if (template.startsWith('hierarchy-')) return 'hierarchy';
  if (template.startsWith('compare-')) return 'compare';
  if (template.startsWith('swot-')) return 'swot';
  if (template.startsWith('chart-wordcloud')) return 'wordcloud';
  if (template.startsWith('chart-')) return 'chart';
  if (template.startsWith('quadrant-')) return 'quadrant';
  if (template.startsWith('relation-')) return 'relation';
  if (template.startsWith('list-column-')) return 'timeline';
  return 'list';
};

const getDefaultDataBlockForCategory = (category: TemplateCategory) => {
  if (category === 'list') return extractDataBlock(DEFAULT_SYNTAX);
  const template = CATEGORY_DEFAULT_TEMPLATES[category];
  const syntax = TEMPLATE_SYNTAX_MAP.get(template);
  if (syntax) return extractDataBlock(syntax);
  return extractDataBlock(DEFAULT_SYNTAX);
};

const readCategoryStore = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, string>;
  } catch (error) {
    console.warn('Failed to read live editor category data.', error);
    return {};
  }
};

const writeCategoryStore = (store: Record<string, string>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.warn('Failed to store live editor category data.', error);
  }
};

const getStoredCategoryData = (category: TemplateCategory) => {
  const store = readCategoryStore();
  const value = store[category];
  return typeof value === 'string' ? value : '';
};

const setStoredCategoryData = (
  category: TemplateCategory,
  dataBlock: string
) => {
  if (!dataBlock.trim()) return;
  const store = readCategoryStore();
  store[category] = dataBlock;
  writeCategoryStore(store);
};

const stripChildrenFromItemsInDataBlock = (dataBlock: string) => {
  if (!dataBlock.trim()) return dataBlock;
  const lines = dataBlock.split('\n');
  const itemsIndex = lines.findIndex((line) => line.trim() === 'items');
  if (itemsIndex < 0) return dataBlock;

  const itemsIndent = getLeadingSpaces(lines[itemsIndex]);
  const itemIndent = itemsIndent + 2;
  const childIndent = itemIndent + 2;
  let i = itemsIndex + 1;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      i += 1;
      continue;
    }
    const indent = getLeadingSpaces(line);
    if (indent <= itemsIndent) break;

    if (indent === itemIndent && trimmed.startsWith('-')) {
      let j = i + 1;
      while (j < lines.length) {
        const next = lines[j];
        const nextTrimmed = next.trim();
        if (!nextTrimmed) {
          j += 1;
          continue;
        }
        const nextIndent = getLeadingSpaces(next);
        if (nextIndent <= itemsIndent) break;
        if (nextIndent === itemIndent && nextTrimmed.startsWith('-')) break;
        if (nextIndent === childIndent && nextTrimmed.startsWith('children')) {
          let k = j + 1;
          while (k < lines.length) {
            const childLine = lines[k];
            const childTrimmed = childLine.trim();
            if (!childTrimmed) {
              k += 1;
              continue;
            }
            const childIndent = getLeadingSpaces(childLine);
            if (childIndent <= nextIndent) break;
            k += 1;
          }
          lines.splice(j, k - j);
          continue;
        }
        j += 1;
      }
      i = j;
      continue;
    }

    i += 1;
  }

  return lines.join('\n');
};

const ensureChartValuesInDataBlock = (dataBlock: string) => {
  if (!dataBlock.trim()) return dataBlock;
  const lines = dataBlock.split('\n');
  const itemsIndex = lines.findIndex((line) => line.trim() === 'items');
  if (itemsIndex < 0) return dataBlock;

  const itemsIndent = getLeadingSpaces(lines[itemsIndex]);
  const itemIndent = itemsIndent + 2;
  let itemIndex = 0;
  let i = itemsIndex + 1;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      i += 1;
      continue;
    }
    const indent = getLeadingSpaces(line);
    if (indent <= itemsIndent) break;

    if (indent === itemIndent && trimmed.startsWith('-')) {
      const itemStart = i;
      let hasValue = trimmed.startsWith('- value ');
      let j = i + 1;

      for (; j < lines.length; j += 1) {
        const next = lines[j];
        const nextTrimmed = next.trim();
        if (!nextTrimmed) continue;
        const nextIndent = getLeadingSpaces(next);
        if (nextIndent <= itemsIndent) break;
        if (nextIndent === itemIndent && nextTrimmed.startsWith('-')) break;
        if (nextIndent === itemIndent + 2 && nextTrimmed.startsWith('value ')) {
          hasValue = true;
        }
      }

      if (!hasValue) {
        const value = (itemIndex + 1) * 10;
        lines.splice(
          itemStart + 1,
          0,
          `${' '.repeat(itemIndent + 2)}value ${value}`
        );
        j += 1;
      }

      itemIndex += 1;
      i = j;
      continue;
    }

    i += 1;
  }

  return lines.join('\n');
};

const normalizeDataBlockForCategory = (
  category: TemplateCategory,
  dataBlock: string
) => {
  if (category === 'chart') {
    const stripped = stripChildrenFromItemsInDataBlock(dataBlock);
    return ensureChartValuesInDataBlock(stripped);
  }
  return dataBlock;
};

const findDataInsertIndex = (lines: string[]) => {
  let insertIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('infographic ') || trimmed.startsWith('template ')) {
      insertIndex = i + 1;
      continue;
    }
    if (trimmed.startsWith('theme ')) {
      return i;
    }
  }
  return insertIndex;
};

const replaceDataBlock = (syntax: string, nextDataBlock: string) => {
  if (!nextDataBlock) return syntax;
  const lines = syntax.split('\n');
  const range = getDataBlockRange(lines);
  const blockLines = nextDataBlock.split('\n');
  if (range) {
    lines.splice(range.start, range.end - range.start, ...blockLines);
  } else {
    const insertIndex = findDataInsertIndex(lines);
    lines.splice(insertIndex, 0, ...blockLines);
  }
  return lines.join('\n');
};

const replaceTemplateLine = (syntax: string, template: string) => {
  const trimmed = syntax.trim();
  if (!trimmed) return `infographic ${template}`;
  const lines = syntax.split('\n');
  const templateLineIndex = lines.findIndex((line) => {
    const trimmedLine = line.trim();
    return (
      trimmedLine.startsWith('infographic ') ||
      trimmedLine.startsWith('template ')
    );
  });
  if (templateLineIndex >= 0) {
    const indent = lines[templateLineIndex].match(/^\s*/)?.[0] || '';
    const keyword = lines[templateLineIndex].trim().startsWith('template ')
      ? 'template'
      : 'infographic';
    lines[templateLineIndex] = `${indent}${keyword} ${template}`;
    return lines.join('\n');
  }
  return `infographic ${template}\n${syntax}`;
};

const TRANSLATIONS = {
  'zh-CN': {
    title: 'Syntax 编辑器',
    editorAria: 'Infographic Syntax 编辑器',
    configTitle: '配置',
    templateLabel: '模板',
    themeLabel: '主题',
    paletteLabel: '配色',
    resetButton: '重置',
    shareButton: '分享',
    clearButton: '清空',
  },
  'en-US': {
    title: 'Syntax Editor',
    editorAria: 'Infographic Syntax Editor',
    configTitle: 'Config',
    templateLabel: 'Template',
    themeLabel: 'Theme',
    paletteLabel: 'Palette',
    resetButton: 'Reset',
    shareButton: 'Share',
    clearButton: 'Clear',
  },
};

export function EditorPanel({
  value,
  onChange,
  onShare,
  onReset,
}: {
  value: string;
  onChange: (value: string) => void;
  onShare: () => void;
  onReset: () => void;
}) {
  const texts = useLocaleBundle(TRANSLATIONS);
  const templates = useMemo(() => getTemplates().sort(), []);
  const themes = useMemo(() => getThemes().sort(), []);
  const palettes = useMemo(() => Object.keys(getPalettes()).sort(), []);

  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedPalette, setSelectedPalette] = useState('');

  const handleClear = () => {
    onChange('');
  };

  // Helper function to find insertion point for theme/palette
  const findInsertionPoint = (lines: string[]): number => {
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (
        lines[i].trim().startsWith('infographic ') ||
        lines[i].trim().startsWith('template ')
      ) {
        insertIndex = i + 1;
      }
      if (lines[i].trim().startsWith('data')) {
        break;
      }
    }
    return insertIndex;
  };

  // Extract current config from syntax
  useEffect(() => {
    const lines = value.split('\n');

    // Extract template from first line "infographic [template-name]"
    const firstLine = lines[0]?.trim() || '';
    if (firstLine.startsWith('infographic ')) {
      const template = firstLine.substring('infographic '.length).trim();
      if (template && templates.includes(template)) {
        setSelectedTemplate(template);
      } else {
        setSelectedTemplate('');
      }
    } else {
      setSelectedTemplate('');
    }

    // Extract theme
    const themeLine = lines.find((line) => line.trim().startsWith('theme '));
    if (themeLine) {
      const theme = themeLine.trim().substring('theme '.length).trim();
      if (theme && themes.includes(theme)) {
        setSelectedTheme(theme);
      } else {
        setSelectedTheme('');
      }
    } else {
      setSelectedTheme('');
    }

    // Extract palette
    const paletteLine = lines.find((line) => {
      const trimmed = line.trim();
      return trimmed.startsWith('palette ') && trimmed !== 'palette';
    });
    if (paletteLine) {
      const palette = paletteLine.trim().substring('palette '.length).trim();
      if (palette && palettes.includes(palette)) {
        setSelectedPalette(palette);
      } else {
        setSelectedPalette('');
      }
    } else {
      setSelectedPalette('');
    }
  }, [value, templates, themes, palettes]);

  useEffect(() => {
    const currentTemplate = getTemplateFromSyntax(value);
    const category = getCategoryForTemplate(currentTemplate);
    if (!category) return;
    const rawDataBlock = extractDataBlock(value);
    if (!rawDataBlock) return;
    const dataBlock = normalizeDataBlockForCategory(category, rawDataBlock);
    if (dataBlock !== rawDataBlock) {
      onChange(replaceDataBlock(value, dataBlock));
      return;
    }
    setStoredCategoryData(category, dataBlock);
  }, [value, onChange]);

  // Create linter function for CodeMirror diagnostics
  const linter = useCallback(
    (view: EditorView): Diagnostic[] => {
      const content = view.state.doc.toString();
      const {errors, options} = parseSyntax(content);
      const diagnostics: Diagnostic[] = errors.map((error: SyntaxError) => {
        // Calculate position from line number
        const line = error.line - 1; // Convert 1-indexed to 0-indexed
        const lineObj = view.state.doc.line(
          Math.max(1, Math.min(line + 1, view.state.doc.lines))
        );
        const from = lineObj.from;
        const to = lineObj.to;

        return {
          from,
          to,
          severity: 'error' as const,
          message: `${error.code}: ${error.message}${
            error.raw ? ` (${error.raw})` : ''
          }`,
        };
      });

      // Check if template exists
      if (options.template) {
        const availableTemplates = templates;
        if (!availableTemplates.includes(options.template)) {
          // Find the line with "infographic [template-name]"
          const lines = content.split('\n');
          const templateLineIndex = lines.findIndex(
            (line) =>
              line.trim().startsWith('infographic ') &&
              line.includes(options.template!)
          );

          if (templateLineIndex >= 0) {
            const lineObj = view.state.doc.line(templateLineIndex + 1);
            diagnostics.push({
              from: lineObj.from,
              to: lineObj.to,
              severity: 'error' as const,
              message: `unknown_template: Template "${options.template}" not found. Available templates can be selected from the dropdown.`,
            });
          }
        }
      }

      return diagnostics;
    },
    [templates]
  );

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    const currentTemplate = getTemplateFromSyntax(value);
    const currentCategory = getCategoryForTemplate(currentTemplate);
    const nextCategory = getCategoryForTemplate(template);
    let nextSyntax = replaceTemplateLine(value, template);
    if (nextCategory && currentCategory !== nextCategory) {
      if (currentCategory) {
        const currentDataBlock = normalizeDataBlockForCategory(
          currentCategory,
          extractDataBlock(value)
        );
        if (currentDataBlock) {
          setStoredCategoryData(currentCategory, currentDataBlock);
        }
      }
      const storedDataBlock = getStoredCategoryData(nextCategory);
      const baseDataBlock =
        storedDataBlock || getDefaultDataBlockForCategory(nextCategory);
      const nextDataBlock = normalizeDataBlockForCategory(
        nextCategory,
        baseDataBlock
      );
      nextSyntax = replaceDataBlock(nextSyntax, nextDataBlock);
    }
    onChange(nextSyntax);
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    // Update or insert theme in syntax
    const lines = value.split('\n');
    const themeLineIndex = lines.findIndex((line) =>
      line.trim().startsWith('theme')
    );

    if (themeLineIndex >= 0) {
      // Replace existing theme line
      const indent = lines[themeLineIndex].match(/^\s*/)?.[0] || '';
      lines[themeLineIndex] = `${indent}theme ${theme}`;
    } else {
      // Find insertion point using shared helper
      const insertIndex = findInsertionPoint(lines);
      lines.splice(insertIndex, 0, `theme ${theme}`);
    }
    onChange(lines.join('\n'));
  };

  const handlePaletteChange = (palette: string) => {
    setSelectedPalette(palette);
    // Update or insert palette in syntax
    const lines = value.split('\n');

    // Find existing palette line (could be "palette value" or just "palette")
    let paletteLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith('palette ') || trimmed === 'palette') {
        paletteLineIndex = i;
        break;
      }
    }

    if (paletteLineIndex >= 0) {
      // Found existing palette
      const indent = lines[paletteLineIndex].match(/^\s*/)?.[0] || '';
      const currentLine = lines[paletteLineIndex].trim();

      if (currentLine === 'palette') {
        // It's "palette" as object key with array of colors below
        // Remove the palette line and all color items below it
        let endIndex = paletteLineIndex + 1;
        const baseIndent = indent.length;
        while (endIndex < lines.length) {
          const line = lines[endIndex];
          const lineIndent = line.match(/^\s*/)?.[0]?.length || 0;
          // Stop if we hit a line with same or less indentation (sibling or parent)
          if (line.trim() && lineIndent <= baseIndent) {
            break;
          }
          endIndex++;
        }
        // Replace all lines (palette + colors) with single palette line
        lines.splice(
          paletteLineIndex,
          endIndex - paletteLineIndex,
          `${indent}palette ${palette}`
        );
      } else {
        // It's "palette value" format, just replace the line
        lines[paletteLineIndex] = `${indent}palette ${palette}`;
      }
    } else {
      // No existing palette, insert new one
      const themeLineIndex = lines.findIndex((line) =>
        line.trim().startsWith('theme')
      );
      if (themeLineIndex >= 0) {
        const indent = lines[themeLineIndex].match(/^\s*/)?.[0] || '';
        lines.splice(themeLineIndex + 1, 0, `${indent}  palette ${palette}`);
      } else {
        // Insert theme with palette
        const insertIndex = findInsertionPoint(lines);
        lines.splice(insertIndex, 0, `theme`, `  palette ${palette}`);
      }
    }
    onChange(lines.join('\n'));
  };

  return (
    <div className="bg-card dark:bg-card-dark rounded-xl shadow-xl flex flex-col h-full overflow-hidden border border-border dark:border-border-dark">
      <div className="flex items-center justify-between px-4 py-3 bg-wash dark:bg-wash-dark border-b border-border dark:border-border-dark">
        <h2 className="text-base font-semibold text-primary dark:text-primary-dark flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-link animate-pulse" />
          {texts.title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            title={texts.clearButton}
            className="p-1.5 text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
            aria-label={texts.clearButton}>
            <IconClose className="w-5 h-5" />
          </button>
          <button
            onClick={onReset}
            title={texts.resetButton}
            className="p-1.5 text-secondary hover:text-link hover:bg-link/10 rounded-md transition-all"
            aria-label={texts.resetButton}>
            <IconRestart className="w-5 h-5" />
          </button>
          <div className="w-[1px] h-4 bg-border dark:bg-border-dark self-center mx-1" />
          <button
            onClick={onShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-link hover:bg-link-dark text-white rounded-md transition-all shadow-sm hover:shadow-md">
            <IconLink className="w-4 h-4" />
            {texts.shareButton}
          </button>
        </div>
      </div>
      <div className="flex-1 relative group overflow-auto">
        <CodeEditor
          ariaLabel={texts.editorAria}
          className="h-full text-sm"
          language="yaml"
          onChange={onChange}
          value={value}
          linterFn={linter}
        />
      </div>
      <div className="px-4 py-4 bg-wash dark:bg-wash-dark border-t border-border dark:border-border-dark">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="template-select"
              className="text-[11px] uppercase tracking-wider font-bold text-tertiary dark:text-tertiary-dark">
              {texts.templateLabel}
            </label>
            <div className="relative group">
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-sm bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-md text-primary dark:text-primary-dark appearance-none focus:outline-none focus:ring-2 focus:ring-link/50 transition-all cursor-pointer">
                <option value="">unknown</option>
                {templates.map((template) => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-tertiary">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="theme-select"
              className="text-[11px] uppercase tracking-wider font-bold text-tertiary dark:text-tertiary-dark">
              {texts.themeLabel}
            </label>
            <div className="relative">
              <select
                id="theme-select"
                value={selectedTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-sm bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-md text-primary dark:text-primary-dark appearance-none focus:outline-none focus:ring-2 focus:ring-link/50 transition-all cursor-pointer">
                <option value="">default</option>
                {themes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-tertiary">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="palette-select"
              className="text-[11px] uppercase tracking-wider font-bold text-tertiary dark:text-tertiary-dark">
              {texts.paletteLabel}
            </label>
            <div className="relative">
              <select
                id="palette-select"
                value={selectedPalette}
                onChange={(e) => handlePaletteChange(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-sm bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-md text-primary dark:text-primary-dark appearance-none focus:outline-none focus:ring-2 focus:ring-link/50 transition-all cursor-pointer">
                <option value="">default</option>
                {palettes.map((palette) => (
                  <option key={palette} value={palette}>
                    {palette}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-tertiary">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
