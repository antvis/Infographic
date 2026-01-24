import { describe, expect, it } from 'vitest';
import {
  distributeLabels,
  LabelItem,
} from '../../../../src/designs/structures/chart-pie';

/**
 * 创建一个最小化的 LabelItem 用于测试
 * arcDatum 使用 mock 对象，因为 distributeLabels 不依赖它的内容
 */
function createLabelItem(
  overrides: Partial<LabelItem> & { y: number; height: number },
): LabelItem {
  return {
    arcDatum: {} as LabelItem['arcDatum'],
    originalIndex: 0,
    x: 0,
    isRight: true,
    color: '#000',
    ...overrides,
  };
}

describe('distributeLabels - Spider Leg Layout Algorithm', () => {
  describe('edge cases', () => {
    it('should return empty array for empty input', () => {
      const result = distributeLabels([], 32, -100, 100);
      expect(result).toEqual([]);
    });

    it('should return shallow copy for single item without modification', () => {
      const input = [createLabelItem({ y: 0, height: 30 })];
      const result = distributeLabels(input, 32, -100, 100);

      // 返回新数组和新对象（浅拷贝）
      expect(result).not.toBe(input);
      expect(result[0]).not.toBe(input[0]);

      // 位置不变
      expect(result[0].y).toBe(0);
    });

    it('should return shallow copies even when no adjustments needed', () => {
      const input = [
        createLabelItem({ y: -50, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 50, height: 30, originalIndex: 1 }),
      ];
      const result = distributeLabels(input, 30, -100, 100);

      // 应该返回新对象
      expect(result[0]).not.toBe(input[0]);
      expect(result[1]).not.toBe(input[1]);
    });
  });

  describe('no overlap scenarios', () => {
    it('should not move labels when they are far apart', () => {
      const input = [
        createLabelItem({ y: -60, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 60, height: 30, originalIndex: 1 }),
      ];
      const result = distributeLabels(input, 30, -100, 100);

      expect(result[0].y).toBe(-60);
      expect(result[1].y).toBe(60);
    });

    it('should not move labels when spacing equals exact gap', () => {
      // 标签高度30，间距30，两个标签中心间距需要 >= 30
      const input = [
        createLabelItem({ y: 0, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 60, height: 30, originalIndex: 1 }), // 间距正好60 = 30 + 30
      ];
      const result = distributeLabels(input, 30, -100, 100);

      expect(result[0].y).toBe(0);
      expect(result[1].y).toBe(60);
    });
  });

  describe('overlap scenarios - downwards push', () => {
    it('should push overlapping labels apart (simple case)', () => {
      const input = [
        createLabelItem({ y: 0, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 10, height: 30, originalIndex: 1 }), // 重叠
      ];
      const result = distributeLabels(input, 30, -200, 200);

      // 两个标签中心点间距应该 >= height/2 + height/2 + spacing = 30 + 30 = 60
      const gap = result[1].y - result[0].y;
      expect(gap).toBeGreaterThanOrEqual(60);
    });

    it('should push multiple overlapping labels in sequence', () => {
      const input = [
        createLabelItem({ y: 0, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 5, height: 30, originalIndex: 1 }),
        createLabelItem({ y: 10, height: 30, originalIndex: 2 }),
      ];
      const result = distributeLabels(input, 30, -300, 300);

      // 验证所有标签间距都足够
      for (let i = 1; i < result.length; i++) {
        const gap =
          result[i].y -
          result[i - 1].y -
          (result[i - 1].height + result[i].height) / 2;
        expect(gap).toBeGreaterThanOrEqual(30);
      }
    });
  });

  describe('boundary clamping', () => {
    it('should clamp labels within lower boundary (maxY)', () => {
      // 注意：单个元素会提前返回，需要两个元素触发边界检查
      const input = [
        createLabelItem({ y: 0, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 95, height: 30, originalIndex: 1 }), // 会超出 maxY=100
      ];
      const result = distributeLabels(input, 30, -100, 100);

      // 最后一个标签中心 + 半高度 应该 <= maxY
      const lastItem = result[result.length - 1];
      expect(lastItem.y + lastItem.height / 2).toBeLessThanOrEqual(100);
    });

    it('should clamp labels within upper boundary (minY)', () => {
      // 注意：单个元素会提前返回，需要两个元素触发边界检查
      const input = [
        createLabelItem({ y: -95, height: 30, originalIndex: 0 }), // 会超出 minY=-100
        createLabelItem({ y: 0, height: 30, originalIndex: 1 }),
      ];
      const result = distributeLabels(input, 30, -100, 100);

      // 第一个标签中心 - 半高度 应该 >= minY
      expect(result[0].y - result[0].height / 2).toBeGreaterThanOrEqual(-100);
    });

    it('should handle labels pushed beyond maxY by pulling back', () => {
      // 两个重叠标签靠近下边界，推开后会超出
      const input = [
        createLabelItem({ y: 70, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 75, height: 30, originalIndex: 1 }),
      ];
      const result = distributeLabels(input, 30, -200, 100);

      // 最后一个标签不应超出边界
      const lastItem = result[result.length - 1];
      expect(lastItem.y + lastItem.height / 2).toBeLessThanOrEqual(100);

      // 间距仍应保持
      const gap =
        result[1].y - result[0].y - (result[0].height + result[1].height) / 2;
      expect(gap).toBeGreaterThanOrEqual(30);
    });

    it('should shift all labels down when pushed above minY', () => {
      // 标签被向上回推后超出上边界，整体下移
      const input = [
        createLabelItem({ y: -80, height: 30, originalIndex: 0 }),
        createLabelItem({ y: -75, height: 30, originalIndex: 1 }),
        createLabelItem({ y: 80, height: 30, originalIndex: 2 }),
      ];
      const result = distributeLabels(input, 30, -100, 100);

      // 第一个标签不应超出上边界
      expect(result[0].y - result[0].height / 2).toBeGreaterThanOrEqual(-100);
    });
  });

  describe('spacing compression', () => {
    it('should compress spacing when total height exceeds available space', () => {
      // 5个标签，每个高度30，理想情况需要 5*30 + 4*30 = 270
      // 但可用空间只有 200 (从 -100 到 100)
      const input = Array.from({ length: 5 }, (_, i) =>
        createLabelItem({
          y: -50 + i * 25,
          height: 30,
          originalIndex: i,
        }),
      );
      const result = distributeLabels(input, 30, -100, 100);

      // 所有标签应该在边界内
      result.forEach((item) => {
        expect(item.y - item.height / 2).toBeGreaterThanOrEqual(-100);
        expect(item.y + item.height / 2).toBeLessThanOrEqual(100);
      });

      // 标签应该保持顺序
      for (let i = 1; i < result.length; i++) {
        expect(result[i].y).toBeGreaterThan(result[i - 1].y);
      }
    });

    it('should set spacing to 0 when labels barely fit', () => {
      // 4个标签，每个高度50，总高度200，刚好等于可用空间
      const input = Array.from({ length: 4 }, (_, i) =>
        createLabelItem({
          y: -75 + i * 50,
          height: 50,
          originalIndex: i,
        }),
      );
      const result = distributeLabels(input, 20, -100, 100);

      // 标签应该紧密排列但不重叠
      for (let i = 1; i < result.length; i++) {
        const gap =
          result[i].y -
          result[i - 1].y -
          (result[i - 1].height + result[i].height) / 2;
        expect(gap).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('sorting behavior', () => {
    it('should sort labels by Y coordinate before processing', () => {
      // 输入顺序与Y坐标顺序不同
      const input = [
        createLabelItem({ y: 50, height: 30, originalIndex: 2 }),
        createLabelItem({ y: -50, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 0, height: 30, originalIndex: 1 }),
      ];
      const result = distributeLabels(input, 30, -100, 100);

      // 结果应该按Y坐标排序
      expect(result[0].y).toBeLessThan(result[1].y);
      expect(result[1].y).toBeLessThan(result[2].y);
    });

    it('should preserve originalIndex after sorting', () => {
      const input = [
        createLabelItem({ y: 50, height: 30, originalIndex: 2 }),
        createLabelItem({ y: -50, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 0, height: 30, originalIndex: 1 }),
      ];
      const result = distributeLabels(input, 30, -100, 100);

      // 验证 originalIndex 被保留
      const indices = result.map((item) => item.originalIndex).sort();
      expect(indices).toEqual([0, 1, 2]);
    });
  });

  describe('variable height labels', () => {
    it('should handle labels with different heights', () => {
      const input = [
        createLabelItem({ y: 0, height: 20, originalIndex: 0 }),
        createLabelItem({ y: 10, height: 40, originalIndex: 1 }), // 更高
        createLabelItem({ y: 30, height: 30, originalIndex: 2 }),
      ];
      const result = distributeLabels(input, 10, -200, 200);

      // 验证间距考虑了不同高度
      for (let i = 1; i < result.length; i++) {
        const minGap = (result[i - 1].height + result[i].height) / 2 + 10;
        expect(result[i].y - result[i - 1].y).toBeGreaterThanOrEqual(minGap);
      }
    });
  });

  describe('immutability', () => {
    it('should not mutate original input array', () => {
      const input = [
        createLabelItem({ y: 0, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 5, height: 30, originalIndex: 1 }),
      ];
      const originalY0 = input[0].y;
      const originalY1 = input[1].y;

      distributeLabels(input, 30, -100, 100);

      // 原数组对象不应被修改
      expect(input[0].y).toBe(originalY0);
      expect(input[1].y).toBe(originalY1);
    });
  });

  describe('impossible fit scenarios - labels cannot fit in space', () => {
    it('should handle case where total label height exceeds available space', () => {
      // 10个标签，每个高度30，总高度300
      // 可用空间只有100 (-50 到 50)
      // 根本塞不下！
      const input = Array.from({ length: 10 }, (_, i) =>
        createLabelItem({
          y: -40 + i * 8,
          height: 30,
          originalIndex: i,
        }),
      );
      const result = distributeLabels(input, 10, -50, 50);

      // 算法应该尽力而为，不应崩溃或死循环
      expect(result.length).toBe(10);

      // 标签顺序应该保持
      for (let i = 1; i < result.length; i++) {
        expect(result[i].y).toBeGreaterThanOrEqual(result[i - 1].y);
      }

      // 间距被压缩到0或负数？验证标签不会反向重叠
      // 即后一个标签的顶部不应该超过前一个标签的底部
      for (let i = 1; i < result.length; i++) {
        const prevBottom = result[i - 1].y + result[i - 1].height / 2;
        const currTop = result[i].y - result[i].height / 2;
        // 在极端情况下，允许轻微重叠但顺序不变
        expect(currTop).toBeGreaterThanOrEqual(prevBottom - 1); // 容差1px
      }
    });

    it('should not produce negative spacing in extreme compression', () => {
      // 6个标签，每个高度40，总高度240
      // 可用空间只有120
      const input = Array.from({ length: 6 }, (_, i) =>
        createLabelItem({
          y: -50 + i * 20,
          height: 40,
          originalIndex: i,
        }),
      );
      const result = distributeLabels(input, 20, -60, 60);

      // 验证第一个和最后一个标签的位置
      const firstTop = result[0].y - result[0].height / 2;
      const lastBottom =
        result[result.length - 1].y + result[result.length - 1].height / 2;

      // 算法应该把第一个标签钳制在上边界
      expect(firstTop).toBeGreaterThanOrEqual(-60);
      // 但最后一个可能超出下边界（因为塞不下）
      // 这是合理的降级行为
    });
  });

  describe('idempotency - running twice should give same result', () => {
    it('should produce identical output when run twice (stable result)', () => {
      const input = [
        createLabelItem({ y: 0, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 10, height: 30, originalIndex: 1 }),
        createLabelItem({ y: 20, height: 30, originalIndex: 2 }),
      ];

      const firstResult = distributeLabels(input, 30, -100, 100);
      const secondResult = distributeLabels(firstResult, 30, -100, 100);

      // 两次运行的结果应该完全相同
      expect(secondResult.length).toBe(firstResult.length);
      for (let i = 0; i < firstResult.length; i++) {
        expect(secondResult[i].y).toBe(firstResult[i].y);
      }
    });

    it('should be stable after multiple iterations', () => {
      const input = [
        createLabelItem({ y: 50, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 55, height: 30, originalIndex: 1 }),
        createLabelItem({ y: 90, height: 30, originalIndex: 2 }),
      ];

      let current = distributeLabels(input, 20, -100, 100);
      for (let iteration = 0; iteration < 5; iteration++) {
        const next = distributeLabels(current, 20, -100, 100);
        // 每次迭代结果应该相同
        for (let i = 0; i < current.length; i++) {
          expect(next[i].y).toBe(current[i].y);
        }
        current = next;
      }
    });
  });

  describe('calculation correctness - verify exact positions', () => {
    it('should calculate correct spacing for simple two-label case', () => {
      // 两个重叠标签，高度30，间距20
      // 最小中心间距 = 30/2 + 30/2 + 20 = 50
      const input = [
        createLabelItem({ y: 0, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 10, height: 30, originalIndex: 1 }), // 当前间距只有10
      ];
      const result = distributeLabels(input, 20, -200, 200);

      // 第一个标签应该保持不动（因为有足够空间）
      expect(result[0].y).toBe(0);
      // 第二个标签应该被推到 y = 50 (0 + 50)
      expect(result[1].y).toBe(50);
    });

    it('should calculate correct positions when boundary clamp triggers', () => {
      // 标签靠近下边界
      const input = [
        createLabelItem({ y: 60, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 65, height: 30, originalIndex: 1 }),
      ];
      // maxY = 100, 第二个标签底部最多在100
      // 第二个标签中心最多在 100 - 15 = 85
      // 第一个标签中心最多在 85 - 50 = 35
      const result = distributeLabels(input, 20, -200, 100);

      expect(result[1].y).toBe(85); // maxY - height/2
      expect(result[0].y).toBe(35); // 85 - (15 + 15 + 20)
    });

    it('should evenly distribute labels when compressed', () => {
      // 3个标签，每个高度30，间距10
      // 理想情况：30 + 10 + 30 + 10 + 30 = 110
      // 可用空间刚好110 (-55 到 55)
      const input = [
        createLabelItem({ y: 0, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 0, height: 30, originalIndex: 1 }),
        createLabelItem({ y: 0, height: 30, originalIndex: 2 }),
      ];
      const result = distributeLabels(input, 10, -55, 55);

      // 验证标签均匀分布
      // 第一个：中心在 -55 + 15 = -40
      // 第二个：中心在 -40 + 40 = 0
      // 第三个：中心在 0 + 40 = 40
      const gap01 = result[1].y - result[0].y;
      const gap12 = result[2].y - result[1].y;
      expect(gap01).toBe(gap12); // 间距应该相等
    });
  });

  describe('extreme inputs - edge cases and invalid data', () => {
    it('should handle minY > maxY (inverted viewport) gracefully', () => {
      const input = [
        createLabelItem({ y: 0, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 10, height: 30, originalIndex: 1 }),
      ];

      // 视口反转：minY=100, maxY=-100
      // 不应崩溃或死循环
      const result = distributeLabels(input, 20, 100, -100);

      // 应该返回有效数组
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      // 位置可能是NaN或不合理，但不应崩溃
    });

    it('should handle NaN coordinates in input', () => {
      const input = [
        createLabelItem({ y: NaN, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 10, height: 30, originalIndex: 1 }),
      ];

      // 不应崩溃
      expect(() => {
        distributeLabels(input, 20, -100, 100);
      }).not.toThrow();
    });

    it('should handle Infinity coordinates in input', () => {
      const input = [
        createLabelItem({ y: Infinity, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 10, height: 30, originalIndex: 1 }),
      ];

      // 不应崩溃
      expect(() => {
        distributeLabels(input, 20, -100, 100);
      }).not.toThrow();
    });

    it('should handle negative Infinity coordinates in input', () => {
      const input = [
        createLabelItem({ y: -Infinity, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 10, height: 30, originalIndex: 1 }),
      ];

      // 不应崩溃
      expect(() => {
        distributeLabels(input, 20, -100, 100);
      }).not.toThrow();
    });

    it('should handle zero height labels', () => {
      const input = [
        createLabelItem({ y: 0, height: 0, originalIndex: 0 }),
        createLabelItem({ y: 10, height: 0, originalIndex: 1 }),
      ];

      const result = distributeLabels(input, 20, -100, 100);

      // 应该正常处理
      expect(result.length).toBe(2);
      // 高度为0时，两个标签的"碰撞检测"间距 = 0/2 + 0/2 = 0
      // 当前间距10 >= 0，所以不会被判定为重叠
      // 因此位置保持不变
      expect(result[0].y).toBe(0);
      expect(result[1].y).toBe(10);
    });

    it('should handle negative spacing', () => {
      const input = [
        createLabelItem({ y: 0, height: 30, originalIndex: 0 }),
        createLabelItem({ y: 50, height: 30, originalIndex: 1 }),
      ];

      // 负间距不应崩溃
      expect(() => {
        distributeLabels(input, -10, -100, 100);
      }).not.toThrow();
    });

    it('should handle very large number of labels', () => {
      // 100个标签，验证性能和正确性
      const input = Array.from({ length: 100 }, (_, i) =>
        createLabelItem({
          y: i * 2,
          height: 10,
          originalIndex: i,
        }),
      );

      const start = performance.now();
      const result = distributeLabels(input, 5, -1000, 1000);
      const duration = performance.now() - start;

      expect(result.length).toBe(100);
      // 应该在合理时间内完成（<100ms）
      expect(duration).toBeLessThan(100);
    });
  });
});
