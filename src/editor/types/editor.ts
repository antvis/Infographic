export interface IEditor {
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  emit(event: string | symbol, ...args: any[]): boolean;
  off(event: string | symbol, listener: (...args: any[]) => void): this;
  getDocument(): SVGSVGElement;
  destroy(): void;
}
