import {useLocaleBundle} from 'hooks/useTranslation';
import {CodeEditor} from 'components/MDX/CodeEditor';
import {getTemplates, getThemes, getPaletteNames, parseSyntax} from '@antv/infographic';
import {useMemo, useState, useCallback, useEffect} from 'react';
import type {Diagnostic} from '@codemirror/lint';
import type {EditorView} from '@codemirror/view';
import type {SyntaxError} from '@antv/infographic';

const TRANSLATIONS = {
  'zh-CN': {
    title: 'Syntax 编辑器',
    editorAria: 'Infographic Syntax 编辑器',
    configTitle: '配置',
    templateLabel: '模板',
    themeLabel: '主题',
    paletteLabel: '配色',
  },
  'en-US': {
    title: 'Syntax Editor',
    editorAria: 'Infographic Syntax Editor',
    configTitle: 'Config',
    templateLabel: 'Template',
    themeLabel: 'Theme',
    paletteLabel: 'Palette',
  },
};

export function EditorPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const texts = useLocaleBundle(TRANSLATIONS);
  const templates = useMemo(() => getTemplates().sort(), []);
  const themes = useMemo(() => getThemes().sort(), []);
  const palettes = useMemo(() => getPaletteNames().sort(), []);

  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedPalette, setSelectedPalette] = useState('');

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

  // Create linter function for CodeMirror diagnostics
  const linter = useCallback(
    (view: EditorView): Diagnostic[] => {
      const content = view.state.doc.toString();
      const {errors, options} = parseSyntax(content);
      const diagnostics: Diagnostic[] = errors.map((error: SyntaxError) => {
        // Calculate position from line number
        const line = error.line - 1; // Convert 1-indexed to 0-indexed
        const lineObj = view.state.doc.line(Math.max(1, Math.min(line + 1, view.state.doc.lines)));
        const from = lineObj.from;
        const to = lineObj.to;

        return {
          from,
          to,
          severity: 'error' as const,
          message: `${error.code}: ${error.message}${error.raw ? ` (${error.raw})` : ''}`,
        };
      });

      // Check if template exists
      if (options.template) {
        const availableTemplates = templates;
        if (!availableTemplates.includes(options.template)) {
          // Find the line with "infographic [template-name]"
          const lines = content.split('\n');
          const templateLineIndex = lines.findIndex(line =>
            line.trim().startsWith('infographic ') && line.includes(options.template!)
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
    // Replace the template in the syntax
    const lines = value.split('\n');
    if (lines[0].startsWith('infographic ')) {
      lines[0] = `infographic ${template}`;
      onChange(lines.join('\n'));
    } else {
      // Insert at the beginning if no template line exists
      onChange(`infographic ${template}\n${value}`);
    }
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    // Update or insert theme in syntax
    const lines = value.split('\n');
    const themeLineIndex = lines.findIndex((line) => line.trim().startsWith('theme'));

    if (themeLineIndex >= 0) {
      // Replace existing theme line
      const indent = lines[themeLineIndex].match(/^\s*/)?.[0] || '';
      lines[themeLineIndex] = `${indent}theme ${theme}`;
    } else {
      // Find insertion point (after infographic/template, before data)
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('infographic ') || lines[i].trim().startsWith('template ')) {
          insertIndex = i + 1;
        }
        if (lines[i].trim().startsWith('data')) {
          break;
        }
      }
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
        lines.splice(paletteLineIndex, endIndex - paletteLineIndex, `${indent}palette ${palette}`);
      } else {
        // It's "palette value" format, just replace the line
        lines[paletteLineIndex] = `${indent}palette ${palette}`;
      }
    } else {
      // No existing palette, insert new one
      const themeLineIndex = lines.findIndex((line) => line.trim().startsWith('theme'));
      if (themeLineIndex >= 0) {
        const indent = lines[themeLineIndex].match(/^\s*/)?.[0] || '';
        lines.splice(themeLineIndex + 1, 0, `${indent}  palette ${palette}`);
      } else {
        // Insert theme with palette
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('infographic ') || lines[i].trim().startsWith('template ')) {
            insertIndex = i + 1;
          }
          if (lines[i].trim().startsWith('data')) {
            break;
          }
        }
        lines.splice(insertIndex, 0, `theme`, `  palette ${palette}`);
      }
    }
    onChange(lines.join('\n'));
  };

  return (
    <div className="bg-card dark:bg-card-dark rounded-lg shadow-lg p-4 flex flex-col">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold text-primary dark:text-primary-dark">
          {texts.title}
        </h2>
      </div>
      <div className="flex-1 border border-border dark:border-border-dark rounded overflow-hidden mb-4">
        <CodeEditor
          ariaLabel={texts.editorAria}
          className="h-full"
          language="yaml"
          onChange={onChange}
          value={value}
          linterFn={linter}
        />
      </div>
      <div className="border-t border-border dark:border-border-dark pt-4">
        <h3 className="text-sm font-semibold text-primary dark:text-primary-dark mb-3">
          {texts.configTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="template-select"
              className="text-xs text-secondary dark:text-secondary-dark">
              {texts.templateLabel}
            </label>
            <select
              id="template-select"
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="px-3 py-1.5 text-sm bg-wash dark:bg-wash-dark border border-border dark:border-border-dark rounded text-primary dark:text-primary-dark focus:outline-none focus:ring-2 focus:ring-link dark:focus:ring-link-dark">
              {templates.map((template) => (
                <option key={template} value={template}>
                  {template}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="theme-select"
              className="text-xs text-secondary dark:text-secondary-dark">
              {texts.themeLabel}
            </label>
            <select
              id="theme-select"
              value={selectedTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="px-3 py-1.5 text-sm bg-wash dark:bg-wash-dark border border-border dark:border-border-dark rounded text-primary dark:text-primary-dark focus:outline-none focus:ring-2 focus:ring-link dark:focus:ring-link-dark">
              <option value="">default</option>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="palette-select"
              className="text-xs text-secondary dark:text-secondary-dark">
              {texts.paletteLabel}
            </label>
            <select
              id="palette-select"
              value={selectedPalette}
              onChange={(e) => handlePaletteChange(e.target.value)}
              className="px-3 py-1.5 text-sm bg-wash dark:bg-wash-dark border border-border dark:border-border-dark rounded text-primary dark:text-primary-dark focus:outline-none focus:ring-2 focus:ring-link dark:focus:ring-link-dark">
              <option value="">default</option>
              {palettes.map((palette) => (
                <option key={palette} value={palette}>
                  {palette}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
