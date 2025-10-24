<template>
  <div class="custom-hero">
    <div class="hero-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <div class="hero-content">
      <h1 class="hero-title">
        <span class="title-gradient">{{ title }}</span>
      </h1>
      <p class="hero-subtitle">{{ subtitle }}</p>
      <p class="hero-tagline">{{ tagline }}</p>

      <div class="hero-actions">
        <a
          v-for="(action, index) in actions"
          :key="index"
          :href="action.link"
          :class="['hero-button', `button-${action.theme}`]"
        >
          {{ action.text }}
        </a>
      </div>

      <div class="hero-stats">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="stat-item"
        >
          <div class="stat-number">{{ stat.number }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = '@antv/infographic'
const subtitle = '新一代信息图可视化引擎'
const tagline = '让数据叙事更简单、更优雅、更高效'

const actions = [
  { text: '快速开始 →', link: '/guide/getting-started', theme: 'brand' },
  { text: '在线示例', link: '/examples/', theme: 'alt' },
  { text: 'GitHub', link: 'https://github.com/antvis/infographic', theme: 'alt' },
]

const stats = ref([
  { number: '30+', label: '数据项设计' },
  { number: '20+', label: '结构布局' },
  { number: '70+', label: '内置模版' },
  { number: '100%', label: 'TypeScript' },
])
</script>

<style scoped>
.custom-hero {
  position: relative;
  padding: 120px 24px 80px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.3) 0%, transparent 70%);
  top: -200px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(82, 196, 26, 0.25) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  animation-delay: -7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(250, 140, 22, 0.2) 0%, transparent 70%);
  bottom: -100px;
  left: 50%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
}

.title-gradient {
  background: linear-gradient(120deg, #1890ff 30%, #52c41a 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.8s ease-out;
}

.hero-subtitle {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
  animation: fadeInUp 0.8s ease-out 0.1s both;
}

.hero-tagline {
  font-size: 1.25rem;
  color: var(--vp-c-text-2);
  margin: 0 0 48px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 80px;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

.hero-button {
  display: inline-block;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.button-brand {
  background: linear-gradient(135deg, #1890ff, #1366d9);
  color: white;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.button-brand:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(24, 144, 255, 0.4);
}

.button-alt {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.button-alt:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 32px;
  max-width: 800px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat-item {
  text-align: center;
  padding: 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(120deg, #1890ff, #52c41a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  line-height: 1.3;
  padding: 4px 0;
  display: inline-block;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .custom-hero {
    padding: 80px 24px 60px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .hero-tagline {
    font-size: 1rem;
  }

  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-number {
    font-size: 2rem;
  }
}

.dark .button-alt {
  background: var(--vp-c-bg-soft);
}

.dark .stat-item {
  background: var(--vp-c-bg-soft);
}
</style>
