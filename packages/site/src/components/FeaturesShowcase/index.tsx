import { getItems, getStructures, getTemplates } from '@antv/infographic';
import { useEffect, useRef, useState } from 'react';
import SectionHeader from '../SectionHeader';
import styles from './styles.module.css';

function roundUpToTen(fn: () => string[]) {
  return Math.ceil(fn().length / 10) * 10;
}

const features = [
  {
    icon: '🚀',
    title: '开箱即用',
    description: `${roundUpToTen(getItems)}+ 数据项设计，${roundUpToTen(getStructures)}+ 结构布局，${roundUpToTen(getTemplates)}+ 内置模板，快速创建专业信息图`,
    details: ['丰富的预设组件库', '多种布局算法支持', '零配置快速上手'],
    link: '#design-assets',
    linkType: 'scroll',
    hoverText: '了解更多 →',
  },
  {
    icon: '🎨',
    title: '主题系统',
    description:
      '支持手绘风（rough）、渐变（gradient）、图案（pattern）等多种风格，一键切换',
    details: ['Rough 手绘风格', 'Gradient 渐变主题', 'Pattern 图案填充'],
    link: '#theme-system',
    linkType: 'scroll',
    hoverText: '预览效果 →',
  },
  {
    icon: '🤖',
    title: 'AI 友好',
    description: '完善的 JSON Schema 支持，让 AI 轻松生成专业信息图',
    details: ['结构化配置定义', '智能参数校验', '自然语言到可视化'],
    link: '/examples/ai-demo',
    linkType: 'external',
    hoverText: '点击前往体验 →',
  },
  {
    icon: '🎯',
    title: '灵活定制',
    description: '支持自定义设计资产、主题配置、样式扩展，满足个性化需求',
    details: ['自定义数据项设计', '可扩展主题系统', '灵活的样式配置'],
    link: '/dev/ai-assisted-development',
    linkType: 'external',
    hoverText: '了解详情 →',
  },
  {
    icon: '⚡',
    title: 'SVG 渲染',
    description: '矢量渲染，无损缩放，支持导出多种格式',
    details: ['高清矢量输出', '多格式导出', '性能优化'],
  },
  {
    icon: '📖',
    title: '声明式 API',
    description: '配置即视图，用数据驱动而非命令式操作',
    details: ['JSON 配置化', '数据驱动视图', 'API 简洁易用'],
    link: '/api/',
    linkType: 'external',
    hoverText: '了解详情 →',
  },
];

interface FeatureCardProps {
  feature: (typeof features)[0];
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (!feature.link) return;

    if (feature.linkType === 'scroll') {
      // 滚动到指定元素
      const targetId = feature.link.replace('#', '');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // 获取元素位置，减去顶部导航栏的高度
        const navbarHeight = 60; // Docusaurus 默认导航栏高度
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    } else if (feature.linkType === 'external') {
      // 在新标签页打开
      window.open(feature.link, '_blank');
    }
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.featureCard} ${isVisible ? styles.visible : ''} ${feature.link ? styles.clickable : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.featureIcon}>{feature.icon}</div>
      <h3 className={styles.featureTitle}>{feature.title}</h3>
      <p className={styles.featureDescription}>{feature.description}</p>
      <ul className={styles.featureDetails}>
        {feature.details.map((detail, i) => (
          <li key={i} className={styles.detailItem}>
            <span className={styles.detailBullet}>▸</span>
            {detail}
          </li>
        ))}
      </ul>
      {feature.link && isHovered && (
        <div className={styles.hoverHint}>{feature.hoverText}</div>
      )}
    </div>
  );
}

export default function FeaturesShowcase() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <SectionHeader
          title="核心特性"
          subtitle="让信息图创作更简单、更优雅、更高效"
        />
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
