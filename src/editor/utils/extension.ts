export class Extension<T> {
  private extensions: Map<string, T> = new Map();

  register(name: string, extension: T, options?: { override?: boolean }) {
    if (!options?.override && this.extensions.has(name)) {
      throw new Error(`Extension "${name}" already registered`);
    }
    this.extensions.set(name, extension);
  }

  get(name: string): T | undefined {
    return this.extensions.get(name);
  }

  has(name: string): boolean {
    return this.extensions.has(name);
  }

  getAll(): ReadonlyMap<string, T> {
    return this.extensions;
  }

  forEach(callback: (extension: T, name: string) => void) {
    this.extensions.forEach((extension, name) => {
      callback(extension, name);
    });
  }

  [Symbol.iterator]() {
    return this.extensions.entries();
  }

  unregister(name: string): boolean {
    return this.extensions.delete(name);
  }

  destroy() {
    this.extensions.forEach((extension) => {
      if (extension && typeof (extension as any).dispose === 'function') {
        (extension as any).dispose();
      }
    });
    this.extensions.clear();
  }
}
