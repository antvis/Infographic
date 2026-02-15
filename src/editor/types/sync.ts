import type { InfographicOptionPath } from '../../options';

/**
 * Sync callback
 * @param newValue The new value after modification
 * @param oldValue The old value before modification. Note: This value is undefined when triggered by parent path bubbling notification (i.e., listening to a non-leaf node).
 */
export type SyncHandler = (newValue: any, oldValue: any) => void;

export interface ISyncRegistry {
  /**
   * Register synchronization logic
   * @param path Configuration path, such as 'design.background'
   * @param handler Sync callback
   * @param options.immediate Whether to execute immediately (used for view initialization)
   * @returns unregister function
   */
  register(
    path: InfographicOptionPath | (string & {}),
    handler: SyncHandler,
    options?: { immediate?: boolean },
  ): () => void;

  /**
   * Trigger synchronization (usually called by StateManager)
   * @param path Configuration path
   * @param newVal New value
   * @param oldVal Old value
   */
  trigger(path: string, newVal: any, oldVal: any): void;

  destroy(): void;
}
