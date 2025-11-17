/**
 * 存储接口
 * 支持本地存储和在线存储的统一接口
 */

import { AIModelConfig, ChatMessage } from '../types';

/**
 * 配置项（带统计信息）
 */
export interface ConfigWithStats extends AIModelConfig {
  id: string;
  name: string; // 用户自定义名称
  createdAt: number;
  lastUsedAt: number;
  totalUsage: {
    requests: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * 存储接口
 */
export interface IStorage {
  // 配置管理
  saveConfig(config: ConfigWithStats): Promise<void>;
  getConfig(id: string): Promise<ConfigWithStats | null>;
  getAllConfigs(): Promise<ConfigWithStats[]>;
  deleteConfig(id: string): Promise<void>;
  updateConfigStats(
    id: string,
    usage: Partial<ConfigWithStats['totalUsage']>,
  ): Promise<void>;

  // 对话历史
  saveMessages(messages: ChatMessage[]): Promise<void>;
  getMessages(): Promise<ChatMessage[]>;
  clearMessages(): Promise<void>;

  // 当前选中的配置
  setActiveConfigId(id: string): Promise<void>;
  getActiveConfigId(): Promise<string | null>;
}
