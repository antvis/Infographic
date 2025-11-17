import styles from './styles.module.css';

export default function FooterSection() {
  return (
    <section className={styles.footerSection}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerTop}>
            <div className={styles.brandSection}>
              <h3 className={styles.brandTitle}>@antv/infographic</h3>
              <p className={styles.brandTagline}>新一代信息图可视化引擎</p>
              <p className={styles.brandDescription}>
                让数据叙事更简单、更优雅、更高效
              </p>
            </div>

            <div className={styles.linksSection}>
              <div className={styles.linkGroup}>
                <h4 className={styles.linkTitle}>文档</h4>
                <ul className={styles.linkList}>
                  <li>
                    <a href="/guide/getting-started">快速开始</a>
                  </li>
                  <li>
                    <a href="/guide/concepts">核心概念</a>
                  </li>
                  <li>
                    <a href="/api">API 文档</a>
                  </li>
                  <li>
                    <a href="/examples">示例</a>
                  </li>
                  <li>
                    <a href="/dev/overview">参与贡献</a>
                  </li>
                </ul>
              </div>

              <div className={styles.linkGroup}>
                <h4 className={styles.linkTitle}>资源</h4>
                <ul className={styles.linkList}>
                  <li>
                    <a
                      href="https://github.com/antvis/infographic"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/antvis/infographic/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      问题反馈
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/antvis/infographic/releases"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      更新日志
                    </a>
                  </li>
                </ul>
              </div>

              <div className={styles.linkGroup}>
                <h4 className={styles.linkTitle}>AntV 家族</h4>
                <ul className={styles.linkList}>
                  <li>
                    <a
                      href="https://g2.antv.antgroup.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      G2
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://g6.antv.antgroup.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      G6
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://l7.antv.antgroup.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      L7
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://antv.antgroup.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      更多产品
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div className={styles.copyright}>
              基于 MIT 许可证发布 | Copyright © {new Date().getFullYear()} AntV
            </div>
            <div className={styles.social}>
              <a
                href="https://github.com/antvis/infographic"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
