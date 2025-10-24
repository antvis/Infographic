<template>
  <div class="scenario-showcase">
    <h2 class="section-title">丰富的应用场景</h2>

    <div class="scenarios-grid">
      <div
        v-for="(scenario, index) in scenarios"
        :key="index"
        class="scenario-card"
        @mouseenter="activeIndex = index"
        @mouseleave="activeIndex = null"
        :class="{ active: activeIndex === index }"
      >
        <div class="scenario-icon">{{ scenario.icon }}</div>
        <h3 class="scenario-title">{{ scenario.title }}</h3>
        <ul class="scenario-items">
          <li v-for="(item, i) in scenario.items" :key="i">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeIndex = ref<number | null>(null)

const scenarios = [
  {
    icon: '📊',
    title: '业务展示',
    items: ['产品特性介绍', '服务流程说明', '价值主张展示', '商业模式图']
  },
  {
    icon: '📈',
    title: '数据可视化',
    items: ['业绩报告', '统计仪表板', 'KPI 展示', '对比分析']
  },
  {
    icon: '🗓️',
    title: '时间叙事',
    items: ['公司发展历程', '项目里程碑', '产品迭代路线', '活动时间轴']
  },
  {
    icon: '🏢',
    title: '组织管理',
    items: ['组织架构图', '团队介绍', '岗位职责', '层级关系']
  },
  {
    icon: '📋',
    title: '流程图表',
    items: ['工作流程', '操作指南', '决策树', '业务流转']
  },
  {
    icon: '🎓',
    title: '教育培训',
    items: ['知识框架', '课程大纲', '学习路径', '概念图谱']
  }
]
</script>

<style scoped>
.scenario-showcase {
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
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

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.scenario-card {
  padding: 32px 24px;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.scenario-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.05), rgba(82, 196, 26, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scenario-card.active::before {
  opacity: 1;
}

.scenario-card.active {
  transform: translateY(-8px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 12px 32px rgba(24, 144, 255, 0.2);
}

.scenario-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  display: inline-block;
}

.scenario-card.active .scenario-icon {
  transform: scale(1.2) rotate(-10deg);
}

.scenario-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 20px;
  color: var(--vp-c-text-1);
  position: relative;
  z-index: 1;
}

.scenario-items {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 1;
}

.scenario-items li {
  padding: 8px 0 8px 24px;
  color: var(--vp-c-text-2);
  position: relative;
  transition: all 0.2s ease;
}

.scenario-items li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--vp-c-brand);
  font-weight: bold;
  transition: transform 0.2s ease;
}

.scenario-card.active .scenario-items li::before {
  transform: translateX(4px);
}

.scenario-items li:hover {
  color: var(--vp-c-brand);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .scenario-showcase {
    padding: 60px 24px;
  }

  .section-title {
    font-size: 2rem;
    margin-bottom: 40px;
  }

  .scenarios-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
