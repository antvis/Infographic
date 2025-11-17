import { ConfigProvider, theme } from 'antd';
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * 主题提供者组件
 * 自动检测页面主题并配置 antd 的主色
 */
const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // 检测主题变化
  useEffect(() => {
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-theme');
      setIsDark(currentTheme === 'dark');
    };

    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: isDark ? '#25c2a0' : '#2e8555',
        },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
