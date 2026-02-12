import { describe, expect, it } from 'vitest';
import {
  createArrowElements,
  createRoundedPath,
  createStraightPath,
  getEdgePathD,
  getLabelPosition,
  getMidPoint,
  getNodesAnchors,
  getPointAtT,
  getTangentAngle,
} from '../geometry';

describe('geometry utils', () => {
  describe('getMidPoint', () => {
    it('should return null for empty points', () => {
      expect(getMidPoint([])).toBeNull();
    });

    it('should return the midpoint of a line segment', () => {
      const result = getMidPoint([
        [0, 0],
        [10, 0],
      ]);
      expect(result).toEqual([5, 0]);
    });

    it('should return the midpoint of a multi-segment line', () => {
      // Total length = 10 + 10 = 20. Midpoint at distance 10.
      // Segment 1: (0,0)->(10,0) (len 10)
      // Segment 2: (10,0)->(10,10) (len 10)
      // Target is at end of segment 1 / start of segment 2
      const result = getMidPoint([
        [0, 0],
        [10, 0],
        [10, 10],
      ]);
      expect(result).toEqual([10, 0]);
    });
  });

  describe('createStraightPath', () => {
    it('should create a straight path string for 2 points', () => {
      const result = createStraightPath(
        [
          [0, 0],
          [10, 10],
        ],
        0,
        0,
      );
      expect(result).toBe('M 0 0 L 10 10');
    });

    it('should apply offset correctly', () => {
      const result = createStraightPath(
        [
          [0, 0],
          [10, 10],
        ],
        5,
        5,
      );
      expect(result).toBe('M 5 5 L 15 15');
    });
  });

  describe('createRoundedPath', () => {
    it('should act as straight line for 2 points ignoring radius', () => {
      const result = createRoundedPath(
        [
          [0, 0],
          [10, 0],
        ],
        5,
        0,
        0,
      );
      expect(result).toBe('M 0 0 L 10 0');
    });

    it('should create rounded corner for 3 points', () => {
      // (0,0) -> (10,0) -> (10,10)
      // Corner at (10,0). Radius 5.
      // Expected: Line to (5,0), Quad to (10,5), Line to (10,10)
      // result string should contain Q command
      const result = createRoundedPath(
        [
          [0, 0],
          [10, 0],
          [10, 10],
        ],
        5,
        0,
        0,
      );
      expect(result).toContain('Q');
      expect(result).toContain('M 0 0');
    });
  });

  describe('createArrowElements', () => {
    it('should create arrow type element', () => {
      const result = createArrowElements(0, 0, 0, 'arrow', 'black', 1, 10);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeTruthy();
    });

    it('should create triangle type element', () => {
      const result = createArrowElements(0, 0, 0, 'triangle', 'black', 1, 10);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeTruthy();
    });
  });

  describe('getNodesAnchors', () => {
    const node = { x: 0, y: 0, width: 100, height: 100 };

    it('should return correct anchor points with default radio (0.25)', () => {
      const anchors = getNodesAnchors(node);
      expect(anchors.LC).toEqual({ x: 0, y: 50 });
      expect(anchors.RC).toEqual({ x: 100, y: 50 });
      expect(anchors.LT).toEqual({ x: 0, y: 25 });
    });

    it('should return correct anchor points with custom radio', () => {
      const anchors = getNodesAnchors({ ...node, radio: 0.1 });
      expect(anchors.LT).toEqual({ x: 0, y: 10 });
      expect(anchors.LB).toEqual({ x: 0, y: 90 });
    });
  });

  describe('getTangentAngle', () => {
    it('should return angle for straight line (2 points)', () => {
      const points: [number, number][] = [
        [0, 0],
        [10, 0],
      ];
      expect(getTangentAngle(points, 1)).toBe(0);
      expect(getTangentAngle(points, 0)).toBe(Math.PI);
    });

    it('should return angle for quadratic curve (3 points)', () => {
      const points: [number, number][] = [
        [0, 0],
        [5, 5],
        [10, 0],
      ];
      expect(getTangentAngle(points, 0)).toBeCloseTo(
        Math.atan2(5, 5) + Math.PI,
      );
      expect(getTangentAngle(points, 1)).toBeCloseTo(Math.atan2(-5, 5));
    });
  });

  describe('getPointAtT', () => {
    it('should return midpoint for straight line at t=0.5', () => {
      const points: [number, number][] = [
        [0, 0],
        [10, 10],
      ];
      expect(getPointAtT(points, 0.5)).toEqual([5, 5]);
    });

    it('should return correct point for quadratic curve at t=0.5', () => {
      const points: [number, number][] = [
        [0, 0],
        [10, 0],
        [20, 0],
      ];
      expect(getPointAtT(points, 0.5)).toEqual([10, 0]);
    });
  });

  describe('getLabelPosition', () => {
    it('should return midpoint for straight line (len=2)', () => {
      const points: [number, number][] = [
        [0, 0],
        [10, 0],
      ];
      expect(getLabelPosition(points)).toEqual([5, 0]);
    });

    it('should apply offset for self loop (len=4)', () => {
      const points: [number, number][] = [
        [0, 0],
        [0, 10],
        [10, 10],
        [10, 0],
      ];
      const center = getPointAtT(points, 0.5);
      const result = getLabelPosition(points, 10);
      expect(result[0]).toBe(center[0] + 10);
      expect(result[1]).toBe(center[1]);
    });
  });

  describe('getEdgePathD', () => {
    it('should return M L path for 2 points', () => {
      const points: [number, number][] = [
        [0, 0],
        [10, 10],
      ];
      expect(getEdgePathD(points)).toBe('M 0 0 L 10 10');
    });

    it('should return M Q path for 3 points', () => {
      const points: [number, number][] = [
        [0, 0],
        [5, 5],
        [10, 0],
      ];
      expect(getEdgePathD(points)).toBe('M 0 0 Q 5 5 10 0');
    });
  });
});
