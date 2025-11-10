import { getTemplate, getTemplates } from '@antv/infographic';
import Editor from '@monaco-editor/react';
import { Card, Checkbox, Form, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Infographic } from './Infographic';
import { COMPARE_DATA, HIERARCHY_DATA, LIST_DATA, SWOT_DATA } from './data';
import { getSearchParam, setSearchParam } from './utils/search-params';

const templates = getTemplates();

const DATA = {
  list: { label: '列表数据', value: LIST_DATA },
  hierarchy: { label: '层级数据', value: HIERARCHY_DATA },
  compare: { label: '对比数据', value: COMPARE_DATA },
  swot: { label: 'SWOT 数据', value: SWOT_DATA },
} as const;

export const Preview = () => {
  // 验证模板是否存在，如果不存在则使用默认模板
  const initialTemplate = (() => {
    const paramTemplate = getSearchParam('template');
    if (paramTemplate && templates.includes(paramTemplate)) {
      return paramTemplate;
    }
    return templates[0];
  })();

  const [template, setTemplate] = useState(initialTemplate);
  const [themeConfig, setThemeConfig] = useState({});
  const [data, setData] = useState<keyof typeof DATA>('list');

  // Get current template configuration
  const templateConfig = useMemo(() => {
    const config = getTemplate(template);
    return config ? JSON.stringify(config, null, 2) : '{}';
  }, [template]);

  useEffect(() => {
    if (template.startsWith('hierarchy-')) {
      setData('hierarchy');
    } else if (template.startsWith('compare-')) {
      setData('compare');
    } else {
      setData('list');
    }
  }, [template]);

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
        setSearchParam('template', nextTemplate);
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
                  onChange={(value) => {
                    setTemplate(value);
                    setSearchParam('template', value);
                  }}
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
              <Form.Item label="主题" name="theme">
                <Select
                  defaultValue="light"
                  options={[
                    { label: '亮色', value: 'light' },
                    { label: '暗色', value: 'dark' },
                  ]}
                  onChange={(theme) => {
                    setThemeConfig((pre) => ({
                      ...pre,
                      colorBg: theme === 'dark' ? '#333' : '#fff',
                    }));
                  }}
                />
              </Form.Item>
              <Form.Item
                label="色板"
                name="enablePalette"
                valuePropName="checked"
              >
                <Checkbox
                  onChange={(e) => {
                    const enablePalette = e.target.checked;
                    setThemeConfig((pre) => ({
                      ...pre,
                      palette: enablePalette
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
              data: DATA[data].value,
              padding: 20,
              themeConfig,
            }}
          />
        </Card>
      </div>
    </div>
  );
};
