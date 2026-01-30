import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdateOptionsCommand } from '../../../../src/editor/commands';
import { DragCanvas } from '../../../../src/editor/interactions/drag-canvas';

// Hoist mocks to be used in vi.mock
const {
  clientToViewportMock,
  getViewBoxMock,
  viewBoxToStringMock,
  isTextSelectionTargetMock,
  executeMock,
} = vi.hoisted(() => {
  return {
    clientToViewportMock: vi.fn(),
    getViewBoxMock: vi.fn(),
    viewBoxToStringMock: vi.fn(),
    isTextSelectionTargetMock: vi.fn(),
    executeMock: vi.fn(),
  };
});

// Mock src/editor/utils
vi.mock('../../../../src/editor/utils', async () => {
  const actual = await vi.importActual<any>('../../../../src/editor/utils');
  return {
    ...actual,
    clientToViewport: clientToViewportMock,
    isTextSelectionTarget: isTextSelectionTargetMock,
  };
});

// Mock src/utils
vi.mock('../../../../src/utils', async () => {
  const actual = await vi.importActual<any>('../../../../src/utils');
  return {
    ...actual,
    getViewBox: getViewBoxMock,
    viewBoxToString: viewBoxToStringMock,
  };
});

vi.mock('../../../../src/editor/commands', () => {
  return {
    UpdateOptionsCommand: vi
      .fn()
      .mockImplementation((options, prevOptions) => ({
        execute: executeMock,
        options,
        prevOptions,
      })),
  };
});

describe('DragCanvas Interaction', () => {
  let instance: DragCanvas;
  let svg: SVGSVGElement;
  let interaction: any;
  let commander: any;
  let state: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svg);

    // Mock Interaction manager
    interaction = {
      isActive: vi.fn(() => true),
      executeExclusiveInteraction: vi.fn((_inst, cb) => cb()),
    };

    commander = {
      execute: vi.fn(),
    };

    state = {
      updateOptions: vi.fn(),
    };

    instance = new DragCanvas();
    instance.init({
      emitter: {} as any,
      editor: { getDocument: () => svg } as any,
      commander,
      state,
      interaction,
    });

    document.body.style.cursor = 'default';

    // Mock utils defaults
    getViewBoxMock.mockReturnValue({ x: 0, y: 0, width: 100, height: 100 });
    viewBoxToStringMock.mockImplementation(
      (box: any) => `${box.x} ${box.y} ${box.width} ${box.height}`,
    );
    clientToViewportMock.mockReturnValue({ x: 0, y: 0 });
    isTextSelectionTargetMock.mockReturnValue(false);
  });

  afterEach(() => {
    instance.destroy();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  // Helper to activate the interaction (Hover + Space)
  const activateInteraction = async () => {
    svg.dispatchEvent(new MouseEvent('mouseenter'));
    const event = new KeyboardEvent('keydown', {
      code: 'Space',
      bubbles: true,
    });
    document.body.dispatchEvent(event);
    await Promise.resolve();
  };

  describe('Activation Logic (Behavior)', () => {
    it('does not activate if interaction is disabled', () => {
      interaction.isActive.mockReturnValue(false);
      const event = new KeyboardEvent('keydown', {
        code: 'Space',
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.body.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('does not activate if target is text input', () => {
      isTextSelectionTargetMock.mockReturnValue(true);
      const event = new KeyboardEvent('keydown', {
        code: 'Space',
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.body.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('does not activate if target is outside editor and body', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const event = new KeyboardEvent('keydown', {
        code: 'Space',
        bubbles: true,
      });

      div.dispatchEvent(event);
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      document.body.removeChild(div);
    });

    it('does not activate for non-trigger key', () => {
      svg.dispatchEvent(new MouseEvent('mouseenter'));
      const event = new KeyboardEvent('keydown', {
        code: 'Enter',
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.body.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('does not activate if not hovering', () => {
      // No mouseenter dispatched
      const event = new KeyboardEvent('keydown', {
        code: 'Space',
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.body.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('activates when hovering and Space is pressed', async () => {
      svg.dispatchEvent(new MouseEvent('mouseenter'));

      const event = new KeyboardEvent('keydown', {
        code: 'Space',
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

      document.body.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
      expect(interaction.executeExclusiveInteraction).toHaveBeenCalled();

      await Promise.resolve(); // wait for exclusive interaction

      expect(getViewBoxMock).toHaveBeenCalledWith(svg);
      expect(document.body.style.cursor).toBe('grab');
    });

    it('supports custom trigger', async () => {
      instance.trigger = ['KeyA'];
      svg.dispatchEvent(new MouseEvent('mouseenter'));

      const event = new KeyboardEvent('keydown', {
        code: 'KeyA',
        bubbles: true,
      });
      document.body.dispatchEvent(event);
      await Promise.resolve();

      expect(document.body.style.cursor).toBe('grab');
    });

    it('initializes with custom trigger from constructor', () => {
      const instance = new DragCanvas({ trigger: ['ShiftLeft'] });
      expect(instance.trigger).toEqual(['ShiftLeft']);
    });
  });

  describe('Drag Workflow (Behavior)', () => {
    beforeEach(async () => {
      await activateInteraction();
    });

    it('starts drag on left mouse down', () => {
      const event = new PointerEvent('pointerdown', {
        button: 0,
        clientX: 10,
        clientY: 10,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      svg.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(clientToViewportMock).toHaveBeenCalledWith(svg, 10, 10);
      expect(document.body.style.cursor).toBe('grabbing');
    });

    it('does not start drag on right mouse down', () => {
      const event = new PointerEvent('pointerdown', { button: 1 });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      svg.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(document.body.style.cursor).toBe('grab'); // remains grab, not grabbing
    });

    it('updates viewBox on move', () => {
      // Start drag at 10,10
      clientToViewportMock.mockReturnValue({ x: 10, y: 10 });
      svg.dispatchEvent(
        new PointerEvent('pointerdown', { button: 0, pointerId: 1 }),
      );

      // Move to 20,20
      clientToViewportMock.mockReturnValue({ x: 20, y: 20 });
      const moveEvent = new PointerEvent('pointermove', { pointerId: 1 });
      window.dispatchEvent(moveEvent);

      // dx=10, dy=10. initial (0,0). new (-10, -10)
      expect(viewBoxToStringMock).toHaveBeenCalledWith(
        expect.objectContaining({ x: -10, y: -10 }),
      );
      expect(state.updateOptions).toHaveBeenCalled();
    });

    it('ignores move from different pointer', () => {
      svg.dispatchEvent(
        new PointerEvent('pointerdown', { button: 0, pointerId: 1 }),
      );

      const moveEvent = new PointerEvent('pointermove', { pointerId: 2 });
      const preventDefaultSpy = vi.spyOn(moveEvent, 'preventDefault');
      window.dispatchEvent(moveEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('stops drag on pointer up', () => {
      svg.dispatchEvent(
        new PointerEvent('pointerdown', { button: 0, pointerId: 1 }),
      );

      window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

      expect(document.body.style.cursor).toBe('grab');
    });

    it('stops drag on keyup (Space)', () => {
      const event = new KeyboardEvent('keyup', { code: 'Space' });
      window.dispatchEvent(event);

      expect(document.body.style.cursor).toBe('default');
    });

    it('creates command if viewBox changed on stop', () => {
      // Mock viewBox changes
      // Initial state set in beforeEach is 0,0,100,100

      // Start Drag
      clientToViewportMock.mockReturnValue({ x: 10, y: 10 });
      svg.dispatchEvent(
        new PointerEvent('pointerdown', { button: 0, pointerId: 1 }),
      );

      // Move
      clientToViewportMock.mockReturnValue({ x: 20, y: 20 });
      window.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1 }));

      // Mock current viewBox as changed for the stop check
      getViewBoxMock.mockReturnValue({
        x: -10,
        y: -10,
        width: 100,
        height: 100,
      });
      viewBoxToStringMock.mockReturnValue('-10 -10 100 100');

      // Stop
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));

      expect(commander.execute).toHaveBeenCalled();
      expect(UpdateOptionsCommand).toHaveBeenCalledWith(
        { viewBox: '-10 -10 100 100' },
        { viewBox: '0 0 100 100' },
      );
    });

    it('does not create command if viewBox did not change', () => {
      // Start Drag and Stop without move
      svg.dispatchEvent(
        new PointerEvent('pointerdown', { button: 0, pointerId: 1 }),
      );
      window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));

      expect(commander.execute).not.toHaveBeenCalled();
    });

    it('handles blur event to stop drag', () => {
      window.dispatchEvent(new FocusEvent('blur'));
      expect(document.body.style.cursor).toBe('default');
    });
  });

  describe('Cleanup and Edge Cases', () => {
    it('removes dynamic listeners if destroyed while dragging', async () => {
      await activateInteraction();
      svg.dispatchEvent(
        new PointerEvent('pointerdown', { button: 0, pointerId: 1 }),
      );

      const removeSpy = vi.spyOn(window, 'removeEventListener');
      instance.destroy();

      // Verify cleanup of dynamic listeners added during drag start
      expect(removeSpy).toHaveBeenCalledWith(
        'pointermove',
        expect.any(Function),
      );
      expect(removeSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith(
        'pointercancel',
        expect.any(Function),
      );
    });

    it('retains interaction if space is held but mouse leaves', async () => {
      await activateInteraction();

      // Leave
      svg.dispatchEvent(new MouseEvent('mouseleave'));

      // Should still be active/grab because Space hasn't been released
      expect(document.body.style.cursor).toBe('grab');

      // Release Space
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));
      expect(document.body.style.cursor).toBe('default');
    });
  });
});
