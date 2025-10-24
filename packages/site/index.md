---
layout: page
title: Home
---

<script setup>
import HomeHero from './.vitepress/theme/components/HomeHero.vue'
import FeatureCard from './.vitepress/theme/components/FeatureCard.vue'
import ScenarioShowcase from './.vitepress/theme/components/ScenarioShowcase.vue'
import CTASection from './.vitepress/theme/components/CTASection.vue'
</script>

<HomeHero />

<div class="features-section">
  <div class="container">
    <h2 class="section-title">核心特性</h2>
    <div class="features-grid">
      <FeatureCard
        icon="🚀"
        title="开箱即用"
        details="30+ 内置组件，15+ 结构布局，开箱即用的模板库，让你在几分钟内创建专业级信息图"
        :tags="['30+ 组件', '15+ 布局']"
      />
      <FeatureCard
        icon="🎨"
        title="强大主题系统"
        details="多套精心设计的主题风格，支持手绘风、扁平化、渐变等多种视觉效果，一键切换"
        :tags="['多主题', '可定制']"
      />
      <FeatureCard
        icon="🧩"
        title="极致灵活"
        details="组件化架构设计，数据、结构、样式完全解耦，支持自定义扩展，满足个性化需求"
        :tags="['组件化', '可扩展']"
      />
      <FeatureCard
        icon="💎"
        title="TypeScript 优先"
        details="完整的类型定义和智能提示，让开发过程更加高效、安全，减少运行时错误"
        :tags="['类型安全', '智能提示']"
      />
      <FeatureCard
        icon="⚡"
        title="高性能渲染"
        details="基于 SVG 的矢量渲染引擎，无损缩放，完美适配各种分辨率，支持多种导出格式"
        :tags="['SVG', '高性能']"
      />
      <FeatureCard
        icon="📖"
        title="声明式 API"
        details="简洁直观的配置语法，用数据驱动视图，专注于内容创作而非实现细节"
        :tags="['声明式', '易用']"
      />
    </div>
  </div>
</div>

## 为什么选择 Infographic？

<div class="why-grid">
  <div class="why-card">
    <div class="why-icon">🎯</div>
    <h3 class="why-title">专注信息图表达</h3>
    <p class="why-desc">与通用图表库不同，Infographic 专为信息图设计，提供了更贴合实际业务场景的组件和布局，让你的数据故事更具表现力。</p>
  </div>

  <div class="why-card">
    <div class="why-icon">⚡</div>
    <h3 class="why-title">开发效率提升 10 倍</h3>
    <ul class="why-list">
      <li>3 分钟创建第一个信息图</li>
      <li>30+ 模板覆盖常见场景</li>
      <li>零配置开箱即用</li>
      <li>TypeScript 全面支持</li>
    </ul>
  </div>

  <div class="why-card">
    <div class="why-icon">🎨</div>
    <h3 class="why-title">视觉效果专业</h3>
    <p class="why-desc">精心打磨的视觉效果，内置多种主题风格，无需设计师也能产出专业级作品。</p>
  </div>
</div>

<ScenarioShowcase />

<CTASection />

<style scoped>
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
  line-height: 1.3;
  padding: 8px 0;
  display: inline-block;
  width: 100%;
}

/* Markdown 标题样式 */
h2 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin: 80px 0 60px;
  background: linear-gradient(120deg, #1890ff, #52c41a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.4;
  padding: 8px 0;
  border: none;
}

.features-section {
  padding: 80px 0;
  background: var(--vp-c-bg-alt);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin: 0 auto 80px;
  max-width: 1200px;
  padding: 0 24px;
}

.why-card {
  padding: 40px 32px;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.why-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.why-card:hover {
  transform: translateY(-8px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 12px 32px rgba(24, 144, 255, 0.15);
}

.why-card:hover::before {
  transform: scaleX(1);
}

.why-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  display: block;
  transition: transform 0.3s ease;
}

.why-card:hover .why-icon {
  transform: scale(1.1) rotate(-5deg);
}

.why-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
  position: relative;
  z-index: 1;
}

.why-desc {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
  position: relative;
  z-index: 1;
}

.why-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 1;
}

.why-list li {
  padding: 8px 0 8px 28px;
  position: relative;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  line-height: 1.6;
}

.why-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--vp-c-brand);
  font-weight: bold;
  font-size: 1.1em;
}

.why-list li:hover {
  color: var(--vp-c-text-1);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
    margin-bottom: 40px;
  }

  .features-grid,
  .why-grid {
    grid-template-columns: 1fr;
  }
}
</style>
