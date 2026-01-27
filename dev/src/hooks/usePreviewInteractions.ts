/**
 * usePreviewInteractions - 预览页面的交互逻辑和派生状态
 *
 * 职责：
 * - 协调 usePreviewSettings 和 usePreviewData 之间的状态同步
 * - 处理用户交互：切换模板、切换数据源、重置数据
 * - 计算派生配置：themeConfig（主题样式）、templateConfig（模板 JSON）
 *
 * 设计考量：
 * - 作为 "协调层"，组合 settings 和 data 两个 hook
 * - 初始化时若无自定义数据，则从 settings.template 推导初始数据
 * - applyTemplate 时会自动切换对应的数据源并清除用户编辑
 * - 所有 action 使用 useCallback 包装，依赖项为具体函数而非整个对象
 * - 返回对象使用 useMemo 包装，确保引用稳定性
 *
 * @param settings - usePreviewSettings 的返回值
 * @param previewData - usePreviewData 的返回值
 * @returns 交互处理函数和派生配置的稳定对象引用
 */
import { getTemplate, ThemeConfig } from '@antv/infographic';
import { useCallback, useEffect, useMemo } from 'react';
import { getDataByTemplate } from '../../../shared/get-template-data';
import { DATASET, DEFAULT_DATA_KEY, type DataKey } from '../data';
import type { usePreviewData } from './usePreviewData';
import type { usePreviewSettings } from './usePreviewSettings';

// Helper functions
const getDefaultDataString = (key: DataKey) =>
  JSON.stringify(DATASET[key], null, 2);

const resolvePreviewDataKey = (data: unknown) =>
  Object.keys(DATASET).find((key) => DATASET[key as DataKey] === data) ??
  DEFAULT_DATA_KEY;

type SettingsHook = ReturnType<typeof usePreviewSettings>;
type DataHook = ReturnType<typeof usePreviewData>;

export const usePreviewInteractions = (
  settings: SettingsHook,
  previewData: DataHook,
) => {
  const isHydrated = settings.isSettingsHydrated && previewData.isDataHydrated;

  // 1. Coordination: Initial Data Derivation
  useEffect(() => {
    if (!isHydrated) return;

    // If no custom data was restored, derive from settings
    if (previewData.savedDataStr === null && previewData.customData === '{}') {
      const restoredTemplate = settings.template;
      const templateData = getDataByTemplate(restoredTemplate);

      const dataValue = settings.data ? DATASET[settings.data] : templateData;

      const dataStr = JSON.stringify(dataValue, null, 2);
      previewData.setCustomData(dataStr);
      previewData.setRenderingDataStr(dataStr);
    }
  }, [
    isHydrated,
    previewData.savedDataStr,
    previewData.customData,
    previewData.setCustomData,
    previewData.setRenderingDataStr,
    settings.template,
    settings.data,
  ]);

  // 2. Computed Styles & Configs
  const themeConfig = useMemo<ThemeConfig | undefined>(() => {
    const config: ThemeConfig = {};
    if (settings.enablePrimary) {
      config.colorPrimary = settings.colorPrimary;
    }
    if (settings.theme === 'dark') {
      config.colorBg = '#333';
    }
    if (settings.enablePalette) {
      config.palette = [
        '#f94144',
        '#f3722c',
        '#f8961e',
        '#f9c74f',
        '#90be6d',
        '#43aa8b',
        '#577590',
      ];
    }
    return config;
  }, [
    settings.enablePrimary,
    settings.colorPrimary,
    settings.theme,
    settings.enablePalette,
  ]);

  const templateConfig = useMemo(() => {
    const config = getTemplate(settings.template);
    return config ? JSON.stringify(config, null, 2) : '{}';
  }, [settings.template]);

  // 3. Actions
  const applyTemplate = useCallback(
    (nextTemplate: string) => {
      const nextData = getDataByTemplate(nextTemplate);
      const key = resolvePreviewDataKey(nextData) as DataKey;

      settings.setTemplate(nextTemplate);
      settings.setData(key);

      const nextDataStr = JSON.stringify(nextData, null, 2);
      previewData.setCustomData(nextDataStr);
      previewData.setRenderingDataStr(nextDataStr);
      previewData.handleClearCustomDataStorage();
    },
    [
      settings.setTemplate,
      settings.setData,
      previewData.setCustomData,
      previewData.setRenderingDataStr,
      previewData.handleClearCustomDataStorage,
    ],
  );

  const handleDataChange = useCallback(
    (value: DataKey) => {
      settings.setData(value);
      const newDataStr = getDefaultDataString(value);
      previewData.setCustomData(newDataStr);
      previewData.setRenderingDataStr(newDataStr);
    },
    [
      settings.setData,
      previewData.setCustomData,
      previewData.setRenderingDataStr,
    ],
  );

  const handleResetCustomData = useCallback(() => {
    const defaultData = getDefaultDataString(settings.data);
    previewData.setCustomData(defaultData);
    previewData.setRenderingDataStr(defaultData);
    previewData.handleClearCustomDataStorage();
  }, [
    settings.data,
    previewData.setCustomData,
    previewData.setRenderingDataStr,
    previewData.handleClearCustomDataStorage,
  ]);

  return useMemo(
    () => ({
      isHydrated,
      themeConfig,
      templateConfig,
      applyTemplate,
      handleDataChange,
      handleResetCustomData,
    }),
    [
      isHydrated,
      themeConfig,
      templateConfig,
      applyTemplate,
      handleDataChange,
      handleResetCustomData,
    ],
  );
};
