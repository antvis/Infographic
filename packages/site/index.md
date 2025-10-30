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
        details="30+ 内置组件，15+ 结构布局，几分钟即可创建信息图"
        :tags="['30+ 组件', '15+ 布局']"
      />
      <FeatureCard
        icon="🎨"
        title="主题系统"
        details="支持手绘风（rough）、渐变（gradient）、图案（pattern）等风格，一键切换"
        :tags="['多主题', '可定制']"
      />
      <FeatureCard
        icon="🧩"
        title="组件化架构"
        details="数据、结构、样式完全解耦，支持自定义扩展"
        :tags="['组件化', '可扩展']"
      />
      <FeatureCard
        icon="💎"
        title="TypeScript"
        details="完整的类型定义和智能提示"
        :tags="['类型安全', '智能提示']"
      />
      <FeatureCard
        icon="⚡"
        title="SVG 渲染"
        details="矢量渲染，无损缩放，支持导出多种格式"
        :tags="['SVG', '矢量']"
      />
      <FeatureCard
        icon="📖"
        title="声明式 API"
        details="配置即视图，用数据驱动而非命令式操作"
        :tags="['声明式', '易用']"
      />
    </div>
  </div>
</div>

## 为什么选择 Infographic？

<div class="why-grid">
  <div class="why-card">
    <div class="why-icon">🎯</div>
    <h3 class="why-title">专为信息图设计</h3>
    <p class="why-desc">不是通用图表库，而是专门用于信息图渲染的框架。提供了 Title、Item、Structure 等信息图特有的设计元素。</p>
  </div>

  <div class="why-card">
    <div class="why-icon">⚡</div>
    <h3 class="why-title">快速开发</h3>
    <ul class="why-list">
      <li>声明式配置，无需手动布局</li>
      <li>15+ 内置结构布局</li>
      <li>TypeScript 类型支持</li>
      <li>可自定义扩展</li>
    </ul>
  </div>

  <div class="why-card">
    <div class="why-icon">🎨</div>
    <h3 class="why-title">主题和样式</h3>
    <p class="why-desc">内置主题系统，支持风格化渲染（手绘风、渐变、图案），可通过 themeConfig 自定义样式。</p>
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
