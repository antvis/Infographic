/**
 * usePreviewSettings - 预览页面的设置状态管理
 *
 * 职责：
 * - 管理模板、数据源、主题、颜色等表单配置状态
 * - 从 localStorage 恢复/持久化用户设置（SSR 安全）
 * - 提供预先 memo 化的 Select options 避免不必要的重渲染
 *
 * 设计考量：
 * - 状态初始化使用默认值，然后在 useEffect 中 hydrate（SSR 兼容）
 * - localStorage 写入使用 300ms 防抖，避免高频操作（如拖动颜色选择器）时频繁 I/O
 * - 返回对象使用 useMemo 包装，确保引用稳定性
 *
 * @returns 设置状态和 setter 函数的稳定对象引用
 */
import { getTemplates } from '@antv/infographic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DATA_KEYS, DEFAULT_DATA_KEY, type DataKey } from '../data';
import { getStoredValues, setStoredValues } from '../utils/storage';

const templates = getTemplates();
const STORAGE_KEY = 'preview-form-values';

type FormValues = {
  template: string;
  data: DataKey;
  theme: 'light' | 'dark' | 'hand-drawn';
  colorPrimary: string;
  enablePrimary: boolean;
  enablePalette: boolean;
};

export const usePreviewSettings = () => {
  // SSR safe: initialize with defaults, hydrate in useEffect
  const [template, setTemplate] = useState(templates[0]);
  const [data, setData] = useState<DataKey>(DEFAULT_DATA_KEY);
  const [theme, setTheme] = useState<string>('light');
  const [colorPrimary, setColorPrimary] = useState('#FF356A');
  const [enablePrimary, setEnablePrimary] = useState(true);
  const [enablePalette, setEnablePalette] = useState(false);
  const [isSettingsHydrated, setIsSettingsHydrated] = useState(false);

  // Hydrate all state from localStorage on client mount (SSR safe)
  useEffect(() => {
    // 1. Load form values
    const storedValues = getStoredValues<FormValues>(STORAGE_KEY, (stored) => {
      const fallbacks: Partial<FormValues> = {};
      if (stored.template && !templates.includes(stored.template)) {
        fallbacks.template = templates[0];
      }
      if (stored.data && !DATA_KEYS.includes(stored.data)) {
        fallbacks.data = DATA_KEYS[0];
      }
      return fallbacks;
    });

    if (storedValues) {
      if (storedValues.template) setTemplate(storedValues.template);
      if (storedValues.data) setData(storedValues.data);
      if (storedValues.theme) setTheme(storedValues.theme);
      if (storedValues.colorPrimary) setColorPrimary(storedValues.colorPrimary);
      if (storedValues.enablePrimary !== undefined)
        setEnablePrimary(storedValues.enablePrimary);
      if (storedValues.enablePalette !== undefined)
        setEnablePalette(storedValues.enablePalette);
    }

    setIsSettingsHydrated(true);
  }, []);

  // Save to localStorage when values change (debounced 300ms)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isSettingsHydrated) return;

    // 清除之前的定时器
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // 300ms 后写入 localStorage
    saveTimeoutRef.current = setTimeout(() => {
      setStoredValues(STORAGE_KEY, {
        template,
        data,
        theme,
        colorPrimary,
        enablePrimary,
        enablePalette,
      });
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    template,
    data,
    theme,
    colorPrimary,
    enablePrimary,
    enablePalette,
    isSettingsHydrated,
  ]);

  // Pre-memoized options for Select components
  const templateOptions = useMemo(
    () => templates.map((value) => ({ label: value, value })),
    [], // templates is static, no deps needed
  );

  const dataKeyOptions = useMemo(
    () => DATA_KEYS.map((key) => ({ label: key, value: key })),
    [], // DATA_KEYS is static, no deps needed
  );

  return useMemo(
    () => ({
      isSettingsHydrated,
      template,
      setTemplate,
      data,
      setData,
      theme,
      setTheme,
      colorPrimary,
      setColorPrimary,
      enablePrimary,
      setEnablePrimary,
      enablePalette,
      setEnablePalette,
      templates,
      DATA_KEYS,
      templateOptions,
      dataKeyOptions,
    }),
    [
      isSettingsHydrated,
      template,
      data,
      theme,
      colorPrimary,
      enablePrimary,
      enablePalette,
      templateOptions,
      dataKeyOptions,
    ],
  );
};
