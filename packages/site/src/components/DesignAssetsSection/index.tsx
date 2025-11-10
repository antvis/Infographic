import {
  getItems,
  getStructures,
  getTemplates,
  InfographicOptions,
  registerPalette,
} from '@antv/infographic';
import { useEffect, useMemo, useState } from 'react';
import Infographic from '../Infographic';
import SectionHeader from '../SectionHeader';
import styles from './styles.module.css';

registerPalette('colorful', [
  '#1890ff',
  '#52c41a',
  '#fa8c16',
  '#722ed1',
  '#eb2f96',
  '#13c2c2',
  '#faad14',
  '#2f54eb',
]);

function roundUpToTen(num: number) {
  return Math.ceil(num / 10) * 10;
}

const themeExamples: {
  name: string;
  label: string;
  description: string;
  icon: string;
  options?: Partial<InfographicOptions>;
}[] = [
  {
    name: 'Dark',
    label: '深色主题',
    description: '沉浸式深色风格，适合夜间或暗色界面',
    icon: '🌑',
    options: {
      theme: 'dark',
      template: 'quadrant-quarter-circular',
      themeConfig: {
        palette: 'colorful',
      },
      data: {
        items: [
          {
            icon: 'icon:mdi/fire-alert',
            label: '紧急且重要',
            desc: '需要立即处理的关键任务，如系统故障修复、重要客户投诉处理',
          },
          {
            icon: 'icon:mdi/target-arrow',
            label: '重要但不紧急',
            desc: '对长期目标有重大影响的事项，如技术架构优化、团队能力建设',
          },
          {
            icon: 'icon:mdi/clock-alert-outline',
            label: '紧急但不重要',
            desc: '需要快速响应但影响有限的事务，如部分会议邀请、常规报告提交',
          },
          {
            icon: 'icon:mdi/calendar-remove',
            label: '不紧急且不重要',
            desc: '可以延后或委派的低优先级事项，如非关键的邮件回复、日常琐事',
          },
        ],
      },
    },
  },
  {
    name: 'Rough',
    label: '手绘风格',
    description: '自然手绘质感，适合轻松活泼的场景',
    icon: '✏️',
    options: {
      template: 'sequence-roadmap-vertical-simple',
      themeConfig: {
        palette: 'colorful',
        stylize: { type: 'rough' },
        base: {
          text: {
            'font-family': '851tegakizatsu',
          },
        },
      },
      data: {
        items: [
          {
            label: '创建账号',
            desc: '填写基本信息，设置用户名和密码完成注册',
            icon: 'icon:mdi/account-plus',
          },
          {
            label: '完善资料',
            desc: '上传头像，补充个人信息和偏好设置',
            icon: 'icon:mdi/account-edit',
          },
          {
            label: '验证身份',
            desc: '通过邮箱或手机号验证，确保账号安全',
            icon: 'icon:mdi/shield-check',
          },
          {
            label: '开始使用',
            desc: '探索平台功能，开启你的专属体验之旅',
            icon: 'icon:mdi/party-popper',
          },
        ],
      },
    },
  },
  {
    name: 'Complex',
    label: '色板及纹理',
    description: '丰富色彩搭配，辅以纹理效果，提升视觉层次',
    icon: '🎨',
    options: {
      template: 'list-sector-simple',
      themeConfig: {
        palette: 'spectral',
        stylize: { type: 'pattern', pattern: 'line' },
        item: {
          icon: { fill: '#333' },
          label: { fill: '#333' },
          desc: { fill: '#555', 'font-weight': 'bold' },
        },
      },
      data: {
        title: '产品全生命周期管理',
        items: [
          {
            label: '市场调研',
            desc: '分析市场趋势和竞争对手',
            icon: 'icon:mdi/chart-box',
          },
          {
            label: '用户画像',
            desc: '定义目标用户群体特征',
            icon: 'icon:mdi/account-group',
          },
          {
            label: '产品定位',
            desc: '明确产品核心价值主张',
            icon: 'icon:mdi/bullseye-arrow',
          },
          {
            label: '功能规划',
            desc: '设计产品功能和特性',
            icon: 'icon:mdi/puzzle',
          },
          {
            label: '原型设计',
            desc: '制作交互原型和视觉稿',
            icon: 'icon:mdi/palette',
          },
          {
            label: '技术开发',
            desc: '实现产品功能和性能',
            icon: 'icon:mdi/laptop',
          },
          {
            label: '测试优化',
            desc: '验证质量并持续改进',
            icon: 'icon:mdi/tune',
          },
          {
            label: '推广运营',
            desc: '市场推广和用户增长',
            icon: 'icon:mdi/trending-up',
          },
        ],
      },
    },
  },
];

export default function DesignAssetsSection() {
  const [activeTheme, setActiveTheme] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // 检测主题变化
  useEffect(() => {
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-theme');
      setIsDark(currentTheme === 'dark');
    };

    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const statsOptions: Partial<InfographicOptions> = useMemo(
    () => ({
      theme: isDark ? 'dark' : 'light',
      data: {
        items: [
          {
            label: '数据项设计',
            desc: '丰富数据项设计',
            value: getItems().length,
          },
          {
            label: '结构布局',
            desc: '多样结构布局',
            value: getStructures().length,
          },
          {
            label: '内置模版',
            desc: '开箱即用的模板',
            value: getTemplates().length,
          },
          { label: '开源免费', desc: 'MIT 协议', value: 100 },
        ],
      },
      design: {
        structure: {
          type: 'chart-column',
          valueFormatter: (v, d) => {
            const label = d.label as string;
            if (label === '开源免费') return `${v}%`;
            return `~${roundUpToTen(v)}`;
          },
        },
        item: 'simple',
      },
      themeConfig: {
        palette: 'colorful',
      },
    }),
    [isDark],
  );

  return (
    <section id="design-assets" className={styles.designAssetsSection}>
      <div className="container">
        <SectionHeader
          title="丰富设计资产"
          subtitle="海量组件、布局、主题，助力信息图创作"
        />

        {/* 统计数据展示 */}
        <div className={styles.statsContainer}>
          <div className={styles.statsChart}>
            <Infographic
              options={statsOptions}
              containerStyle={{ width: '100%', minHeight: '300px' }}
            />
          </div>
          <div className={styles.statsDescription}>
            <h3>开箱即用的资源库</h3>
            <ul className={styles.statsList}>
              <li>
                <span className={styles.statsIcon}>📊</span>
                <div>
                  <strong>{roundUpToTen(getItems().length)}+ 数据项设计</strong>
                  <p>覆盖图表、图标、文本等多种展示形式</p>
                </div>
              </li>
              <li>
                <span className={styles.statsIcon}>📐</span>
                <div>
                  <strong>
                    {roundUpToTen(getStructures().length)}+ 结构布局
                  </strong>
                  <p>支持列表、矩阵、时间轴、层级等多种布局</p>
                </div>
              </li>
              <li>
                <span className={styles.statsIcon}>🎯</span>
                <div>
                  <strong>
                    {roundUpToTen(getTemplates().length)}+ 内置模板
                  </strong>
                  <p>快速套用，极速产出专业信息图</p>
                </div>
              </li>
              <li>
                <span className={styles.statsIcon}>💝</span>
                <div>
                  <strong>100% 开源免费</strong>
                  <p>MIT 协议，商业使用无忧</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 主题系统展示 */}
        <div id="theme-system" className={styles.themesContainer}>
          <div className={styles.themesHeader}>
            <h3>多样化主题系统</h3>
            <p>一键切换风格，满足不同场景需求</p>
          </div>

          <div className={styles.themesGrid}>
            {themeExamples.map((theme, index) => {
              // 如果主题示例本身没有指定 theme，使用当前页面主题
              const themeOptions = {
                ...theme.options,
                theme: theme.options?.theme || (isDark ? 'dark' : 'light'),
              } as Partial<InfographicOptions>;

              return (
                <div
                  key={theme.name}
                  className={`${styles.themeCard} ${activeTheme === index ? styles.themeCardActive : ''}`}
                  onMouseEnter={() => setActiveTheme(index)}
                >
                  <div className={styles.themePreview}>
                    <Infographic
                      options={themeOptions}
                      showActions={true}
                      containerStyle={{
                        width: '100%',
                        height: '200px',
                      }}
                    />
                  </div>
                  <div className={styles.themeInfo}>
                    <div className={styles.themeIcon}>{theme.icon}</div>
                    <div className={styles.themeText}>
                      <h4>{theme.label}</h4>
                      <p>{theme.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.themesFooter}>
            <p className={styles.themesNote}>
              支持自定义主题配置，灵活扩展样式系统
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
