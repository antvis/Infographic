import { useState } from 'react';
import SectionHeader from '../SectionHeader';
import styles from './styles.module.css';

/**
 * 案例墙组件
 *
 * 使用说明：
 * 1. 将你的案例图片放在 static/img/gallery/ 目录下
 * 2. 更新 galleryItems 数组，添加图片路径、标题和描述
 * 3. 图片建议尺寸：宽度 600-800px，高度根据实际内容调整
 */

const galleryItems = [
  {
    id: 1,
    title: '数据分析仪表盘',
    description: '使用金字塔图和时间轴组合展示',
    image: '/img/gallery/example-1.png', // 替换为实际图片路径
    category: '商业',
  },
  {
    id: 2,
    title: '产品发展时间轴',
    description: '展示产品演进历程',
    image: '/img/gallery/example-2.png',
    category: '时间轴',
  },
  {
    id: 3,
    title: '组织架构图',
    description: '清晰的层级结构展示',
    image: '/img/gallery/example-3.png',
    category: '组织',
  },
  {
    id: 4,
    title: '数据流程图',
    description: '可视化数据处理流程',
    image: '/img/gallery/example-4.png',
    category: '流程',
  },
  {
    id: 5,
    title: '统计信息图',
    description: '用图表讲述数据故事',
    image: '/img/gallery/example-5.png',
    category: '统计',
  },
  {
    id: 6,
    title: '技术架构图',
    description: '系统架构可视化',
    image: '/img/gallery/example-6.png',
    category: '技术',
  },
];

const categories = [
  '全部',
  ...Array.from(new Set(galleryItems.map((item) => item.category))),
];

export default function GalleryWall() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const filteredItems =
    selectedCategory === '全部'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <section className={styles.gallerySection}>
      <div className="container">
        <SectionHeader
          title="作品展示"
          subtitle="用 @antv/infographic 创作的信息图案例"
        />

        <div className={styles.filters}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.gallery}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={styles.galleryItem}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className={styles.imageContainer}>
                <div className={styles.imagePlaceholder}>
                  <div className={styles.placeholderIcon}>🖼️</div>
                  <div className={styles.placeholderText}>图片占位</div>
                  <div className={styles.placeholderHint}>
                    请将图片放在: <br />
                    <code>{item.image}</code>
                  </div>
                </div>
                <div
                  className={`${styles.overlay} ${hoveredItem === item.id ? styles.overlayVisible : ''}`}
                >
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemDescription}>{item.description}</p>
                  <div className={styles.itemActions}>
                    <button className={styles.actionButton}>查看详情</button>
                    <button className={styles.actionButtonSecondary}>
                      查看代码
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.itemInfo}>
                <span className={styles.category}>{item.category}</span>
                <h4 className={styles.itemTitleSmall}>{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.callToAction}>
          <p className={styles.ctaText}>更多案例？</p>
          <a href="/examples/" className={styles.ctaButton}>
            浏览完整示例库 →
          </a>
        </div>
      </div>
    </section>
  );
}
