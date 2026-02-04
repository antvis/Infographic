export type SyncHandler = (newValue: any, oldValue: any) => void;

export interface ISyncRegistry {
  /**
   * 注册同步逻辑
   * @param path 配置路径，如 'design.background'
   * @param handler 同步回调
   * @param options.immediate 是否立即执行一次（用于初始化视图）
   * @returns unregister 注销函数
   */
  register(
    path: string,
    handler: SyncHandler,
    options?: { immediate?: boolean },
  ): () => void;

  /**
   * 触发同步（通常由 StateManager 调用）
   * @param path 配置路径
   * @param newVal 新值
   * @param oldVal 旧值
   */
  trigger(path: string, newVal: any, oldVal: any): void;

  destroy(): void;
}
