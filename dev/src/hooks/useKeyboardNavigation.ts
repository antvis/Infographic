/**
 * useKeyboardNavigation - 键盘导航 Hook
 *
 * 职责：
 * - 监听键盘事件，处理模板切换导航
 * - 支持上下左右方向键循环切换模板
 *
 * 设计考量：
 * - 从 Preview 组件中抽离，保持组件职责单一
 * - 使用 useCallback 确保事件处理函数稳定
 */
import { useCallback, useEffect } from 'react';

interface UseKeyboardNavigationOptions {
  templates: string[];
  currentTemplate: string;
  onTemplateChange: (template: string) => void;
}

export const useKeyboardNavigation = ({
  templates,
  currentTemplate,
  onTemplateChange,
}: UseKeyboardNavigationOptions) => {
  const navigateTemplate = useCallback(
    (direction: 'prev' | 'next') => {
      const currentIndex = templates.indexOf(currentTemplate);
      if (currentIndex === -1) return;

      let nextIndex: number;
      if (direction === 'prev') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : templates.length - 1;
      } else {
        nextIndex = currentIndex < templates.length - 1 ? currentIndex + 1 : 0;
      }

      onTemplateChange(templates[nextIndex]);
    },
    [templates, currentTemplate, onTemplateChange],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 避免在于编辑器或输入框中键入时触发导航
      const target = e.target as HTMLElement;
      const isInput =
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.isContentEditable;

      if (isInput) return;

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        navigateTemplate('prev');
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        navigateTemplate('next');
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateTemplate]);
};
