import {useLocaleBundle} from 'hooks/useTranslation';
import {CodeEditor} from 'components/MDX/CodeEditor';
import {getTemplates} from '@antv/infographic';
import {useMemo, useState} from 'react';

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
        />
      </div>
    </div>
  );
}
