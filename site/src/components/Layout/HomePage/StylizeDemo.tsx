'use client';

import {InfographicOptions} from '@antv/infographic';
import {useState} from 'react';
import {Infographic} from '../../Infographic';
import {PadView} from './PadView';

// 定义风格配置类型
interface StyleConfig {
  name: string;
  options: Partial<InfographicOptions>; // 预留给你填充的信息图配置项
}

// 风格配置数组 - 预留位置供你填充
const styles: StyleConfig[] = [
  {
    name: '深色风格',
    options: {
      theme: 'dark',
      template: 'quadrant-quarter-circular',
      themeConfig: {
        palette: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1'],
        colorBg: '#00000000',
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
    name: '手绘风格',
    options: {
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
    name: '纹理效果',
    options: {
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
      data: {
        title: '产品全生命周期管理',
        items: [
          {
            label: '市场调研',
            desc: '分析行业趋势、市场规模，研究竞争对手策略，识别市场机会与风险',
            icon: 'icon:mdi/chart-box',
          },
          {
            label: '用户画像',
            desc: '定义目标用户的年龄、职业、消费习惯等特征，构建用户行为模型',
            icon: 'icon:mdi/account-group',
          },
          {
            label: '产品定位',
            desc: '明确产品核心价值、差异化优势和竞争壁垒，确立品牌定位',
            icon: 'icon:mdi/bullseye-arrow',
          },
          {
            label: '功能规划',
            desc: '梳理功能架构，制定MVP清单，规划优先级和迭代路线图',
            icon: 'icon:mdi/puzzle',
          },
          {
            label: '原型设计',
            desc: '创建交互原型，设计界面布局和视觉风格，输出UI规范文档',
            icon: 'icon:mdi/palette',
          },
          {
            label: '技术开发',
            desc: '选择技术栈，进行前后端开发和API实现，确保性能和安全性',
            icon: 'icon:mdi/laptop',
          },
          {
            label: '测试优化',
            desc: '执行功能、性能和兼容性测试，收集反馈并持续优化体验',
            icon: 'icon:mdi/tune',
          },
          {
            label: '推广运营',
            desc: '制定营销策略，执行多渠道推广，优化转化率和用户留存',
            icon: 'icon:mdi/trending-up',
          },
        ],
      },
    },
  },
];

export function StylizeDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const handlePrev = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + styles.length) % styles.length);
  };

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % styles.length);
  };

  const currentStyle = styles[currentIndex];
  const isDarkStyle = currentStyle.name === '深色风格';

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
              aria-label="上一个风格">
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
              {currentIndex + 1} / {styles.length}
            </span>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary-dark/10 hover:bg-primary/20 dark:hover:bg-primary-dark/20 text-primary dark:text-primary-dark flex items-center justify-center transition-all duration-500"
              aria-label="下一个风格">
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
            key={currentIndex}
            className={`w-full transition-all duration-500 ease-out ${
              direction === 'right'
                ? 'animate-slideInRight'
                : 'animate-slideInLeft'
            }`}>
            {
              <Infographic
                key={currentIndex}
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
          {styles.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 'right' : 'left');
                setCurrentIndex(index);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? 'w-6 bg-primary dark:bg-primary-dark'
                  : 'w-1.5 bg-primary/30 dark:bg-primary-dark/30'
              }`}
              aria-label={`切换到风格 ${index + 1}`}
            />
          ))}
        </div>
      </PadView>
    </div>
  );
}
