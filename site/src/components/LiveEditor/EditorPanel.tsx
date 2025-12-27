import {useLocaleBundle} from 'hooks/useTranslation';
import {CodeEditor} from 'components/MDX/CodeEditor';
import {getTemplates, parseSyntax} from '@antv/infographic';
import {useMemo, useState, useCallback} from 'react';
import type {Diagnostic} from '@codemirror/lint';
import type {EditorView} from '@codemirror/view';
import type {SyntaxError} from '@antv/infographic';

const TRANSLATIONS = {
  'zh-CN': {
    title: '语法编辑器',
    editorAria: 'Infographic 语法编辑器',
    templateLabel: '模板',
  },
  'en-US': {
    title: 'Syntax Editor',
    editorAria: 'Infographic syntax editor',
    templateLabel: 'Template',
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
  const [selectedTemplate, setSelectedTemplate] = useState('');

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

  return (
    <div className="bg-card dark:bg-card-dark rounded-lg shadow-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary dark:text-primary-dark">
          {texts.title}
        </h2>
        <div className="flex items-center gap-2">
          <label
            htmlFor="template-select"
            className="text-sm text-secondary dark:text-secondary-dark">
            {texts.templateLabel}:
          </label>
          <select
            id="template-select"
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="px-3 py-1.5 text-sm bg-wash dark:bg-wash-dark border border-border dark:border-border-dark rounded text-primary dark:text-primary-dark focus:outline-none focus:ring-2 focus:ring-link dark:focus:ring-link-dark">
            <option value="">-- Select --</option>
            {templates.map((template) => (
              <option key={template} value={template}>
                {template}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex-1 border border-border dark:border-border-dark rounded overflow-hidden">
        <CodeEditor
          ariaLabel={texts.editorAria}
          className="h-full"
          language="yaml"
          onChange={onChange}
          value={value}
          linterFn={linter}
        />
      </div>
    </div>
  );
}
