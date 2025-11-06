import { Infographic, InfographicOptions } from '@antv/infographic';
import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

const encode = (options: InfographicOptions): string => {
  return JSON.stringify(options, null, 2);
};

const examples = [
  {
    name: '金字塔图',
    icon: '📊',
    code: encode({
      template: 'sequence-pyramid-simple',
      data: {
        title: '企业数字化转型层级',
        desc: '从基础设施到战略创新的五层进阶路径',
        items: [
          {
            label: '战略创新',
            desc: '数据驱动决策，引领行业变革',
            icon: 'icon:mdi/lightbulb-on',
          },
          {
            label: '智能运营',
            desc: 'AI赋能业务，实现自动化管理',
            icon: 'icon:mdi/robot',
          },
          {
            label: '数据整合',
            desc: '打通数据孤岛，建立统一平台',
            icon: 'icon:mdi/database-sync',
          },
          {
            label: '流程优化',
            desc: '数字化核心业务流程和协作',
            icon: 'icon:mdi/workflow',
          },
          {
            label: '基础设施',
            desc: '构建云计算和网络基础架构',
            icon: 'icon:mdi/server-network',
          },
        ],
      },
      themeConfig: {
        palette: 'antv',
      },
    }),
  },
  {
    name: '时间线',
    icon: '⏱️',
    code: encode({
      template: 'list-row-horizontal-icon-arrow',
      data: {
        title: '互联网技术演进史',
        desc: '从Web 1.0到AI时代的关键里程碑',
        items: [
          {
            time: '1991',
            label: '万维网诞生',
            desc: 'Tim Berners-Lee发布首个网站，开启互联网时代',
            icon: 'icon:mdi/web',
          },
          {
            time: '2004',
            label: 'Web 2.0兴起',
            desc: '社交媒体和用户生成内容成为主流',
            icon: 'icon:mdi/account-multiple',
          },
          {
            time: '2007',
            label: '移动互联网',
            desc: 'iPhone发布，智能手机改变世界',
            icon: 'icon:mdi/cellphone',
          },
          {
            time: '2015',
            label: '云原生时代',
            desc: '容器化和微服务架构广泛应用',
            icon: 'icon:mdi/cloud',
          },
          {
            time: '2020',
            label: '低代码平台',
            desc: '可视化开发降低技术门槛',
            icon: 'icon:mdi/application-brackets',
          },
          {
            time: '2023',
            label: 'AI大模型',
            desc: 'ChatGPT引爆生成式AI革命',
            icon: 'icon:mdi/brain',
          },
        ],
      },
      themeConfig: {
        palette: 'antv',
      },
    }),
  },
  {
    name: '步骤图',
    icon: '🔄',
    code: encode({
      template: 'sequence-ascending-stairs-3d-underline-text',
      data: {
        title: '咖啡冲泡完美指南',
        desc: '掌握手冲咖啡的四个关键步骤',
        items: [
          {
            label: '研磨咖啡豆',
            desc: '根据冲泡方式选择合适的研磨粗细度',
            icon: 'icon:mdi/coffee-maker',
          },
          {
            label: '预热器具',
            desc: '用热水温润滤杯和咖啡壶',
            icon: 'icon:mdi/fire',
          },
          {
            label: '注水萃取',
            desc: '分段注水，控制水温和流速',
            icon: 'icon:mdi/water',
          },
          {
            label: '品鉴享用',
            desc: '感受香气和风味的层次变化',
            icon: 'icon:mdi/cup',
          },
        ],
      },
      themeConfig: {
        palette: 'antv',
      },
    }),
  },
];

export default function CodePlayground() {
  const [selectedExample, setSelectedExample] = useState(0);
  const [code, setCode] = useState(examples[0].code);
  const [error, setError] = useState('');
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    renderChart();
  }, [code]);

  const renderChart = () => {
    if (!svgContainerRef.current) return;

    try {
      const config = JSON.parse(code);
      svgContainerRef.current.innerHTML = '';

      const chart = new Infographic({
        container: svgContainerRef.current,
        ...config,
      });

      chart.render();
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Invalid JSON or configuration',
      );
    }
  };

  const handleExampleChange = (index: number) => {
    setSelectedExample(index);
    setCode(examples[index].code);
  };

  const handleAIDemo = () => {
    window.open('/examples/ai-demo', '_blank');
  };

  return (
    <div className={styles.playground}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>🎮 试试看</h3>
          <p className={styles.subtitle}>实时编辑配置，即刻预览效果</p>
        </div>
        <div className={styles.controlsRow}>
          <div className={styles.tabGroup}>
            <span className={styles.groupLabel}>示例：</span>
            <div className={styles.tabs}>
              {examples.map((example, index) => (
                <button
                  key={index}
                  className={`${styles.tab} ${selectedExample === index ? styles.tabActive : ''}`}
                  onClick={() => handleExampleChange(index)}
                >
                  <span className={styles.tabIcon}>{example.icon}</span>
                  <span className={styles.tabName}>{example.name}</span>
                </button>
              ))}
              <button className={styles.tab} onClick={handleAIDemo}>
                <span className={styles.tabIcon}>🤖</span>
                <span className={styles.tabName}>AI 生成</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.editorPanel}>
          <div className={styles.panelHeader}>
            <span>配置项</span>
            <span className={styles.language}>JSON</span>
          </div>
          <Editor
            height="500px"
            defaultLanguage="json"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>
        <div className={styles.previewPanel}>
          <div className={styles.panelHeader}>
            <span>实时预览</span>
          </div>
          <div className={styles.previewContent}>
            {error && <div className={styles.error}>⚠️{error}</div>}
            <div ref={svgContainerRef} className={styles.svgContainer}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
