'use client';

import {InfographicOptions} from '@antv/infographic';
import {useEffect, useMemo, useState} from 'react';
import {useLocaleBundle} from '../../../hooks/useTranslation';
import type {Language} from '../../../utils/i18n';
import {Infographic} from '../../Infographic';
import {PadView} from './PadView';

interface StyleDataItem {
  icon?: string;
  illus?: string;
  label: string;
  desc: string;
}

interface StyleTranslation {
  key: string;
  name: string;
  data: {
    title?: string;
    items: StyleDataItem[];
  };
}

interface StylizeTranslations {
  aria: {
    prev: string;
    next: string;
    indicator: string;
  };
  styles: StyleTranslation[];
}

interface StyleConfig {
  key: string;
  name: string;
  options: Partial<InfographicOptions>;
}

const styleTemplates: Array<{
  key: string;
  options: Partial<InfographicOptions>;
}> = [
  {
    key: 'darkStyle',
    options: {
      theme: 'dark',
      editable: true,
      template: 'compare-quadrant-quarter-circular',
      themeConfig: {
        palette: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1'],
        colorBg: '#00000000',
      },
    },
  },
  {
    key: 'handDrawnStyle',
    options: {
      editable: true,
      template: 'sequence-roadmap-vertical-simple',
      themeConfig: {
        stylize: {type: 'rough'},
        palette: [
          '#ff6b6b',
          '#ee5a6f',
          '#f06595',
          '#cc5de8',
          '#845ef7',
          '#5c7cfa',
          '#339af0',
          '#22b8cf',
          '#20c997',
        ],
        base: {
          text: {
            'font-family': '851tegakizatsu',
          },
        },
      },
    },
  },
  {
    key: 'textureStyle',
    options: {
      editable: true,
      template: 'list-grid-candy-card-lite',
      themeConfig: {
        palette: [
          '#f94144',
          '#f3722c',
          '#f8961e',
          '#f9c74f',
          '#90be6d',
          '#43aa8b',
          '#577590',
        ],
        stylize: {type: 'pattern', pattern: 'line'},
      },
    },
  },
];

const stylizeTranslations: Record<Language, StylizeTranslations> = {
  'zh-CN': {
    aria: {
      prev: '上一个风格',
      next: '下一个风格',
      indicator: '切换到风格',
    },
    styles: [
      {
        key: 'darkStyle',
        name: '深色风格',
        data: {
          items: [
            {
              icon: 'mdi/fire-alert',
              label: '紧急且重要',
              desc: '需要立即处理的关键任务，如系统故障修复、重要客户投诉处理',
            },
            {
              icon: 'mdi/target-arrow',
              label: '重要但不紧急',
              desc: '对长期目标有重大影响的事项，如技术架构优化、团队能力建设',
            },
            {
              icon: 'mdi/clock-alert-outline',
              label: '紧急但不重要',
              desc: '需要快速响应但影响有限的事务，如部分会议邀请、常规报告提交',
            },
            {
              icon: 'mdi/calendar-remove',
              label: '不紧急且不重要',
              desc: '可以延后或委派的低优先级事项，如非关键的邮件回复、日常琐事',
            },
          ],
        },
      },
      {
        key: 'handDrawnStyle',
        name: '手绘风格',
        data: {
          items: [
            {
              icon: 'mdi/account-plus',
              label: '创建账号',
              desc: '填写基本信息，设置用户名和密码完成注册',
            },
            {
              icon: 'mdi/account-edit',
              label: '完善资料',
              desc: '上传头像，补充个人信息和偏好设置',
            },
            {
              icon: 'mdi/shield-check',
              label: '验证身份',
              desc: '通过邮箱或手机号验证，确保账号安全',
            },
            {
              icon: 'mdi/party-popper',
              label: '开始使用',
              desc: '探索平台功能，开启你的专属体验之旅',
            },
          ],
        },
      },
      {
        key: 'textureStyle',
        name: '纹理效果',
        data: {
          title: '产品全生命周期管理',
          items: [
            {
              icon: 'mdi/chart-box',
              label: '市场调研',
              desc: '分析行业趋势、市场规模，研究竞争对手策略，识别市场机会与风险',
            },
            {
              icon: 'mdi/account-group',
              label: '用户画像',
              desc: '定义目标用户的年龄、职业、消费习惯等特征，构建用户行为模型',
            },
            {
              icon: 'mdi/bullseye-arrow',
              label: '产品定位',
              desc: '明确产品核心价值、差异化优势和竞争壁垒，确立品牌定位',
            },
            {
              icon: 'mdi/puzzle',
              label: '功能规划',
              desc: '梳理功能架构，制定MVP清单，规划优先级和迭代路线图',
            },
            {
              icon: 'mdi/palette',
              label: '原型设计',
              desc: '创建交互原型，设计界面布局和视觉风格，输出UI规范文档',
            },
            {
              icon: 'mdi/laptop',
              label: '技术开发',
              desc: '选择技术栈，进行前后端开发和API实现，确保性能和安全性',
            },
            {
              icon: 'mdi/tune',
              label: '测试优化',
              desc: '执行功能、性能和兼容性测试，收集反馈并持续优化体验',
            },
            {
              icon: 'mdi/trending-up',
              label: '推广运营',
              desc: '制定营销策略，执行多渠道推广，优化转化率和用户留存',
            },
          ],
        },
      },
    ],
  },
  'en-US': {
    aria: {
      prev: 'Previous style',
      next: 'Next style',
      indicator: 'Switch to style',
    },
    styles: [
      {
        key: 'darkStyle',
        name: 'Dark Style',
        data: {
          items: [
            {
              icon: 'mdi/fire-alert',
              label: 'Urgent',
              desc: 'Tasks requiring immediate attention',
            },
            {
              icon: 'mdi/target-arrow',
              label: 'Strategic',
              desc: 'Initiatives with long-term impact',
            },
            {
              icon: 'mdi/clock-alert-outline',
              label: 'Time-sensitive',
              desc: 'Time-sensitive but low-impact matters',
            },
            {
              icon: 'mdi/calendar-remove',
              label: 'Low priority',
              desc: 'Items to defer or delegate',
            },
          ],
        },
      },
      {
        key: 'handDrawnStyle',
        name: 'Hand-drawn Style',
        data: {
          items: [
            {
              icon: 'mdi/account-plus',
              label: 'Create Account',
              desc: 'Fill in basic info and set your username and password to complete registration',
            },
            {
              icon: 'mdi/account-edit',
              label: 'Complete Profile',
              desc: 'Upload an avatar and add personal information plus preference settings',
            },
            {
              icon: 'mdi/shield-check',
              label: 'Verify Identity',
              desc: 'Confirm via email or phone number to secure your account',
            },
            {
              icon: 'mdi/party-popper',
              label: 'Start Using',
              desc: 'Explore platform features and begin your personalized journey',
            },
          ],
        },
      },
      {
        key: 'textureStyle',
        name: 'Textured Style',
        data: {
          title: 'Product Lifecycle Management',
          items: [
            {
              icon: 'mdi/chart-box',
              label: 'Market Research',
              desc: 'Analyze industry trends, market size, and competitors to uncover opportunities and risks',
            },
            {
              icon: 'mdi/account-group',
              label: 'User Persona',
              desc: "Define target users' demographics, behaviors, and consumption habits to build behavioral models",
            },
            {
              icon: 'mdi/bullseye-arrow',
              label: 'Product Positioning',
              desc: 'Clarify core value, differentiators, and competitive advantages to build a strong brand position',
            },
            {
              icon: 'mdi/puzzle',
              label: 'Feature Planning',
              desc: 'Outline feature architecture, craft an MVP list, and plan priorities with iteration roadmaps',
            },
            {
              icon: 'mdi/palette',
              label: 'Prototype Design',
              desc: 'Create interactive prototypes, define UI layouts, and produce visual system guidelines',
            },
            {
              icon: 'mdi/laptop',
              label: 'Technical Development',
              desc: 'Pick the tech stack, build front/back-end and APIs, and ensure performance and security',
            },
            {
              icon: 'mdi/tune',
              label: 'Testing & Optimization',
              desc: 'Run functionality, performance, and compatibility tests, collect feedback, and continuously improve',
            },
            {
              icon: 'mdi/trending-up',
              label: 'Marketing & Operations',
              desc: 'Plan marketing strategies, execute multi-channel campaigns, and optimize conversion and retention',
            },
          ],
        },
      },
    ],
  },
};

const getStyles = (translation: StylizeTranslations): StyleConfig[] =>
  translation.styles.map((styleTranslation) => {
    const template = styleTemplates.find(
      (item) => item.key === styleTranslation.key
    );
    const baseOptions = template?.options ?? {};
    return {
      key: styleTranslation.key,
      name: styleTranslation.name,
      options: {
        ...baseOptions,
        data: styleTranslation.data,
      },
    };
  });

export function StylizeDemo() {
  const translation = useLocaleBundle(stylizeTranslations);
  const styleConfigs = useMemo(() => getStyles(translation), [translation]);
  const totalStyles = styleConfigs.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    if (!totalStyles) {
      return;
    }
    if (currentIndex >= totalStyles) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalStyles]);

  if (!totalStyles) {
    return null;
  }

  const safeIndex = Math.min(currentIndex, totalStyles - 1);
  const currentStyle = styleConfigs[safeIndex];
  const isDarkStyle = currentStyle.key === 'darkStyle';
  const {aria} = translation;

  const handlePrev = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + totalStyles) % totalStyles);
  };

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % totalStyles);
  };

  return (
    <div className={isDarkStyle ? 'dark' : ''}>
      <PadView minHeight={550}>
        {/* 标题区域 */}
        <div className="w-full flex items-center justify-between mb-4">
          <h4 className="leading-tight text-primary dark:text-primary-dark font-semibold text-2xl lg:text-3xl transition-colors duration-500">
            {currentStyle.name}
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary-dark/10 hover:bg-primary/20 dark:hover:bg-primary-dark/20 text-primary dark:text-primary-dark flex items-center justify-center transition-all duration-500"
              aria-label={aria.prev}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="text-sm text-secondary dark:text-secondary-dark min-w-[3rem] text-center transition-colors duration-500">
              {safeIndex + 1} / {totalStyles}
            </span>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary-dark/10 hover:bg-primary/20 dark:hover:bg-primary-dark/20 text-primary dark:text-primary-dark flex items-center justify-center transition-all duration-500"
              aria-label={aria.next}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 信息图渲染区域 */}
        <div className="w-full relative overflow-hidden">
          <div
            key={safeIndex}
            className={`w-full transition-all duration-500 ease-out ${
              direction === 'right'
                ? 'animate-slideInRight'
                : 'animate-slideInLeft'
            }`}>
            {
              <Infographic
                key={safeIndex}
                options={{
                  width: '60em',
                  height: 400,
                  padding: 5,
                  ...currentStyle.options,
                }}
              />
            }
          </div>
        </div>

        {/* 指示器 */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {styleConfigs.map((style, index) => (
            <button
              key={style.key}
              onClick={() => {
                setDirection(index > safeIndex ? 'right' : 'left');
                setCurrentIndex(index);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === safeIndex
                  ? 'w-6 bg-primary dark:bg-primary-dark'
                  : 'w-1.5 bg-primary/30 dark:bg-primary-dark/30'
              }`}
              aria-label={`${aria.indicator} ${index + 1}`}
            />
          ))}
        </div>
      </PadView>
    </div>
  );
}
