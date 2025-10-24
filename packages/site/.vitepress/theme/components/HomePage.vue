<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <HomeHero />

    <!-- 核心特性 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">核心特性</h2>
        <div class="features-grid">
          <FeatureCard
            v-for="(feature, index) in features"
            :key="index"
            :icon="feature.icon"
            :title="feature.title"
            :details="feature.details"
            :tags="feature.tags"
          />
        </div>
      </div>
    </section>

    <!-- 为什么选择 -->
    <section class="why-section">
      <div class="container">
        <h2 class="section-title">为什么选择 Infographic？</h2>
        <div class="why-grid">
          <div
            v-for="(item, index) in whyChoose"
            :key="index"
            class="why-card"
          >
            <div class="why-icon">{{ item.icon }}</div>
            <h3 class="why-title">{{ item.title }}</h3>
            <p class="why-desc">{{ item.desc }}</p>
            <ul class="why-list">
              <li v-for="(point, i) in item.points" :key="i">{{ point }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 快速开始 -->
    <section class="quick-start-section">
      <div class="container">
        <h2 class="section-title">5 行代码，创建你的第一个信息图</h2>

        <div class="code-demo">
          <div class="code-block">
            <pre><code class="language-typescript">{{ codeExample }}</code></pre>
          </div>
          <div class="demo-preview">
            <div class="preview-placeholder">
              <div class="preview-icon">🎨</div>
              <p>信息图预览效果</p>
            </div>
          </div>
        </div>

        <div class="tip-box">
          💡 更换 <code>structure</code> 和 <code>item</code> 配置，即可切换不同的展示效果
        </div>
      </div>
    </section>

    <!-- 应用场景 -->
    <ScenarioShowcase />

    <!-- CTA 区域 -->
    <div class="container">
      <CTASection />
    </div>

    <!-- 社区 -->
    <section class="community-section">
      <div class="container">
        <h2 class="section-title">加入我们</h2>
        <div class="community-grid">
          <a
            v-for="(link, index) in communityLinks"
            :key="index"
            :href="link.url"
            class="community-card"
            target="_blank"
          >
            <div class="community-icon">{{ link.icon }}</div>
            <h3 class="community-title">{{ link.title }}</h3>
            <p class="community-desc">{{ link.desc }}</p>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="home-footer">
      <div class="container">
        <p class="footer-text">
          基于 <a href="https://github.com/antvis/infographic/blob/main/LICENSE" target="_blank">MIT 许可证</a> 开源
        </p>
        <p class="footer-text">Made with ❤️ by <a href="https://antv.antgroup.com/" target="_blank">AntV Team</a></p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import HomeHero from './HomeHero.vue'
import FeatureCard from './FeatureCard.vue'
import ScenarioShowcase from './ScenarioShowcase.vue'
import CTASection from './CTASection.vue'

const features = [
  {
    icon: '🚀',
    title: '开箱即用',
    details: '30+ 内置组件，15+ 结构布局，开箱即用的模板库，让你在几分钟内创建专业级信息图',
    tags: ['30+ 组件', '15+ 布局']
  },
  {
    icon: '🎨',
    title: '强大主题系统',
    details: '多套精心设计的主题风格，支持手绘风、扁平化、渐变等多种视觉效果，一键切换',
    tags: ['多主题', '可定制']
  },
  {
    icon: '🧩',
    title: '极致灵活',
    details: '组件化架构设计，数据、结构、样式完全解耦，支持自定义扩展，满足个性化需求',
    tags: ['组件化', '可扩展']
  },
  {
    icon: '💎',
    title: 'TypeScript 优先',
    details: '完整的类型定义和智能提示，让开发过程更加高效、安全，减少运行时错误',
    tags: ['类型安全', '智能提示']
  },
  {
    icon: '⚡',
    title: '高性能渲染',
    details: '基于 SVG 的矢量渲染引擎，无损缩放，完美适配各种分辨率，支持多种导出格式',
    tags: ['SVG', '高性能']
  },
  {
    icon: '📖',
    title: '声明式 API',
    details: '简洁直观的配置语法，用数据驱动视图，专注于内容创作而非实现细节',
    tags: ['声明式', '易用']
  }
]

const whyChoose = [
  {
    icon: '🎯',
    title: '专注信息图表达',
    desc: '与通用图表库不同，Infographic 专为信息图设计，提供了更贴合实际业务场景的组件和布局。',
    points: []
  },
  {
    icon: '⚡',
    title: '开发效率提升 10 倍',
    desc: '',
    points: [
      '3 分钟创建第一个信息图',
      '30+ 模板覆盖常见场景',
      '零配置开箱即用',
      'TypeScript 全面支持'
    ]
  },
  {
    icon: '🎨',
    title: '视觉效果专业',
    desc: '精心打磨的视觉效果，内置多种主题风格，无需设计师也能产出专业级作品。',
    points: []
  }
]

const codeExample = `import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  data: {
    title: '🚀 产品开发全流程',
    items: [
      { icon: 'lightbulb', label: '需求分析', desc: '洞察用户痛点' },
      { icon: 'design', label: '设计阶段', desc: '打造极致体验' },
      { icon: 'code', label: '开发实现', desc: '高质量交付' },
      { icon: 'test', label: '测试验证', desc: '质量保障' },
      { icon: 'rocket', label: '上线发布', desc: '持续优化' },
    ],
  },
  design: {
    structure: 'list-column',  // 垂直列表布局
    item: 'badge-card',          // 徽章卡片样式
  },
});

infographic.render();`

const communityLinks = [
  {
    icon: '⭐',
    title: 'Star on GitHub',
    desc: '给我们一个 Star，支持项目发展',
    url: 'https://github.com/antvis/infographic'
  },
  {
    icon: '💬',
    title: '参与讨论',
    desc: '分享想法，交流经验',
    url: 'https://github.com/antvis/infographic/discussions'
  },
  {
    icon: '🐛',
    title: '反馈问题',
    desc: '报告 Bug，提出建议',
    url: 'https://github.com/antvis/infographic/issues'
  },
  {
    icon: '🤝',
    title: '贡献代码',
    desc: '一起让它变得更好',
    url: 'https://github.com/antvis/infographic/blob/main/CONTRIBUTING.md'
  }
]
</script>

<style scoped>
.home-page {
  padding-top: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  background: linear-gradient(120deg, #1890ff, #52c41a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Features Section */
.features-section {
  padding: 80px 0;
  background: var(--vp-c-bg-alt);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

/* Why Section */
.why-section {
  padding: 80px 0;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.why-card {
  padding: 40px 32px;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.why-card:hover {
  transform: translateY(-8px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 12px 32px rgba(24, 144, 255, 0.15);
}

.why-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.why-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}

.why-desc {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0 0 16px;
}

.why-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.why-list li {
  padding: 6px 0 6px 24px;
  position: relative;
  color: var(--vp-c-text-2);
}

.why-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--vp-c-brand);
  font-weight: bold;
}

/* Quick Start Section */
.quick-start-section {
  padding: 80px 0;
  background: var(--vp-c-bg-alt);
}

.code-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.code-block {
  border-radius: 12px;
  background: var(--vp-code-block-bg);
  padding: 24px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.7;
}

.code-block code {
  color: var(--vp-c-text-1);
}

.demo-preview {
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 2px dashed var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.preview-placeholder {
  text-align: center;
  color: var(--vp-c-text-2);
}

.preview-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.tip-box {
  padding: 20px 24px;
  border-radius: 8px;
  background: rgba(24, 144, 255, 0.1);
  border-left: 4px solid var(--vp-c-brand);
  color: var(--vp-c-text-1);
}

.tip-box code {
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(24, 144, 255, 0.2);
  color: var(--vp-c-brand);
  font-weight: 600;
}

/* Community Section */
.community-section {
  padding: 80px 0;
}

.community-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.community-card {
  display: block;
  text-align: center;
  padding: 40px 24px;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.3s ease;
}

.community-card:hover {
  transform: translateY(-8px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 12px 32px rgba(24, 144, 255, 0.15);
}

.community-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.community-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.community-desc {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* Footer */
.home-footer {
  padding: 60px 0;
  text-align: center;
  border-top: 1px solid var(--vp-c-divider);
}

.footer-text {
  color: var(--vp-c-text-2);
  margin: 8px 0;
}

.footer-text a {
  color: var(--vp-c-brand);
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer-text a:hover {
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
    margin-bottom: 40px;
  }

  .features-grid,
  .why-grid {
    grid-template-columns: 1fr;
  }

  .code-demo {
    grid-template-columns: 1fr;
  }

  .demo-preview {
    min-height: 300px;
  }
}
</style>
