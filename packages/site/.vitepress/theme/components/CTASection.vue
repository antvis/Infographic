<template>
  <div class="cta-section">
    <div class="cta-background">
      <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
    </div>

    <div class="cta-content">
      <h2 class="cta-title">🚀 准备好创建精美的信息图了吗？</h2>
      <p class="cta-subtitle">加入数千开发者，开始你的信息图之旅</p>

      <div class="cta-actions">
        <a href="/guide/getting-started" class="cta-button primary">
          <span>快速开始</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 3.293a1 1 0 010 1.414L6.414 9H17a1 1 0 110 2H6.414l4.293 4.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" transform="rotate(180 10 10)"/>
          </svg>
        </a>
        <a href="/examples/" class="cta-button secondary">查看示例</a>
        <a href="/api/" class="cta-button secondary">API 文档</a>
      </div>

      <div class="cta-stats">
        <div class="stat">
          <div class="stat-icon">⭐</div>
          <div class="stat-text">开源免费</div>
        </div>
        <div class="stat">
          <div class="stat-icon">⚡</div>
          <div class="stat-text">快速上手</div>
        </div>
        <div class="stat">
          <div class="stat-icon">🎨</div>
          <div class="stat-text">专业设计</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const getParticleStyle = (_index: number) => {
  const size = Math.random() * 4 + 2
  const duration = Math.random() * 10 + 15
  const delay = Math.random() * 5

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  }
}
</script>

<style scoped>
.cta-section {
  position: relative;
  padding: 100px 24px;
  margin: 80px 0;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(
    135deg,
    rgba(24, 144, 255, 0.08) 0%,
    rgba(82, 196, 26, 0.08) 100%
  );
}

.cta-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(24, 144, 255, 0.4);
  border-radius: 50%;
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(20px);
    opacity: 0;
  }
}

.cta-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 16px;
  background: linear-gradient(120deg, #1890ff, #52c41a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
  padding: 8px 0;
  display: inline-block;
}

.cta-subtitle {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin: 0 0 40px;
}

.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.cta-button:hover::before {
  width: 300px;
  height: 300px;
}

.cta-button.primary {
  background: linear-gradient(135deg, #1890ff, #1366d9);
  color: white;
  box-shadow: 0 8px 24px rgba(24, 144, 255, 0.3);
}

.cta-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(24, 144, 255, 0.4);
}

.cta-button.secondary {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-divider);
}

.cta-button.secondary:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.cta-stats {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
}

.stat:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 1.8rem;
}

.stat-text {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  .cta-section {
    padding: 60px 24px;
    margin: 60px 0;
  }

  .cta-title {
    font-size: 1.8rem;
  }

  .cta-subtitle {
    font-size: 1rem;
  }

  .cta-actions {
    flex-direction: column;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
  }

  .cta-stats {
    flex-direction: column;
    gap: 16px;
  }
}

.dark .cta-section {
  background: linear-gradient(
    135deg,
    rgba(24, 144, 255, 0.12) 0%,
    rgba(82, 196, 26, 0.12) 100%
  );
}
</style>
