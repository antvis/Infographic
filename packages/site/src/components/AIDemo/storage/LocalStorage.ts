/**
 * 本地存储实现（使用 localStorage）
 */

import { ChatMessage } from '../types';
import { ConfigWithStats, IStorage } from './IStorage';

const KEYS = {
  CONFIGS: 'ai_demo_configs',
  MESSAGES: 'ai_demo_messages',
  ACTIVE_CONFIG: 'ai_demo_active_config',
};

export class LocalStorage implements IStorage {
  // 配置管理
  async saveConfig(config: ConfigWithStats): Promise<void> {
    const configs = await this.getAllConfigs();
    const index = configs.findIndex((c) => c.id === config.id);

    if (index >= 0) {
      configs[index] = config;
    } else {
      configs.push(config);
    }

    localStorage.setItem(KEYS.CONFIGS, JSON.stringify(configs));
  }

  async getConfig(id: string): Promise<ConfigWithStats | null> {
    const configs = await this.getAllConfigs();
    return configs.find((c) => c.id === id) || null;
  }

  async getAllConfigs(): Promise<ConfigWithStats[]> {
    try {
      const stored = localStorage.getItem(KEYS.CONFIGS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load configs:', error);
      return [];
    }
  }

  async deleteConfig(id: string): Promise<void> {
    const configs = await this.getAllConfigs();
    const filtered = configs.filter((c) => c.id !== id);
    localStorage.setItem(KEYS.CONFIGS, JSON.stringify(filtered));

    // 如果删除的是当前激活的配置，清除激活状态
    const activeId = await this.getActiveConfigId();
    if (activeId === id) {
      localStorage.removeItem(KEYS.ACTIVE_CONFIG);
    }
  }

  async updateConfigStats(
    id: string,
    usage: Partial<ConfigWithStats['totalUsage']>,
  ): Promise<void> {
    const config = await this.getConfig(id);
    if (!config) return;

    config.lastUsedAt = Date.now();
    config.totalUsage = {
      requests: (config.totalUsage.requests || 0) + (usage.requests || 0),
      promptTokens:
        (config.totalUsage.promptTokens || 0) + (usage.promptTokens || 0),
      completionTokens:
        (config.totalUsage.completionTokens || 0) +
        (usage.completionTokens || 0),
      totalTokens:
        (config.totalUsage.totalTokens || 0) + (usage.totalTokens || 0),
    };

    await this.saveConfig(config);
  }

  // 对话历史
  async saveMessages(messages: ChatMessage[]): Promise<void> {
    try {
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }

  async getMessages(): Promise<ChatMessage[]> {
    try {
      const stored = localStorage.getItem(KEYS.MESSAGES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  }

  async clearMessages(): Promise<void> {
    localStorage.removeItem(KEYS.MESSAGES);
  }

  // 当前选中的配置
  async setActiveConfigId(id: string): Promise<void> {
    localStorage.setItem(KEYS.ACTIVE_CONFIG, id);
  }

  async getActiveConfigId(): Promise<string | null> {
    return localStorage.getItem(KEYS.ACTIVE_CONFIG);
  }
}
