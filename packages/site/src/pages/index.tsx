import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './index.module.css';

const stats = [
  { number: '30+', label: '数据项设计' },
  { number: '20+', label: '结构布局' },
  { number: '70+', label: '内置模版' },
  { number: '100%', label: 'TypeScript' },
];

const features = [
  {
    icon: '🚀',
    title: '开箱即用',
    details: '30+ 内置组件，15+ 结构布局，几分钟即可创建信息图',
  },
  {
    icon: '🎨',
    title: '主题系统',
    details:
      '支持手绘风（rough）、渐变（gradient）、图案（pattern）等风格，一键切换',
  },
  {
    icon: '🧩',
    title: '组件化架构',
    details: '数据、结构、样式完全解耦，支持自定义扩展',
  },
  {
    icon: '💎',
    title: 'TypeScript',
    details: '完整的类型定义和智能提示',
  },
  {
    icon: '⚡',
    title: 'SVG 渲染',
    details: '矢量渲染，无损缩放，支持导出多种格式',
  },
  {
    icon: '📖',
    title: '声明式 API',
    details: '配置即视图，用数据驱动而非命令式操作',
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.heroBackground}>
        <div className={clsx(styles.gradientOrb, styles.orb1)}></div>
        <div className={clsx(styles.gradientOrb, styles.orb2)}></div>
        <div className={clsx(styles.gradientOrb, styles.orb3)}></div>
      </div>
      <div className={styles.heroContent}>
        <Heading as="h1" className={styles.heroTitle}>
          <span className={styles.titleGradient}>{siteConfig.title}</span>
        </Heading>
        <p className={styles.heroSubtitle}>新一代信息图可视化引擎</p>
        <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        <div className={styles.heroActions}>
          <Link
            className={clsx('button button--lg', styles.buttonBrand)}
            to="/guide/getting-started"
          >
            快速开始 →
          </Link>
          <Link
            className={clsx(
              'button button--outline button--lg',
              styles.buttonAlt,
            )}
            to="/examples/"
          >
            在线示例
          </Link>
          <Link
            className={clsx(
              'button button--outline button--lg',
              styles.buttonAlt,
            )}
            to="https://github.com/antvis/infographic"
          >
            GitHub
          </Link>
        </div>
        <div className={styles.heroStats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.sectionTitle}>核心特性</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDetails}>{feature.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
