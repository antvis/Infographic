import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

// 导入自定义组件
import CTASection from './components/CTASection.vue';
import FeatureCard from './components/FeatureCard.vue';
import HomeHero from './components/HomeHero.vue';
import ScenarioShowcase from './components/ScenarioShowcase.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: any }) {
    // 注册全局组件
    app.component('HomeHero', HomeHero);
    app.component('FeatureCard', FeatureCard);
    app.component('ScenarioShowcase', ScenarioShowcase);
    app.component('CTASection', CTASection);
  },
} satisfies Theme;
