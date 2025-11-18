import { describe, expect, it } from 'vitest';
import type { Bounds, JSXElement } from '../../../../src';
import {
  getCombinedBounds,
  getElementBounds,
  getElementsBounds,
} from '../../../../src/jsx/utils';

describe('bounds utils', () => {
  describe('getCombinedBounds', () => {
    it('should return zero bounds for empty array', () => {
      const result = getCombinedBounds([]);
      expect(result).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    });

    it('should return zero bounds for null/undefined input', () => {
      expect(getCombinedBounds(null)).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
      expect(getCombinedBounds(undefined)).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should calculate combined bounds for single bound', () => {
      const bounds: Bounds[] = [{ x: 10, y: 20, width: 100, height: 50 }];
      const result = getCombinedBounds(bounds);
      expect(result).toEqual({ x: 10, y: 20, width: 100, height: 50 });
    });

    it('should calculate combined bounds for multiple bounds', () => {
      const bounds: Bounds[] = [
        { x: 10, y: 20, width: 50, height: 30 },
        { x: 100, y: 50, width: 40, height: 60 },
        { x: 5, y: 10, width: 20, height: 25 },
      ];

      const result = getCombinedBounds(bounds);
      expect(result).toEqual({
        x: 5,
        y: 10,
        width: 135, // from x:5 to x:140 (100+40)
        height: 100, // from y:10 to y:110 (50+60)
      });
    });

    it('should handle bounds with negative coordinates', () => {
      const bounds: Bounds[] = [
        { x: -20, y: -10, width: 50, height: 30 },
        { x: 10, y: 20, width: 40, height: 60 },
      ];

      const result = getCombinedBounds(bounds);
      expect(result).toEqual({
        x: -20,
        y: -10,
        width: 70, // from x:-20 to x:50 (10+40)
        height: 90, // from y:-10 to y:80 (20+60)
      });
    });

    it('should handle bounds with zero dimensions', () => {
      const bounds: Bounds[] = [
        { x: 10, y: 20, width: 0, height: 0 },
        { x: 30, y: 40, width: 0, height: 0 },
      ];

      const result = getCombinedBounds(bounds);
      expect(result).toEqual({
        x: 10,
        y: 20,
        width: 20,
        height: 20,
      });
    });
  });

  describe('getElementBounds', () => {
    it('should return zero bounds for falsy values', () => {
      expect(getElementBounds()).toEqual({ x: 0, y: 0, width: 0, height: 0 });
      expect(getElementBounds(null)).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
      expect(getElementBounds(undefined)).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should return zero bounds for primitive values', () => {
      expect(getElementBounds('text')).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
      expect(getElementBounds(42)).toEqual({ x: 0, y: 0, width: 0, height: 0 });
      expect(getElementBounds(true)).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should handle arrays by delegating to getElementsBounds', () => {
      const elements: JSXElement[] = [
        { type: 'rect', props: { x: 10, y: 20, width: 100, height: 50 } },
        { type: 'rect', props: { x: 200, y: 100, width: 50, height: 75 } },
      ];

      const result = getElementBounds(elements);
      expect(result).toEqual({
        x: 10,
        y: 20,
        width: 240, // from x:10 to x:250 (200+50)
        height: 155, // from y:20 to y:175 (100+75)
      });
    });

    it('should return bounds from element props when width and height are defined', () => {
      const element: JSXElement = {
        type: 'rect',
        props: {
          x: 10,
          y: 20,
          width: 100,
          height: 50,
        },
      };

      const bounds = getElementBounds(element);
      expect(bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
      });
    });

    it('should use default coordinates when not provided', () => {
      const element: JSXElement = {
        type: 'rect',
        props: {
          width: 100,
          height: 50,
        },
      };

      const bounds = getElementBounds(element);
      expect(bounds).toEqual({
        x: 0,
        y: 0,
        width: 100,
        height: 50,
      });
    });

    it('should handle function components with explicit dimensions', () => {
      const MockComponent = () => ({
        type: 'rect',
        props: { x: 5, y: 10, width: 200, height: 100 },
      });

      const element: JSXElement = {
        type: MockComponent,
        props: { x: 10, y: 20, width: 150, height: 75 },
      };

      const bounds = getElementBounds(element);
      expect(bounds).toEqual({
        x: 10,
        y: 20,
        width: 150,
        height: 75,
      });
    });

    it('should handle function components without explicit dimensions', () => {
      const MockComponent = () => ({
        type: 'rect',
        props: { x: 5, y: 10, width: 200, height: 100 },
      });

      const element: JSXElement = {
        type: MockComponent,
        props: { x: 10, y: 20 },
      };

      const bounds = getElementBounds(element);
      expect(bounds).toEqual({
        x: 15, // external x + inner x
        y: 30, // external y + inner y
        width: 200,
        height: 100,
      });
    });

    it('should handle function components that return arrays', () => {
      const MockComponent = () => [
        { type: 'rect', props: { x: 0, y: 0, width: 50, height: 50 } },
        { type: 'rect', props: { x: 100, y: 100, width: 50, height: 50 } },
      ];

      const element: JSXElement = {
        type: MockComponent,
        props: { x: 10, y: 20 },
      };

      const bounds = getElementBounds(element);
      expect(bounds).toEqual({
        x: 10, // external x + inner bounds x
        y: 20, // external y + inner bounds y
        width: 150,
        height: 150,
      });
    });

    it('should handle elements with children', () => {
      const element: JSXElement = {
        type: 'g',
        props: {
          children: [
            { type: 'rect', props: { x: 10, y: 10, width: 50, height: 50 } },
            { type: 'rect', props: { x: 100, y: 100, width: 50, height: 50 } },
          ],
        },
      };

      const bounds = getElementBounds(element);
      expect(bounds).toEqual({
        x: 10,
        y: 10,
        width: 140,
        height: 140,
      });
    });

    it('should return zero bounds when no size information is available', () => {
      const element: JSXElement = {
        type: 'rect',
        props: {},
      };

      const bounds = getElementBounds(element);
      expect(bounds).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should handle function components returning null', () => {
      const MockComponent = () => null;

      const element: JSXElement = {
        type: MockComponent,
        props: { x: 10, y: 20, width: 100, height: 50 },
      };

      const bounds = getElementBounds(element);
      expect(bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
      });
    });

    it('should handle function components with partial external dimensions', () => {
      const MockComponent = () => ({
        type: 'rect',
        props: { width: 200, height: 100 },
      });

      const element: JSXElement = {
        type: MockComponent,
        props: { x: 10, y: 20 },
      };

      const bounds = getElementBounds(element);
      expect(bounds).toEqual({
        x: 10,
        y: 20,
        width: 200,
        height: 100,
      });
    });
  });

  describe('getElementsBounds', () => {
    it('should return zero bounds for empty array', () => {
      const bounds = getElementsBounds([]);
      expect(bounds).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    });

    it('should return zero bounds for null/undefined input', () => {
      expect(getElementsBounds(null as any)).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
      expect(getElementsBounds(undefined as any)).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should calculate bounding box for single element', () => {
      const elements: JSXElement[] = [
        { type: 'rect', props: { x: 10, y: 20, width: 100, height: 50 } },
      ];

      const bounds = getElementsBounds(elements);
      expect(bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
      });
    });

    it('should calculate bounding box for multiple elements', () => {
      const elements: JSXElement[] = [
        { type: 'rect', props: { x: 10, y: 20, width: 50, height: 30 } },
        { type: 'rect', props: { x: 100, y: 50, width: 40, height: 60 } },
        { type: 'rect', props: { x: 5, y: 10, width: 20, height: 25 } },
      ];

      const bounds = getElementsBounds(elements);
      expect(bounds).toEqual({
        x: 5,
        y: 10,
        width: 135, // from x:5 to x:140 (100+40)
        height: 100, // from y:10 to y:110 (50+60)
      });
    });

    it('should handle elements with negative coordinates', () => {
      const elements: JSXElement[] = [
        { type: 'rect', props: { x: -20, y: -10, width: 50, height: 30 } },
        { type: 'rect', props: { x: 10, y: 20, width: 40, height: 60 } },
      ];

      const bounds = getElementsBounds(elements);
      expect(bounds).toEqual({
        x: -20,
        y: -10,
        width: 70, // from x:-20 to x:50 (10+40)
        height: 90, // from y:-10 to y:80 (20+60)
      });
    });

    it('should handle mixed JSXNode types in elements', () => {
      const elements: JSXElement[] = [
        { type: 'rect', props: { x: 10, y: 20, width: 50, height: 30 } },
        'text content' as any, // This should be filtered out by nodeToElements
        42 as any, // This should be filtered out by nodeToElements
      ];

      const bounds = getElementsBounds(elements);
      expect(bounds).toEqual({
        x: 10,
        y: 20,
        width: 50,
        height: 30,
      });
    });
  });
});
