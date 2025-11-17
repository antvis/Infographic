import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import AnimatedBackground from '@site/src/components/AnimatedBackground';
import CodePlayground from '@site/src/components/CodePlayground';
import DesignAssetsSection from '@site/src/components/DesignAssetsSection';
import FeaturesShowcase from '@site/src/components/FeaturesShowcase';
import FooterSection from '@site/src/components/FooterSection';
import GalleryWall from '@site/src/components/GalleryWall';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <AnimatedBackground />
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
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 当滚动超过 300px 时显示返回顶部按钮
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Layout
      title={`${siteConfig.title}`}
      description={siteConfig.tagline}
      wrapperClassName={styles.homeLayout}
    >
      <HomepageHeader />
      <FeaturesShowcase />
      <DesignAssetsSection />
      <div className={styles.playgroundWrapper}>
        <div className="container">
          <CodePlayground />
        </div>
      </div>
      <GalleryWall />
      <FooterSection />

      {/* 返回顶部按钮 */}
      <button
        className={`${styles.backToTop} ${showBackToTop ? styles.visible : ''}`}
        onClick={scrollToTop}
        aria-label="返回顶部"
      >
        ↑
      </button>
    </Layout>
  );
}
