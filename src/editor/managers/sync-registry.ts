import { ISyncRegistry, SyncHandler } from '../types';

type ValueProvider = (path: string) => any;

export class SyncRegistry implements ISyncRegistry {
  private handlers = new Map<string, Set<SyncHandler>>();
  // 递归锁
  private isDispatching = false;

  constructor(private valueProvider: ValueProvider) {}

  register(
    path: string,
    handler: SyncHandler,
    options?: { immediate?: boolean },
  ): () => void {
    if (!this.handlers.has(path)) {
      this.handlers.set(path, new Set());
    }
    this.handlers.get(path)!.add(handler);

    if (options?.immediate) {
      const currentVal = this.valueProvider(path);
      handler(currentVal, undefined);
    }

    return () => {
      const set = this.handlers.get(path);
      if (set) {
        set.delete(handler);
        if (set.size === 0) {
          this.handlers.delete(path);
        }
      }
    };
  }
  trigger(path: string, newVal: any, oldVal: any): void {
    if (this.isDispatching) {
      console.warn(
        `[SyncRegistry] Recursive update detected on ${path}. Skipped to prevent loop.`,
      );
      return;
    }

    const handlers = this.handlers.get(path);

    if (handlers) {
      this.isDispatching = true;
      try {
        handlers.forEach((fn) => fn(newVal, oldVal));
      } finally {
        this.isDispatching = false;
      }
    }
  }

  destroy() {
    this.handlers.clear();
  }
}
