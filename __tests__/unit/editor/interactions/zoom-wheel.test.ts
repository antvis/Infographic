import { afterEach, describe, expect, it, vi } from 'vitest';
import { UpdateOptionsCommand } from '../../../../src/editor/commands/UpdateOptions';
import { ZoomWheel } from '../../../../src/editor/interactions/zoom-wheel';
import * as EditorUtils from '../../../../src/editor/utils';
import '../../../setup/dom-polyfills';

// Helper to create SVG with viewBox attribute
const createSVG = (viewBox: string) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', viewBox);
  // Mock getScreenCTM for clientToViewport
  (svg as any).getScreenCTM = () => new DOMMatrix();
  return svg;
};

// Helper to parse viewBox string from command
const parseViewBox = (command: UpdateOptionsCommand) => {
  const viewBoxStr = command.serialize().options.viewBox as string;
  if (!viewBoxStr) return null;
  const [x, y, width, height] = viewBoxStr.split(' ').map(Number);
  return { x, y, width, height };
};

describe('ZoomWheel interaction', () => {
  describe('center zoom (Shift + Wheel)', () => {
    it('zooms out (deltaY > 0, Shift) - increases viewBox size', () => {
      const svg = createSVG('0 0 100 100');
      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => true) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      const event = new WheelEvent('wheel', { deltaY: 120, shiftKey: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(commander.execute).toHaveBeenCalledTimes(1);
      const viewBox = parseViewBox(commander.execute.mock.calls[0][0]);
      // deltaY > 0 => factor = 1.1, viewBox gets larger (zoom out)
      expect(viewBox?.width).toBeCloseTo(110, 1);
      expect(viewBox?.height).toBeCloseTo(110, 1);

      instance.destroy();
    });

    it('zooms in (deltaY < 0, Shift) - decreases viewBox size', () => {
      const svg = createSVG('0 0 100 100');
      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => true) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      const event = new WheelEvent('wheel', { deltaY: -120, shiftKey: true });
      document.dispatchEvent(event);

      expect(commander.execute).toHaveBeenCalledTimes(1);
      const viewBox = parseViewBox(commander.execute.mock.calls[0][0]);
      // deltaY < 0 => factor = 1/1.1, viewBox gets smaller (zoom in)
      expect(viewBox?.width).toBeCloseTo(90.9, 1);
      expect(viewBox?.height).toBeCloseTo(90.9, 1);

      instance.destroy();
    });

    it('maintains center point when zooming', () => {
      const svg = createSVG('50 50 100 100'); // center at (100, 100)
      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => true) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      const event = new WheelEvent('wheel', { deltaY: 120, shiftKey: true });
      document.dispatchEvent(event);

      const viewBox = parseViewBox(commander.execute.mock.calls[0][0]);
      // Center should remain at (100, 100): x + width/2 = 100
      const newCenter = {
        x: viewBox!.x + viewBox!.width / 2,
        y: viewBox!.y + viewBox!.height / 2,
      };
      expect(newCenter.x).toBeCloseTo(100, 1);
      expect(newCenter.y).toBeCloseTo(100, 1);

      instance.destroy();
    });
  });

  describe('mouse zoom (Ctrl/Meta + Wheel)', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('zooms with Ctrl key (mouse point zoom)', () => {
      const svg = createSVG('0 0 100 100');
      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => true) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      // Mock clientToViewport to return a specific point (e.g., 25, 25)
      // This represents the mouse cursor position in SVG coordinates
      const clientToViewportSpy = vi.spyOn(EditorUtils, 'clientToViewport');
      clientToViewportSpy.mockReturnValue({ x: 25, y: 25 } as DOMPoint);

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      // Zoom Out (deltaY > 0) -> factor = 1.1
      // Current: 0, 0, 100, 100
      // Pivot: 25, 25
      // New Width: 110
      // New X = 25 - (25 - 0) * 1.1 = 25 - 27.5 = -2.5
      // New Y = 25 - (25 - 0) * 1.1 = 25 - 27.5 = -2.5

      const event = new WheelEvent('wheel', {
        deltaY: 120,
        ctrlKey: true,
        clientX: 100, // Arbitrary, mocked by clientToViewport
        clientY: 100,
      });
      document.dispatchEvent(event);

      expect(commander.execute).toHaveBeenCalledTimes(1);
      const viewBox = parseViewBox(commander.execute.mock.calls[0][0]);

      expect(viewBox?.width).toBeCloseTo(110, 1);
      expect(viewBox?.height).toBeCloseTo(110, 1);
      expect(viewBox?.x).toBeCloseTo(-2.5, 1);
      expect(viewBox?.y).toBeCloseTo(-2.5, 1);

      instance.destroy();
    });

    it('zooms with Meta key (Cmd on Mac) at a different point', () => {
      const svg = createSVG('0 0 100 100');
      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => true) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      // Mock mouse at (80, 80)
      const clientToViewportSpy = vi.spyOn(EditorUtils, 'clientToViewport');
      clientToViewportSpy.mockReturnValue({ x: 80, y: 80 } as DOMPoint);

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      // Zoom In (deltaY < 0) -> factor = 1/1.1 ≈ 0.90909
      // Current: 0, 0, 100, 100
      // Pivot: 80, 80
      // New Width: 90.909
      // New X = 80 - (80 - 0) * 0.90909 = 80 - 72.7272 = 7.2727
      // New Y = 80 - (80 - 0) * 0.90909 = 7.2727

      const event = new WheelEvent('wheel', {
        deltaY: -120,
        metaKey: true,
      });
      document.dispatchEvent(event);

      expect(commander.execute).toHaveBeenCalledTimes(1);
      const viewBox = parseViewBox(commander.execute.mock.calls[0][0]);

      expect(viewBox?.width).toBeCloseTo(90.909, 3);
      expect(viewBox?.height).toBeCloseTo(90.909, 3);
      expect(viewBox?.x).toBeCloseTo(7.273, 3);
      expect(viewBox?.y).toBeCloseTo(7.273, 3);

      instance.destroy();
    });
  });

  describe('reset zoom (Ctrl/Meta + Shift + Wheel)', () => {
    it('resets viewBox when Ctrl + Shift are both pressed', () => {
      const svg = createSVG('0 0 100 100');
      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => true) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      const event = new WheelEvent('wheel', {
        deltaY: 120,
        ctrlKey: true,
        shiftKey: true,
      });
      document.dispatchEvent(event);

      expect(commander.execute).toHaveBeenCalledTimes(1);
      const command = commander.execute.mock
        .calls[0][0] as UpdateOptionsCommand;
      expect(command.serialize().options.viewBox).toBeUndefined();

      instance.destroy();
    });
  });

  describe('modifier keys', () => {
    it('does not zoom without modifier keys (Ctrl/Meta/Shift)', () => {
      const svg = createSVG('0 0 100 100');
      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => true) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      const event = new WheelEvent('wheel', { deltaY: 120 });
      document.dispatchEvent(event);

      expect(commander.execute).not.toHaveBeenCalled();
      instance.destroy();
    });
  });

  describe('interaction state', () => {
    it('does not zoom when interaction is not active', () => {
      const svg = createSVG('0 0 100 100');
      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => false) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      const event = new WheelEvent('wheel', { deltaY: 120, ctrlKey: true });
      document.dispatchEvent(event);

      expect(commander.execute).not.toHaveBeenCalled();
      instance.destroy();
    });
  });

  describe('boundary conditions', () => {
    it('prevents zoom out when viewBox would exceed MAX_VIEWBOX_SIZE', () => {
      // ViewBox at 1900, zooming out by 1.1 = 2090 > 2000
      const svg = createSVG('0 0 1900 1900');
      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => true) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      // deltaY > 0 => zoom out => viewBox gets larger
      const event = new WheelEvent('wheel', { deltaY: 120, shiftKey: true });
      document.dispatchEvent(event);

      expect(commander.execute).not.toHaveBeenCalled();
      instance.destroy();
    });

    it('prevents zoom in when viewBox would be below MIN_VIEWBOX_SIZE', () => {
      // ViewBox at 21, zooming in by 1/1.1 ≈ 19 < 20
      const svg = createSVG('0 0 21 21');
      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => true) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      // deltaY < 0 => zoom in => viewBox gets smaller
      const event = new WheelEvent('wheel', { deltaY: -120, shiftKey: true });
      document.dispatchEvent(event);

      expect(commander.execute).not.toHaveBeenCalled();
      instance.destroy();
    });
  });

  describe('edge cases', () => {
    it('does not zoom when deltaY is zero (no scrolling)', () => {
      const svg = createSVG('0 0 100 100');
      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => true) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      const event = new WheelEvent('wheel', { deltaY: 0, shiftKey: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(commander.execute).not.toHaveBeenCalled();
      instance.destroy();
    });

    it('handles SVG without viewBox attribute (falls back to width/height)', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '200');
      svg.setAttribute('height', '150');
      (svg as any).getScreenCTM = () => new DOMMatrix();

      const commander = { execute: vi.fn() } as any;
      const interaction = { isActive: vi.fn(() => true) } as any;
      const state = { getOptions: vi.fn(() => ({})) } as any;

      const instance = new ZoomWheel();
      instance.init({
        emitter: {} as any,
        editor: { getDocument: () => svg } as any,
        commander,
        interaction,
        state,
      });

      const event = new WheelEvent('wheel', { deltaY: 120, shiftKey: true });
      document.dispatchEvent(event);

      expect(commander.execute).toHaveBeenCalledTimes(1);
      const viewBox = parseViewBox(commander.execute.mock.calls[0][0]);
      expect(viewBox?.width).toBeCloseTo(220, 1);
      expect(viewBox?.height).toBeCloseTo(165, 1);

      instance.destroy();
    });
  });
});
