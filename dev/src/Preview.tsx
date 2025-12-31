import { getTemplate, getTemplates, ThemeConfig } from '@antv/infographic';
import Editor from '@monaco-editor/react';
import { Button, Card, Checkbox, ColorPicker, Form, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Infographic } from './Infographic';
import {
  COMPARE_DATA,
  HIERARCHY_DATA,
  LIST_DATA,
  SWOT_DATA,
  WORD_CLOUD_DATA,
} from './data';
import { getStoredValues, setStoredValues } from './utils/storage';

const templates = getTemplates();
const STORAGE_KEY = 'preview-form-values';

const DATA = {
  list: { label: '列表数据', value: LIST_DATA },
  hierarchy: { label: '层级数据', value: HIERARCHY_DATA },
  compare: { label: '对比数据', value: COMPARE_DATA },
  swot: { label: 'SWOT 数据', value: SWOT_DATA },
  wordcloud: { label: '词云数据', value: WORD_CLOUD_DATA },
} as const;
const TEMPLATE_DATA_MATCHERS: Array<[string, keyof typeof DATA]> = [
  ['hierarchy-', 'hierarchy'],
  ['compare-', 'compare'],
  ['swot-', 'swot'],
  ['chart-wordcloud', 'wordcloud'],
];
const getDefaultDataString = (key: keyof typeof DATA) =>
  JSON.stringify(DATA[key].value, null, 2);
const getDataByTemplate = (nextTemplate: string): keyof typeof DATA => {
  for (const [prefix, dataKey] of TEMPLATE_DATA_MATCHERS) {
    if (nextTemplate.startsWith(prefix)) {
      return dataKey;
    }
  }
  return 'list';
};

export const Preview = () => {
  // Get stored values with validation
  const storedValues = getStoredValues<{
    template: string;
    data: keyof typeof DATA;
    theme: 'light' | 'dark' | 'hand-drawn';
    colorPrimary: string;
    enablePrimary: boolean;
    enablePalette: boolean;
  }>(STORAGE_KEY, (stored) => {
    const fallbacks: any = {};

    // Validate template
    if (stored.template && !templates.includes(stored.template)) {
      fallbacks.template = templates[0];
    }

    // Validate data
    const dataKeys = Object.keys(DATA) as (keyof typeof DATA)[];
    if (stored.data && !dataKeys.includes(stored.data)) {
      fallbacks.data = dataKeys[0];
    }

    return fallbacks;
  });

  const initialTemplate = storedValues?.template || templates[0];
  const initialData = storedValues?.data || 'list';
  const initialTheme = storedValues?.theme || 'light';
  const initialColorPrimary = storedValues?.colorPrimary || '#FF356A';
  const initialEnablePrimary = storedValues?.enablePrimary ?? true;
  const initialEnablePalette = storedValues?.enablePalette || false;

  const [template, setTemplate] = useState(initialTemplate);
  const [data, setData] = useState<keyof typeof DATA>(initialData);
  const [theme, setTheme] = useState<string>(initialTheme);
  const [colorPrimary, setColorPrimary] = useState(initialColorPrimary);
  const [enablePrimary, setEnablePrimary] = useState(initialEnablePrimary);
  const [enablePalette, setEnablePalette] = useState(initialEnablePalette);
  const [customData, setCustomData] = useState<string>(() =>
    JSON.stringify(DATA[initialData].value, null, 2),
  );
  const [dataError, setDataError] = useState<string>('');

  const themeConfig = useMemo<ThemeConfig | undefined>(() => {
    const config: ThemeConfig = {};
    if (enablePrimary) {
      config.colorPrimary = colorPrimary;
    }
    if (theme === 'dark') {
      config.colorBg = '#333';
    }
    if (enablePalette) {
      config.palette = [
        '#f94144',
        '#f3722c',
        '#f8961e',
        '#f9c74f',
        '#90be6d',
        '#43aa8b',
        '#577590',
      ];
    }
    return config;
  }, [enablePrimary, colorPrimary, theme, enablePalette]);

  // Save to localStorage when values change
  useEffect(() => {
    setStoredValues(STORAGE_KEY, {
      template,
      data,
      theme,
      colorPrimary,
      enablePrimary,
      enablePalette,
    });
  }, [template, data, theme, colorPrimary, enablePrimary, enablePalette]);

  // Get current template configuration
  const templateConfig = useMemo(() => {
    const config = getTemplate(template);
    return config ? JSON.stringify(config, null, 2) : '{}';
  }, [template, data]);

  const applyTemplate = (nextTemplate: string) => {
    const nextData = getDataByTemplate(nextTemplate);
    setTemplate(nextTemplate);
    if (nextData !== data) {
      setData(nextData);
      setCustomData(getDefaultDataString(nextData));
      setDataError('');
    }
  };

  const handleCopyTemplate = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(template);
        return;
      }

      const textarea = document.createElement('textarea');
      textarea.value = template;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (error) {
      console.warn('Failed to copy template name.', error);
    }
  };

  // Parse custom data
  const parsedData = useMemo(() => {
    try {
      const parsed = JSON.parse(customData);
      setDataError('');
      return parsed;
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Invalid JSON');
      return DATA[data].value;
    }
  }, [customData, data]);

  // 键盘导航：上下或左右方向键切换模板
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowRight'
      ) {
        const currentIndex = templates.indexOf(template);
        let nextIndex: number;

        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          // 上一个模板
          nextIndex =
            currentIndex > 0 ? currentIndex - 1 : templates.length - 1;
        } else {
          // 下一个模板
          nextIndex =
            currentIndex < templates.length - 1 ? currentIndex + 1 : 0;
        }

        const nextTemplate = templates[nextIndex];
        applyTemplate(nextTemplate);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [template]);

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, flex: 1 }}>
      {/* Left Panel - Configuration */}
      <div
        style={{
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            overflow: 'auto',
            paddingRight: 4,
          }}
        >
          <Card title="配置" size="small">
            <Form
              layout="horizontal"
              size="small"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              colon={false}
            >
              <Form.Item label="模板">
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <Select
                    showSearch
                    value={template}
                    options={templates.map((value) => ({
                      label: value,
                      value,
                    }))}
                    onChange={(value) => applyTemplate(value)}
                    style={{ flex: 1, minWidth: 0 }}
                  />
                  <Button
                    size="small"
                    onClick={handleCopyTemplate}
                    style={{ flex: 'none' }}
                  >
                    复制
                  </Button>
                </div>
              </Form.Item>
              <Form.Item label="数据">
                <Select
                  value={data}
                  options={Object.entries(DATA).map(([key, { label }]) => ({
                    label,
                    value: key,
                  }))}
                  onChange={(value) => {
                    setData(value);
                    setCustomData(getDefaultDataString(value));
                    setDataError('');
                  }}
                />
              </Form.Item>
              <Form.Item label="主题">
                <Select
                  value={theme}
                  options={[
                    { label: '亮色', value: 'light' },
                    { label: '暗色', value: 'dark' },
                    { label: '手绘风格', value: 'hand-drawn' },
                  ]}
                  onChange={(newTheme: string) => {
                    setTheme(newTheme);
                  }}
                />
              </Form.Item>
              <Form.Item label="主色">
                <ColorPicker
                  value={colorPrimary}
                  disabled={!enablePrimary}
                  onChange={(color) => {
                    const hexColor = color.toHexString();
                    setColorPrimary(hexColor);
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Checkbox
                  checked={enablePrimary}
                  onChange={(e) => setEnablePrimary(e.target.checked)}
                >
                  启用主色
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Checkbox
                  checked={enablePalette}
                  onChange={(e) => {
                    setEnablePalette(e.target.checked);
                  }}
                >
                  启用色板
                </Checkbox>
              </Form.Item>
            </Form>
          </Card>

          <Card
            title="数据编辑器"
            size="small"
            extra={
              dataError && (
                <span style={{ color: '#ff4d4f', fontSize: 12 }}>
                  {dataError}
                </span>
              )
            }
          >
            <div style={{ height: 300 }}>
              <Editor
                height="100%"
                defaultLanguage="json"
                value={customData}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  contextmenu: true,
                  formatOnPaste: true,
                  formatOnType: true,
                }}
                onChange={(value) => setCustomData(value || '')}
              />
            </div>
          </Card>

          <Card title="模板配置" size="small">
            <div style={{ height: 300 }}>
              <Editor
                height="100%"
                defaultLanguage="json"
                value={templateConfig}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  contextmenu: false,
                }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Card title="预览" size="small" style={{ height: '100%' }}>
          <Infographic
            options={{
              template,
              data: parsedData,
              theme,
              themeConfig,
              editable: true,
            }}
          />
        </Card>
      </div>
    </div>
  );
};
