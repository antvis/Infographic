/**
 * usePreviewData - 预览页面的数据编辑状态管理
 *
 * 职责：
 * - 管理 JSON 编辑器中的自定义数据（customData）
 * - 管理用于渲染的数据（renderingDataStr，带 500ms 防抖）
 * - 解析 JSON 并处理解析错误，提供 fallback 数据
 * - 持久化/恢复用户编辑的自定义数据到 localStorage
 *
 * 设计考量：
 * - customData: 编辑器实时输入，无延迟
 * - renderingDataStr: 防抖后的数据，用于渲染 Infographic，避免输入时频繁重绘
 * - JSON 解析在 useMemo 中进行，解析失败时 fallback 到当前选中的数据源
 * - 返回对象使用 useMemo 包装，确保引用稳定性
 *
 * @param isReady - 是否可以开始加载（等待 settings hydrate 完成）
 * @param currentDataKey - 当前数据源 key，用于解析失败时的 fallback
 * @returns 数据状态、解析结果和操作函数的稳定对象引用
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DATASET, type DataKey } from '../data';
import {
  getStoredValues,
  removeStoredValue,
  setStoredValues,
} from '../utils/storage';

const CUSTOM_DATA_STORAGE_KEY = 'preview-custom-data';

export const usePreviewData = (
  isReady: boolean, // Allow parent to control when we start (e.g. wait for settings)
  currentDataKey: DataKey, // Needed for default fallback in parsing error
) => {
  // State for custom data
  const [savedDataStr, setSavedDataStr] = useState<string | null>(null);
  const [customData, setCustomData] = useState<string>('{}'); // Will be initialized by parent or hydration
  const [isDataHydrated, setIsDataHydrated] = useState(false);

  // The actual data string used for rendering (debounced from editor, or immediate from selection)
  const [renderingDataStr, setRenderingDataStr] = useState<string>(customData);

  // Load custom data
  useEffect(() => {
    if (!isReady) return;

    const savedCustomData = getStoredValues<{ data: string }>(
      CUSTOM_DATA_STORAGE_KEY,
    );

    if (savedCustomData?.data) {
      const raw = savedCustomData.data;
      setSavedDataStr(raw);
      setCustomData(raw);
      setRenderingDataStr(raw);
    }
    // Note: If no custom data, we don't do anything here.
    // The parent (usePreviewState) is responsible for deriving initial data
    // from settings if isDataHydrated finds no custom data.

    setIsDataHydrated(true);
  }, [isReady]);

  // Debounce effect: sync customData to renderingDataStr with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderingDataStr(customData);
    }, 500);
    return () => clearTimeout(timer);
  }, [customData]);

  const isDataDirty = useMemo(() => {
    if (!isDataHydrated) return false;
    if (savedDataStr === null) return true;
    return customData !== savedDataStr;
  }, [customData, savedDataStr, isDataHydrated]);

  const handleSaveCustomData = useCallback(() => {
    setStoredValues(CUSTOM_DATA_STORAGE_KEY, {
      data: customData,
    });
    setSavedDataStr(customData);
  }, [customData]);

  const handleClearCustomDataStorage = useCallback(() => {
    removeStoredValue(CUSTOM_DATA_STORAGE_KEY);
    setSavedDataStr(null);
  }, []);

  // Parse rendering data without side effects in useMemo
  const { parsedData, parseError } = useMemo(() => {
    try {
      const parsed = JSON.parse(renderingDataStr);
      return { parsedData: parsed, parseError: '' };
    } catch (error) {
      return {
        parsedData: DATASET[currentDataKey],
        parseError: error instanceof Error ? error.message : 'Invalid JSON',
      };
    }
  }, [renderingDataStr, currentDataKey]);

  return useMemo(
    () => ({
      isDataHydrated,
      customData,
      setCustomData,
      savedDataStr,
      renderingDataStr,
      setRenderingDataStr,

      parsedData,
      parseError,
      isDataDirty,

      handleSaveCustomData,
      handleClearCustomDataStorage,
    }),
    [
      isDataHydrated,
      customData,
      savedDataStr,
      renderingDataStr,
      parsedData,
      parseError,
      isDataDirty,
      handleSaveCustomData,
      handleClearCustomDataStorage,
    ],
  );
};
