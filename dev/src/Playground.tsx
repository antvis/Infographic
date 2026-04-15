import Editor from '@monaco-editor/react';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { Infographic } from './Infographic';
import { getStoredValues, setStoredValues } from './utils/storage';

const STORAGE_KEY = 'playground-code';

const DEFAULT_CODE = `infographic list-row-horizontal-icon-arrow
data
  title 信息图示例
  desc 粘贴或编辑左侧语法，右侧实时预览
  lists
    - label 项目一
      value 12.3
      desc 描述文字
      icon company-021_v1_lineal
    - label 项目二
      value 8.6
      desc 描述文字
      icon antenna-bars-5_v1_lineal
    - label 项目三
      value 15.1
      desc 描述文字
      icon achievment-050_v1_lineal
`;

export const Playground = () => {
  const [code, setCode] = useState(() => {
    const saved = getStoredValues<{ code: string }>(STORAGE_KEY);
    return saved?.code || DEFAULT_CODE;
  });
  const [options, setOptions] = useState(code);

  // Debounce: update preview 500ms after last edit, also persist
  useEffect(() => {
    const timer = setTimeout(() => {
      setOptions(code);
      setStoredValues(STORAGE_KEY, { code });
    }, 500);
    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: 16,
        flex: 1,
        overflow: 'hidden',
      }}
    >
      <div style={{ width: 420, display: 'flex', flexDirection: 'column' }}>
        <Card
          title="语法输入"
          size="small"
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          styles={{
            body: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            },
          }}
        >
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              value={code}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
              onChange={(value) => setCode(value || '')}
            />
          </div>
        </Card>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <Card title="预览" size="small" style={{ height: '100%' }}>
          <Infographic options={options} />
        </Card>
      </div>
    </div>
  );
};
