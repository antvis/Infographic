'use client';

import {InfographicOptions} from '@antv/infographic';
import cn from 'classnames';
import {memo, useEffect, useRef, useState} from 'react';
import {Infographic} from '../../Infographic';

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);

  const [shouldPlay, setShouldPlay] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShouldPlay(entry.isIntersecting);
        });
      },
      {
        root: null,
        rootMargin: `${window.innerHeight}px 0px`,
      }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const [isLazy, setIsLazy] = useState(true);
  // Either wait until we're scrolling close...
  useEffect(() => {
    if (!isLazy || !ref.current) {
      return;
    }
    const rootVertical = +(window.innerHeight * 2.5);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLazy(false);
          }
        });
      },
      {
        root: null,
        rootMargin: `${rootVertical}px 0px`,
      }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isLazy]);
  // ... or until it's been a while after hydration.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLazy(false);
    }, 20 * 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div ref={ref} className="relative flex overflow-x-clip w-auto">
      <div
        className="w-full py-12 lg:py-20 whitespace-nowrap flex flex-row animate-marquee lg:animate-large-marquee"
        style={{
          animationPlayState: shouldPlay ? 'running' : 'paused',
        }}>
        <InfographicItems isLazy={isLazy} />
      </div>
      <div
        aria-hidden="true"
        className="w-full absolute top-0 py-12 lg:py-20 whitespace-nowrap flex flex-row animate-marquee2 lg:animate-large-marquee2"
        style={{
          animationPlayState: shouldPlay ? 'running' : 'paused',
        }}>
        <InfographicItems isLazy={isLazy} />
      </div>
    </div>
  );
}

const list: Array<{
  options: Partial<InfographicOptions>;
}> = [
  {
    options: {
      template: 'sequence-filter-mesh-underline-text',
      themeConfig: {
        palette: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'],
        colorBg: '#f8f9ff',
      },
      data: {
        title: '产品设计全流程',
        items: [
          {
            label: '用户调研',
            desc: '深入了解目标用户需求和痛点',
          },
          {
            label: '原型设计',
            desc: '快速验证产品核心功能和交互',
          },
          {
            label: '视觉设计',
            desc: '打造符合品牌调性的视觉体验',
          },
          {
            label: '开发测试',
            desc: '确保产品质量和用户体验',
          },
          {
            label: '上线运营',
            desc: '持续优化和迭代产品功能',
          },
        ],
      },
    },
  },
  {
    options: {
      template: 'sequence-color-snake-steps-horizontal-icon-line',
      themeConfig: {
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
        colorBg: '#fff5f7',
      },
      data: {
        title: '企业发展历程',
        items: [
          {
            icon: 'icon:mdi/lightbulb-on',
            label: '创意萌芽',
            time: '2017',
          },
          {
            icon: 'icon:mdi/rocket-launch',
            label: '项目启动',
            time: '2018',
          },
          {
            icon: 'icon:mdi/account-group',
            label: '团队组建',
            time: '2019',
          },
          {
            icon: 'icon:mdi/chart-line',
            label: '快速增长',
            time: '2020',
          },
          {
            icon: 'icon:mdi/shield-check',
            label: '稳定运营',
            time: '2021',
          },
          {
            icon: 'icon:mdi/trending-up',
            label: '规模扩张',
            time: '2022',
          },
          {
            icon: 'icon:mdi/medal',
            label: '行业认可',
            time: '2023',
          },
          {
            icon: 'icon:mdi/trophy',
            label: '市场领先',
            time: '2024',
          },
          {
            icon: 'icon:mdi/star',
            label: '未来展望',
            time: '2025',
          },
        ],
      },
    },
  },
  {
    options: {
      template: 'sequence-ascending-stairs-3d-underline-text',
      themeConfig: {
        palette: ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'],
        colorBg: '#fffbf5',
      },
      data: {
        title: '技能成长路径',
        desc: '从初学者到专家，循序渐进提升专业能力',
        items: [
          {
            label: '基础入门',
            desc: '掌握基本概念和核心原理',
          },
          {
            label: '实践应用',
            desc: '通过项目锻炼实战能力',
          },
          {
            label: '深度学习',
            desc: '深入理解底层机制和最佳实践',
          },
          {
            label: '架构设计',
            desc: '具备系统化设计和优化能力',
          },
          {
            label: '技术引领',
            desc: '成为领域专家和技术布道者',
          },
        ],
      },
    },
  },
  {
    options: {
      template: 'sequence-mountain-underline-text',
      themeConfig: {
        palette: ['#76c893', '#52b69a', '#34a0a4', '#168aad', '#1a759f'],
        colorBg: '#f0f9f9',
      },
      data: {
        title: '环保行为进阶之路',
        items: [
          {
            label: '意识觉醒',
            desc: '认识环境问题，关注环保行为',
          },
          {
            label: '行动改变',
            desc: '减少一次性用品，垃圾分类',
          },
          {
            label: '习惯养成',
            desc: '环保融入生活，使用清洁能源',
          },
          {
            label: '影响他人',
            desc: '带动他人参与，组织环保活动',
          },
          {
            label: '系统变革',
            desc: '推动政策改变，实现可持续发展',
          },
        ],
      },
    },
  },
  {
    options: {
      padding: 0,
      template: 'compare-binary-horizontal-underline-text-arrow',
      themeConfig: {
        palette: ['#e03131', '#1971c2'],
        colorBg: '#faf8ff',
      },
      data: {
        title: '商业模式对比',
        items: [
          {
            label: '传统模式',
            children: [
              {
                label: '线下渠道为主',
                desc: '依赖实体店铺和传统销售网络',
              },
              {
                label: '人工服务',
                desc: '客服响应时间长，效率较低',
              },
              {
                label: '固定运营成本高',
                desc: '场地租金和人力成本占比大',
              },
            ],
          },
          {
            label: '数字化转型',
            children: [
              {
                label: '全渠道整合',
                desc: '线上线下协同，触达更多用户',
              },
              {
                label: 'AI智能化',
                desc: '7×24小时自动化服务响应',
              },
              {
                label: '灵活成本结构',
                desc: '按需扩展，降低固定支出',
              },
            ],
          },
        ],
      },
    },
  },
  {
    options: {
      template: 'hierarchy-tree-tech-style-compact-card',
      themeConfig: {
        palette: ['#5c7cfa', '#37b24d', '#f59f00', '#e03131', '#9775fa'],
        colorBg: '#fafbff',
      },
      data: {
        title: '企业战略规划',
        items: [
          {
            label: '企业战略',
            children: [
              {
                label: '市场拓展',
                children: [
                  {
                    label: '国内市场',
                  },
                  {
                    label: '海外市场',
                  },
                ],
              },
              {
                label: '产品创新',
                children: [
                  {
                    label: '技术研发',
                  },
                  {
                    label: '用户体验',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  {
    options: {
      template: 'sequence-cylinders-3d-simple',
      themeConfig: {
        palette: ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'],
        colorBg: '#fffaf5',
      },
      data: {
        title: '用户忠诚度建设',
        items: [
          {
            label: '品牌认知',
            desc: '建立品牌知名度和第一印象',
          },
          {
            label: '产品体验',
            desc: '通过优质体验赢得用户信任',
          },
          {
            label: '情感连接',
            desc: '与用户建立深度情感纽带',
          },
          {
            label: '口碑传播',
            desc: '用户主动推荐和分享',
          },
          {
            label: '忠诚转化',
            desc: '成为品牌的长期支持者',
          },
        ],
      },
    },
  },
  {
    options: {
      template: 'compare-hierarchy-row-letter-card-compact-card',
      themeConfig: {
        palette: ['#37b24d', '#f59f00', '#5c7cfa', '#e03131'],
        colorBg: '#f5f7ff',
      },
      data: {
        title: 'SWOT 战略分析',
        items: [
          {
            label: 'Strengths',
            children: [
              {
                label: '技术创新能力强',
              },
              {
                label: '优秀的团队文化',
              },
              {
                label: '完善的产品体系',
              },
            ],
          },
          {
            label: 'Weaknesses',
            children: [
              {
                label: '品牌知名度有待提升',
              },
              {
                label: '市场渗透率较低',
              },
            ],
          },
          {
            label: 'Opportunities',
            children: [
              {
                label: '市场需求持续增长',
              },
              {
                label: 'AI技术加速应用',
              },
              {
                label: '政策支持力度加大',
              },
            ],
          },
          {
            label: 'Threats',
            children: [
              {
                label: '竞争对手快速发展',
              },
              {
                label: '技术迭代速度加快',
              },
              {
                label: '用户需求多样化',
              },
            ],
          },
        ],
      },
    },
  },
];

const InfographicItems = memo<{isLazy: boolean}>(function InfographicItems({
  isLazy,
}) {
  return (
    <>
      {list.map(({options}, i) => (
        <div
          key={i}
          className={cn(
            `group flex justify-center px-5 min-w-[50%] lg:min-w-[25%] rounded-2xl`
          )}>
          <div
            className={cn(
              'h-auto rounded-2xl before:rounded-2xl before:absolute before:pointer-events-none before:inset-0 before:transition-opacity before:-z-1 before:shadow-lg lg:before:shadow-2xl before:opacity-0 before:group-hover:opacity-100  transition-transform ease-in-out duration-300',
              i % 2 === 0
                ? 'rotate-2 group-hover:rotate-[-1deg] group-hover:scale-110'
                : 'group-hover:rotate-1 group-hover:scale-110 rotate-[-2deg]'
            )}>
            <div
              className={cn(
                'overflow-clip relative before:absolute before:inset-0 before:pointer-events-none before:-translate-x-full group-hover:before:animate-[shimmer_1s_forwards] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent transition-transform ease-in-out duration-300'
              )}>
              <div className="aspect-[4/3] h-full w-full flex items-center justify-center rounded-2xl bg-gray-10 dark:bg-gray-80 overflow-hidden">
                {!isLazy && (
                  <Infographic
                    options={{
                      width: 400,
                      height: 300,
                      padding: 20,
                      theme: 'default',
                      ...options,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
});
