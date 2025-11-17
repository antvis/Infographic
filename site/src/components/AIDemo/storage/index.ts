/**
 * 存储管理器
 * 统一的存储访问点，方便后期切换存储实现
 */

import { IStorage } from './IStorage';
import { LocalStorage } from './LocalStorage';

// 默认使用本地存储，后期可以根据配置切换到在线存储
let storageInstance: IStorage = new LocalStorage();

/**
 * 获取存储实例
 */
export function getStorage(): IStorage {
  return storageInstance;
}

/**
 * 设置存储实现（用于切换到在线存储）
 */
export function setStorage(storage: IStorage): void {
  storageInstance = storage;
}

// 导出类型和接口
export * from './IStorage';
export { LocalStorage } from './LocalStorage';
