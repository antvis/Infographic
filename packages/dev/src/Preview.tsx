import { getTemplate, getTemplates, ThemeConfig } from '@antv/infographic';
import Editor from '@monaco-editor/react';
import { Card, Checkbox, ColorPicker, Form, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Infographic } from './Infographic';
import { COMPARE_DATA, HIERARCHY_DATA, LIST_DATA, SWOT_DATA } from './data';
import { getStoredValues, setStoredValues } from './utils/storage';

const templates = getTemplates();
const STORAGE_KEY = 'preview-form-values';

const DATA = {
  list: { label: '列表数据', value: LIST_DATA },
  hierarchy: { label: '层级数据', value: HIERARCHY_DATA },
  compare: { label: '对比数据', value: COMPARE_DATA },
  swot: { label: 'SWOT 数据', value: SWOT_DATA },
} as const;

export const Preview = () => {
  // Get stored values with validation
  const storedValues = getStoredValues<{
    template: string;
    data: keyof typeof DATA;
    theme: 'light' | 'dark';
    colorPrimary: string;
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
  const initialColorPrimary = storedValues?.colorPrimary || '#1890ff';
  const initialEnablePalette = storedValues?.enablePalette || false;

  const [template, setTemplate] = useState(initialTemplate);
  const [data, setData] = useState<keyof typeof DATA>(initialData);
  const [theme, setTheme] = useState<string>(initialTheme);
  const [colorPrimary, setColorPrimary] = useState(initialColorPrimary);
  const [enablePalette, setEnablePalette] = useState(initialEnablePalette);
  const [customData, setCustomData] = useState<string>(() =>
    JSON.stringify(DATA[initialData].value, null, 2),
  );
  const [dataError, setDataError] = useState<string>('');

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    const config: ThemeConfig = {
      colorPrimary: initialColorPrimary,
    };
    if (initialTheme === 'dark') {
      config.colorBg = '#333';
    }
    if (initialEnablePalette) {
      config.palette = [
        '#1783FF',
        '#00C9C9',
        '#F0884D',
        '#D580FF',
        '#7863FF',
        '#60C42D',
        '#BD8F24',
        '#FF80CA',
        '#2491B3',
        '#17C76F',
        '#70CAF8',
      ];
    }
    return config;
  });

  // Save to localStorage when values change
  useEffect(() => {
    setStoredValues(STORAGE_KEY, {
      template,
      data,
      theme,
      colorPrimary,
      enablePalette,
    });
  }, [template, data, theme, colorPrimary, enablePalette]);

  // Get current template configuration
  const templateConfig = useMemo(() => {
    const config = getTemplate(template);
    return config ? JSON.stringify(config, null, 2) : '{}';
  }, [template]);

  // Auto-select appropriate data type based on template
  useEffect(() => {
    if (template.startsWith('hierarchy-')) {
      setData('hierarchy');
    } else if (template.startsWith('compare-')) {
      setData('compare');
    } else {
      setData('list');
    }
  }, [template]);

  // Update custom data when data type changes
  useEffect(() => {
    setCustomData(JSON.stringify(DATA[data].value, null, 2));
    setDataError('');
  }, [data]);

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
        setTemplate(nextTemplate);
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
                <Select
                  showSearch
                  value={template}
                  options={templates.map((value) => ({ label: value, value }))}
                  onChange={(value) => setTemplate(value)}
                />
              </Form.Item>
              <Form.Item label="数据">
                <Select
                  value={data}
                  options={Object.entries(DATA).map(([key, { label }]) => ({
                    label,
                    value: key,
                  }))}
                  onChange={(value) => setData(value)}
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
                  onChange={(color) => {
                    const hexColor = color.toHexString();
                    setColorPrimary(hexColor);
                    setThemeConfig((pre) => ({
                      ...pre,
                      colorPrimary: hexColor,
                    }));
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Checkbox
                  checked={enablePalette}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setEnablePalette(checked);
                    setThemeConfig((pre) => ({
                      ...pre,
                      palette: checked
                        ? [
                            '#1783FF',
                            '#00C9C9',
                            '#F0884D',
                            '#D580FF',
                            '#7863FF',
                            '#60C42D',
                            '#BD8F24',
                            '#FF80CA',
                            '#2491B3',
                            '#17C76F',
                            '#70CAF8',
                          ]
                        : [],
                    }));
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
              padding: 20,
              theme,
              themeConfig,
            }}
          />
        </Card>
      </div>
    </div>
  );
};
