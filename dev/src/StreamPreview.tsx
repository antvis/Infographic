import Editor from '@monaco-editor/react';
import { Button, Card, Radio, Space } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Infographic } from './Infographic';

const STREAM_PRESETS = [
  { key: 'slowest', label: '最慢', stepPercent: 1, intervalMs: 160 },
  { key: 'slow', label: '慢', stepPercent: 2, intervalMs: 120 },
  { key: 'normal', label: '标准', stepPercent: 5, intervalMs: 80 },
  { key: 'fast', label: '快', stepPercent: 8, intervalMs: 60 },
  { key: 'fastest', label: '最快', stepPercent: 12, intervalMs: 40 },
];

const CODE_PRESETS = [
  {
    key: 'list',
    label: '列表',
    code: `infographic list-row-horizontal-icon-arrow
data
  title 客户增长引擎
  desc 多渠道触达与复购提升
  lists
    - label 线索获取
      value 18.6
      desc 渠道投放与内容获客
      icon company-021_v1_lineal
    - label 转化提效
      value 12.4
      desc 线索评分与自动跟进
      icon antenna-bars-5_v1_lineal
    - label 复购提升
      value 9.8
      desc 会员体系与权益运营
      icon 3d-file-015_v1_lineal
    - label 口碑传播
      value 6.2
      desc 社群激励与推荐裂变
      icon achievment-050_v1_lineal
    - label 客户成功
      value 7.1
      desc 培训支持与使用激活
      icon account-book-025_v1_lineal
    - label 产品增长
      value 10.2
      desc 试用转化与功能引导
      icon activities-037_v1_lineal
    - label 数据洞察
      value 8.5
      desc 关键指标与归因分析
      icon 3d-file-015_v1_lineal
    - label 生态合作
      value 5.4
      desc 联合营销与资源互换
      icon company-021_v1_lineal
`,
  },
  {
    key: 'compare',
    label: '对比',
    code: `infographic compare-hierarchy-left-right-circle-node-pill-badge
  data
    title 方案对比
    desc 自研平台 vs 采购方案
    compares
      - label 自研平台
        children
          - label 研发周期
            desc 6-8个月
            icon wrench
          - label 灵活扩展
            desc 组件化与可插拔
            icon puzzle
          - label 成本结构
            desc 前期投入高
            icon wallet
      - label 采购方案
        children
          - label 上线速度
            desc 2-4周
            icon lightning
          - label 能力边界
            desc 依赖厂商支持
            icon link
          - label 成本结构
            desc 订阅费用可控
            icon receipt
  `,
  },
  {
    key: 'hierarchy',
    label: '层级',
    code: `infographic hierarchy-mindmap-level-gradient-compact-card
data
  title 组织结构
  desc 产品增长团队
  root
    label 产品增长
    icon company-021_v1_lineal
    children
      - label 增长策略
        desc 指标与实验设计
        icon antenna-bars-5_v1_lineal
        children
          - label 漏斗拆解
            icon achievment-050_v1_lineal
          - label 增长实验
            icon 3d-file-015_v1_lineal
      - label 用户运营
        desc 生命周期运营
        icon activities-037_v1_lineal
        children
          - label 新手引导
            icon account-book-025_v1_lineal
          - label 召回机制
            icon activities-037_v1_lineal
      - label 数据分析
        desc 看板与归因
        icon antenna-bars-5_v1_lineal
        children
          - label 指标体系
            icon company-021_v1_lineal
          - label 归因模型
            icon 3d-file-015_v1_lineal
`,
  },
];

const getDefaultCode = () => CODE_PRESETS[0].code;

export const StreamPreview = () => {
  const [code, setCode] = useState(getDefaultCode);
  const [options, setOptions] = useState(code);
  const [isStreaming, setIsStreaming] = useState(false);
  const [speedPreset, setSpeedPreset] = useState('normal');
  const [codePreset, setCodePreset] = useState(CODE_PRESETS[0].key);
  const streamTimerRef = useRef<number | null>(null);
  const currentPreset = STREAM_PRESETS.find((item) => item.key === speedPreset);

  const stopStreaming = useCallback(() => {
    if (streamTimerRef.current) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const handleRender = useCallback(() => {
    stopStreaming();
    setOptions(code);
  }, [code, stopStreaming]);

  const handleStreamRender = useCallback(() => {
    stopStreaming();
    const fullText = code;
    if (!fullText) {
      setOptions('');
      return;
    }
    setIsStreaming(true);
    let progress = 0;
    streamTimerRef.current = window.setInterval(() => {
      progress = Math.min(100, progress + (currentPreset?.stepPercent ?? 5));
      const nextLength = Math.floor((fullText.length * progress) / 100);
      setOptions(fullText.slice(0, nextLength));
      if (progress >= 100) {
        stopStreaming();
      }
    }, currentPreset?.intervalMs ?? 80);
  }, [code, stopStreaming, currentPreset]);

  const handlePresetChange = useCallback(
    (nextPreset: string) => {
      const next = CODE_PRESETS.find((item) => item.key === nextPreset);
      if (!next) return;
      stopStreaming();
      setCodePreset(nextPreset);
      setCode(next.code);
      setOptions(next.code);
    },
    [stopStreaming],
  );

  useEffect(() => () => stopStreaming(), [stopStreaming]);

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, flex: 1 }}>
      <div
        style={{
          width: 420,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflow: 'hidden',
        }}
      >
        <Card title="Preset Code" size="small">
          <Radio.Group
            value={codePreset}
            options={CODE_PRESETS.map(({ key, label }) => ({
              label,
              value: key,
            }))}
            onChange={(e) => handlePresetChange(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            disabled={isStreaming}
          />
        </Card>
        <Card title="Code Input" size="small">
          <div style={{ height: 300 }}>
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              value={code}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
              onChange={(value) => setCode(value || '')}
            />
          </div>
        </Card>
        <Space>
          <Button type="primary" onClick={handleRender}>
            渲染
          </Button>
          <Button onClick={handleStreamRender} disabled={isStreaming}>
            流式渲染
          </Button>
        </Space>
        <Card title="Streaming Speed" size="small">
          <Radio.Group
            value={speedPreset}
            options={STREAM_PRESETS.map(({ key, label }) => ({
              label,
              value: key,
            }))}
            onChange={(e) => setSpeedPreset(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            disabled={isStreaming}
          />
        </Card>
        <Card title="Streaming Output" size="small" style={{ flex: 1 }}>
          <div style={{ height: 260 }}>
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              value={options}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>
        </Card>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <Card title="Preview" size="small" style={{ height: '100%' }}>
          <Infographic options={options} />
        </Card>
      </div>
    </div>
  );
};
