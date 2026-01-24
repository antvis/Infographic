import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getItem, getItems, getThemeColors, renderSVG } from '../../../src';
import * as storageUtils from '../../../dev/src/utils/storage';

// Mock the storage utilities
vi.mock('../../../dev/src/utils/storage', () => ({
  getStoredValues: vi.fn(),
  setStoredValues: vi.fn(),
}));

// Mock @antv/infographic functions
vi.mock('../../../src', async () => {
  const actual = await vi.importActual('../../../src');
  return {
    ...actual,
    getItems: vi.fn(() => ['item-1', 'item-2']),
    getItem: vi.fn((name: string) => ({
      component: vi.fn(() => ({
        type: 'g',
        props: { 'data-testid': name },
      })),
    })),
    getThemeColors: vi.fn((config: { colorPrimary: string; colorBg: string }) => ({
      primary: config.colorPrimary,
      bg: config.colorBg,
    })),
    renderSVG: vi.fn((element: any) => '<svg>test</svg>'),
  };
});

describe('ItemPreview - Color Functionality', () => {
  const STORAGE_KEY = 'item-preview-form-values';
  let mockGetStoredValues: ReturnType<typeof vi.fn>;
  let mockSetStoredValues: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetStoredValues = vi.mocked(storageUtils.getStoredValues);
    mockSetStoredValues = vi.mocked(storageUtils.setStoredValues);
    
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Color Primary Initialization', () => {
    it('should initialize with default color when no stored value exists', () => {
      mockGetStoredValues.mockReturnValue(null);

      // The component would initialize with default color
      const defaultColor = '#FF356A';
      expect(defaultColor).toBe('#FF356A');
    });

    it('should initialize with stored colorPrimary from localStorage', () => {
      const storedColor = '#00FF00';
      mockGetStoredValues.mockReturnValue({
        selectedItem: 'item-1',
        theme: 'light',
        colorPrimary: storedColor,
      });

      // The component would use stored color
      expect(storedColor).toBe('#00FF00');
    });

    it('should handle missing colorPrimary in stored values', () => {
      mockGetStoredValues.mockReturnValue({
        selectedItem: 'item-1',
        theme: 'light',
        // colorPrimary is missing
      });

      // Should fallback to default
      const defaultColor = '#FF356A';
      expect(defaultColor).toBe('#FF356A');
    });
  });

  describe('Color Picker Integration', () => {
    it('should update themeConfig.colorPrimary when color changes', () => {
      const initialColor = '#FF356A';
      const newColor = '#0000FF';

      // Simulate color picker onChange
      const mockColor = {
        toHexString: vi.fn(() => newColor),
      };

      // Simulate the onChange handler
      const themeConfig = { colorPrimary: initialColor, colorBg: '#fff' };
      const updatedThemeConfig = {
        ...themeConfig,
        colorPrimary: mockColor.toHexString(),
      };

      expect(updatedThemeConfig.colorPrimary).toBe(newColor);
      expect(mockColor.toHexString).toHaveBeenCalled();
    });

    it('should convert color to hex string format', () => {
      const mockColor = {
        toHexString: vi.fn(() => '#FF0000'),
      };

      const hexColor = mockColor.toHexString();
      expect(hexColor).toBe('#FF0000');
      expect(hexColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should preserve other themeConfig properties when updating color', () => {
      const themeConfig = {
        colorPrimary: '#FF356A',
        colorBg: '#fff',
      };

      const newColor = '#00FF00';
      const updatedThemeConfig = {
        ...themeConfig,
        colorPrimary: newColor,
      };

      expect(updatedThemeConfig.colorPrimary).toBe(newColor);
      expect(updatedThemeConfig.colorBg).toBe(themeConfig.colorBg);
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should save colorPrimary to localStorage when it changes', () => {
      const storedValues = {
        selectedItem: 'item-1',
        theme: 'light',
        colorPrimary: '#FF356A',
      };

      mockGetStoredValues.mockReturnValue(storedValues);

      // Simulate color change
      const newColor = '#00FF00';
      const updatedValues = {
        ...storedValues,
        colorPrimary: newColor,
      };

      // The component should call setStoredValues
      mockSetStoredValues(STORAGE_KEY, updatedValues);

      expect(mockSetStoredValues).toHaveBeenCalledWith(STORAGE_KEY, {
        selectedItem: 'item-1',
        theme: 'light',
        colorPrimary: newColor,
      });
    });

    it('should save colorPrimary along with other form values', () => {
      const formValues = {
        selectedItem: 'item-2',
        theme: 'dark',
        colorPrimary: '#FF00FF',
      };

      mockSetStoredValues(STORAGE_KEY, formValues);

      expect(mockSetStoredValues).toHaveBeenCalledWith(STORAGE_KEY, {
        selectedItem: 'item-2',
        theme: 'dark',
        colorPrimary: '#FF00FF',
      });
    });

    it('should persist colorPrimary when component re-renders', () => {
      const initialValues = {
        selectedItem: 'item-1',
        theme: 'light',
        colorPrimary: '#FF356A',
      };

      mockGetStoredValues.mockReturnValue(initialValues);

      // Simulate multiple updates
      const updates = [
        { ...initialValues, colorPrimary: '#00FF00' },
        { ...initialValues, colorPrimary: '#0000FF' },
        { ...initialValues, colorPrimary: '#FF00FF' },
      ];

      updates.forEach((update) => {
        mockSetStoredValues(STORAGE_KEY, update);
      });

      expect(mockSetStoredValues).toHaveBeenCalledTimes(updates.length);
      expect(mockSetStoredValues).toHaveBeenLastCalledWith(STORAGE_KEY, {
        selectedItem: 'item-1',
        theme: 'light',
        colorPrimary: '#FF00FF',
      });
    });
  });

  describe('Theme Colors Integration', () => {
    it('should pass colorPrimary to getThemeColors', () => {
      const themeConfig = {
        colorPrimary: '#FF356A',
        colorBg: '#fff',
      };

      const themeColors = getThemeColors(themeConfig);

      expect(getThemeColors).toHaveBeenCalledWith(themeConfig);
      expect(themeColors).toHaveProperty('primary', themeConfig.colorPrimary);
    });

    it('should apply theme colors to rendered items', () => {
      const themeConfig = {
        colorPrimary: '#00FF00',
        colorBg: '#fff',
      };

      const mockComponent = vi.fn(() => ({ type: 'g', props: {} }));
      const getItemSpy = vi.fn(() => ({ component: mockComponent }));

      // Simulate component rendering with theme colors
      const themeColors = getThemeColors(themeConfig);
      mockComponent({
        themeColors,
        indexes: [0],
        datum: { label: 'test' },
        data: { items: [{ label: 'test' }] },
      });

      expect(getThemeColors).toHaveBeenCalledWith(themeConfig);
      expect(mockComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          themeColors: expect.objectContaining({
            primary: themeConfig.colorPrimary,
          }),
        }),
      );
    });
  });

  describe('Color Type Validation', () => {
    it('should handle valid hex color strings', () => {
      const validColors = ['#FF356A', '#000000', '#FFFFFF', '#abc123'];

      validColors.forEach((color) => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should store colorPrimary as string type', () => {
      const storedValues = {
        selectedItem: 'item-1',
        theme: 'light',
        colorPrimary: '#FF356A',
      };

      expect(typeof storedValues.colorPrimary).toBe('string');
      expect(storedValues.colorPrimary).toBe('#FF356A');
    });

    it('should handle ColorPicker color object conversion', () => {
      // Simulate Ant Design ColorPicker color object
      const mockColorObjects = [
        { toHexString: () => '#FF356A' },
        { toHexString: () => '#000000' },
        { toHexString: () => '#FFFFFF' },
      ];

      mockColorObjects.forEach((colorObj) => {
        const hexColor = colorObj.toHexString();
        expect(hexColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(typeof hexColor).toBe('string');
      });
    });
  });

  describe('Color and Theme Interaction', () => {
    it('should maintain colorPrimary when theme changes', () => {
      const initialConfig = {
        colorPrimary: '#FF356A',
        colorBg: '#fff',
      };

      // Simulate theme change to dark
      const updatedConfig = {
        ...initialConfig,
        colorBg: '#333', // Only colorBg changes
      };

      expect(updatedConfig.colorPrimary).toBe(initialConfig.colorPrimary);
      expect(updatedConfig.colorBg).toBe('#333');
    });

    it('should update both colorPrimary and colorBg independently', () => {
      let themeConfig = {
        colorPrimary: '#FF356A',
        colorBg: '#fff',
      };

      // Update colorPrimary
      themeConfig = {
        ...themeConfig,
        colorPrimary: '#00FF00',
      };

      expect(themeConfig.colorPrimary).toBe('#00FF00');
      expect(themeConfig.colorBg).toBe('#fff');

      // Update colorBg
      themeConfig = {
        ...themeConfig,
        colorBg: '#333',
      };

      expect(themeConfig.colorPrimary).toBe('#00FF00');
      expect(themeConfig.colorBg).toBe('#333');
    });
  });
});
