<template>
  <div
    class="feature-card"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :style="cardStyle"
  >
    <div class="card-glow" :style="glowStyle"></div>

    <div class="feature-icon" :style="iconStyle">
      {{ icon }}
    </div>

    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-details">{{ details }}</p>

    <div class="feature-tags" v-if="tags">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="tag"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  icon: string
  title: string
  details: string
  tags?: string[]
}

defineProps<Props>()

const isHovered = ref(false)

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}

const cardStyle = computed(() => ({
  transform: isHovered.value ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
}))

const glowStyle = computed(() => ({
  opacity: isHovered.value ? '0.6' : '0',
}))

const iconStyle = computed(() => ({
  transform: isHovered.value ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)',
}))
</script>

<style scoped>
.feature-card {
  position: relative;
  padding: 32px;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  cursor: pointer;
}

.feature-card::before {
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

.feature-card:hover::before {
  transform: scaleX(1);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(24, 144, 255, 0.15) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  display: inline-block;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(24, 144, 255, 0.2));
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}

.feature-details {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0 0 16px;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.85rem;
  border-radius: 12px;
  background: rgba(24, 144, 255, 0.1);
  color: var(--vp-c-brand);
  font-weight: 500;
  transition: all 0.2s ease;
}

.tag:hover {
  background: rgba(24, 144, 255, 0.2);
  transform: scale(1.05);
}

.dark .card-glow {
  background: radial-gradient(
    circle,
    rgba(24, 144, 255, 0.2) 0%,
    transparent 70%
  );
}

.dark .tag {
  background: rgba(24, 144, 255, 0.15);
}

.dark .tag:hover {
  background: rgba(24, 144, 255, 0.25);
}
</style>
