import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

interface FullPageScrollProps {
  children: React.ReactNode[];
}

export default function FullPageScroll({ children }: FullPageScrollProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartY = useRef(0);

  const totalSections = children.length;

  const scrollToSection = (index: number) => {
    if (index < 0 || index >= totalSections || isScrolling) return;

    setIsScrolling(true);
    setCurrentSection(index);

    // 滚动完成后重置状态
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000); // 1秒动画时间
  };

  // 检查当前 section 是否可以继续滚动
  const canScrollInSection = (direction: 'up' | 'down'): boolean => {
    const currentSectionEl = sectionRefs.current[currentSection];
    if (!currentSectionEl) return false;

    const { scrollTop, scrollHeight, clientHeight } = currentSectionEl;

    if (direction === 'down') {
      // 检查是否滚动到底部
      return scrollTop + clientHeight < scrollHeight - 5; // 5px 容差
    } else {
      // 检查是否在顶部
      return scrollTop > 5; // 5px 容差
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const direction = e.deltaY > 0 ? 'down' : 'up';

      // 检查当前 section 是否需要内部滚动
      if (canScrollInSection(direction)) {
        // 让浏览器处理内部滚动
        return;
      }

      // 阻止默认行为，进行翻页
      e.preventDefault();

      if (e.deltaY > 0) {
        // 向下滚动
        scrollToSection(currentSection + 1);
      } else {
        // 向上滚动
        scrollToSection(currentSection - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          scrollToSection(currentSection + 1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          scrollToSection(currentSection - 1);
          break;
        case 'Home':
          e.preventDefault();
          scrollToSection(0);
          break;
        case 'End':
          e.preventDefault();
          scrollToSection(totalSections - 1);
          break;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      // 滑动距离超过50px才触发
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          scrollToSection(currentSection + 1);
        } else {
          scrollToSection(currentSection - 1);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, isScrolling, totalSections]);

  return (
    <div ref={containerRef} className={styles.fullPageContainer}>
      <div
        className={styles.sectionsWrapper}
        style={{
          transform: `translateY(-${currentSection * 100}vh)`,
          transition: 'transform 1s cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            className={styles.section}
          >
            {child}
          </div>
        ))}
      </div>

      {/* 导航指示器 */}
      <div className={styles.navigation}>
        {children.map((_, index) => (
          <button
            key={index}
            className={`${styles.navDot} ${currentSection === index ? styles.active : ''}`}
            onClick={() => scrollToSection(index)}
            aria-label={`跳转到第 ${index + 1} 页`}
          />
        ))}
      </div>
    </div>
  );
}
