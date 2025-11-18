/** @jsxImportSource ../../../../src */
import { describe, expect, it } from 'vitest';
import type { Bounds } from '../../../../src';
import {
  cloneElement,
  Ellipse,
  getCombinedBounds,
  getElementBounds,
  getElementsBounds,
  Group,
  Path,
  Rect,
  Text,
} from '../../../../src';

describe('bounds utils', () => {
  describe('getElementBounds', () => {
    describe('Basic Elements', () => {
      it('should return bounds from element props when dimensions are defined', () => {
        const element = <Rect x={10} y={20} width={100} height={50} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 10,
          y: 20,
          width: 100,
          height: 50,
        });
      });

      it('should use default coordinates when position not provided', () => {
        const element = <Rect width={100} height={50} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 0,
          y: 0,
          width: 100,
          height: 50,
        });
      });

      it('should return zero dimensions when no size information available', () => {
        const element = <Rect x={10} y={20} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 10,
          y: 20,
          width: 0,
          height: 0,
        });
      });

      it('should handle ellipse elements', () => {
        const element = <Ellipse x={20} y={30} width={80} height={60} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 20,
          y: 30,
          width: 80,
          height: 60,
        });
      });

      it('should handle text elements', () => {
        const element = (
          <Text x={15} y={25} width={120} height={30}>
            Hello World
          </Text>
        );

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 15,
          y: 25,
          width: 120,
          height: 30,
        });
      });

      it('should handle null/undefined element', () => {
        const bounds = getElementBounds(null as any);
        expect(bounds).toEqual({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        });
      });
    });

    describe('Function Components - Position Transform', () => {
      it('should apply position transformation (external + internal positions)', () => {
        const IconComponent = () => (
          <Rect x={5} y={10} width={32} height={32} />
        );

        const element = <IconComponent x={100} y={200} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 105, // 100 + 5 (位置变换)
          y: 210, // 200 + 10 (位置变换)
          width: 32, // 使用内部尺寸
          height: 32,
        });
      });

      it('should prioritize internal dimensions over external dimensions', () => {
        const CustomRect = () => <Rect x={0} y={0} width={50} height={30} />;

        const element = <CustomRect x={20} y={40} width={200} height={100} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 20,
          y: 40,
          width: 200,
          height: 100,
        });
      });

      it('should handle missing external position (defaults to 0)', () => {
        const Component = () => (
          <Ellipse x={15} y={25} width={60} height={40} />
        );

        const element = <Component color="blue" />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 15, // 0 + 15
          y: 25, // 0 + 25
          width: 60,
          height: 40,
        });
      });

      it('should handle missing internal position (use external only)', () => {
        const Component = () => <Rect width={80} height={60} />;

        const element = <Component x={30} y={50} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 30, // 30 + 0
          y: 50, // 50 + 0
          width: 80,
          height: 60,
        });
      });

      it('should use external dimensions when internal dimensions missing', () => {
        const Component = () => <Rect x={5} y={10} />;

        const element = <Component x={20} y={30} width={100} height={75} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 20,
          y: 30,
          width: 100,
          height: 75,
        });
      });

      it('should handle different component types', () => {
        const MultiShapeComponent = () => (
          <Group>
            <Rect x={0} y={0} width={20} height={15} />
            <Ellipse x={25} y={10} width={30} height={20} />
            <Text x={60} y={5} width={40} height={25}>
              Label
            </Text>
          </Group>
        );

        const element = <MultiShapeComponent x={50} y={100} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 50, // 50 + 0 (Group的最小x)
          y: 100, // 100 + 0 (Group的最小y)
          width: 100, // children宽度：0到100(60+40)
          height: 30, // children高度：0到30(10+20)
        });
      });

      it('should handle function returning null/undefined', () => {
        const NullComponent = () => null;

        const element = <NullComponent x={10} y={20} width={50} height={40} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 10,
          y: 20,
          width: 50,
          height: 40,
        });
      });

      it('should handle function execution errors gracefully', () => {
        const ErrorComponent = () => {
          throw new Error('Component error');
        };

        const element = <ErrorComponent x={15} y={25} width={60} height={45} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 15,
          y: 25,
          width: 60,
          height: 45,
        });
      });
    });

    describe('Function Components - Array Returns (Fragments)', () => {
      it('should handle function components returning arrays', () => {
        const FragmentComponent = () => [
          <Rect x={0} y={0} width={30} height={20} />,
          <Ellipse x={40} y={30} width={25} height={15} />,
        ];

        const element = <FragmentComponent x={10} y={20} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 10, // 10 + 0 (最小x)
          y: 20, // 20 + 0 (最小y)
          width: 65, // 包含所有子元素：0到55(40+25)
          height: 45, // 包含所有子元素：0到45(30+15)
        });
      });

      it('should handle empty array returns', () => {
        const EmptyComponent = () => [];

        const element = <EmptyComponent x={50} y={100} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 50,
          y: 100,
          width: 0,
          height: 0,
        });
      });

      it('should handle mixed component types in array', () => {
        const MixedFragmentComponent = () => [
          <Rect x={0} y={0} width={20} height={15} />,
          <Ellipse x={30} y={20} width={25} height={18} />,
          <Text x={60} y={10} width={35} height={20}>
            Text
          </Text>,
        ];

        const element = <MixedFragmentComponent x={100} y={200} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 100, // 100 + 0
          y: 200, // 200 + 0
          width: 95, // 0到95(60+35)
          height: 38, // 0到38(20+18)
        });
      });
    });

    describe('Elements with Children', () => {
      it('should calculate bounds from children when no explicit dimensions', () => {
        const element = (
          <Group x={10} y={20}>
            <Rect x={5} y={10} width={30} height={25} />
            <Ellipse x={50} y={40} width={20} height={15} />
          </Group>
        );

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 15, // 10 + 5 (children最小x)
          y: 30, // 20 + 10 (children最小y)
          width: 65, // children宽度：5到70(70-5)
          height: 45, // children高度：10到55(55-10)
        });
      });

      it('should prioritize explicit dimensions over children bounds', () => {
        const element = (
          <Group x={0} y={0} width={200} height={150}>
            <Rect x={10} y={20} width={50} height={30} />
          </Group>
        );

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 0,
          y: 0,
          width: 200, // 使用明确指定的尺寸
          height: 150,
        });
      });

      it('should handle nested children with mixed nulls', () => {
        const element = (
          <Group x={5} y={5}>
            <Rect x={0} y={0} width={20} height={15} />
            {null}
            {undefined}
            <Ellipse x={30} y={25} width={15} height={10} />
          </Group>
        );

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 5, // 5 + 0 (children最小x)
          y: 5, // 5 + 0 (children最小y)
          width: 45, // children宽度：0到45(45-0)
          height: 35, // children高度：0到35(35-0)
        });
      });

      it('should handle deeply nested groups', () => {
        const element = (
          <Group x={10} y={10}>
            <Group x={5} y={5}>
              <Rect x={0} y={0} width={20} height={15} />
              <Group x={30} y={25}>
                <Ellipse x={0} y={0} width={10} height={8} />
              </Group>
            </Group>
          </Group>
        );

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 15, // 10 + 5 + 0 (最深层最小x)
          y: 15, // 10 + 5 + 0 (最深层最小y)
          width: 40,
          height: 33,
        });
      });
    });

    describe('Complex Nested Scenarios', () => {
      it('should handle nested function components', () => {
        const InnerIcon = () => <Rect x={2} y={3} width={16} height={16} />;

        const ButtonComponent = () => (
          <Group>
            <Rect x={0} y={0} width={32} height={32} />
            <InnerIcon x={8} y={8} />
          </Group>
        );

        const element = <ButtonComponent x={100} y={200} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 100, // 100 + 0 (Group最小x)
          y: 200, // 200 + 0 (Group最小y)
          width: 32, // children宽度：0到32
          height: 32, // children高度：0到32
        });
      });

      it('should handle component composition with different shapes', () => {
        const Badge = () => (
          <Group>
            <Ellipse x={0} y={0} width={20} height={20} />
            <Text x={5} y={6} width={10} height={8}>
              5
            </Text>
          </Group>
        );

        const Card = () => (
          <Group>
            <Rect x={0} y={0} width={100} height={60} />
            <Text x={10} y={15} width={80} height={20}>
              Card Title
            </Text>
            <Badge x={85} y={5} />
          </Group>
        );

        const element = <Card x={50} y={100} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 50, // 50 + 0
          y: 100, // 100 + 0
          width: 105, // 0到105(85+20)
          height: 60, // 0到60
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle negative coordinates', () => {
        const element = <Rect x={-10} y={-20} width={50} height={40} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: -10,
          y: -20,
          width: 50,
          height: 40,
        });
      });

      it('should handle position transformation with negative values', () => {
        const Component = () => (
          <Ellipse x={-5} y={10} width={30} height={20} />
        );

        const element = <Component x={15} y={-5} />;

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 10, // 15 + (-5)
          y: 5, // -5 + 10
          width: 30,
          height: 20,
        });
      });

      it('should handle zero dimensions', () => {
        const element = (
          <Text x={10} y={20} width={0} height={0}>
            Empty
          </Text>
        );

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 10,
          y: 20,
          width: 0,
          height: 0,
        });
      });

      it('should handle path elements', () => {
        const element = (
          <Path x={25} y={35} width={60} height={45} d="M 10 10 L 50 50 Z" />
        );

        const bounds = getElementBounds(element);
        expect(bounds).toEqual({
          x: 25,
          y: 35,
          width: 60,
          height: 45,
        });
      });
    });

    describe('Extra Case', () => {
      it('case 1', () => {
        const HorizontalLayout = () => {
          const gap = 10;
          const children = [
            <Rect width={30} height={40} fill="red" strokeWidth={10} />,
            <Ellipse width={50} height={50} fill="blue" />,
          ];

          let currX = 0;
          const content = children.map((child) => {
            const bounds = getElementBounds(child);
            const x = currX + bounds.x;
            currX += bounds.width + gap;
            return cloneElement(child, { x, y: bounds.y });
          });
          const { width, height } = getElementsBounds(content);
          return (
            <Group x={10} y={10} width={width} height={height}>
              {content}
            </Group>
          );
        };

        expect(getElementBounds(<HorizontalLayout />)).toEqual({
          x: 10,
          y: 10,
          width: 90,
          height: 50,
        });
      });
    });
  });

  describe('getElementsBounds', () => {
    it('should return zero bounds for empty array', () => {
      const bounds = getElementsBounds([]);
      expect(bounds).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should return zero bounds for null/undefined input', () => {
      const bounds = getElementsBounds(null as any);
      expect(bounds).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should return bounds for single element', () => {
      const elements = [<Rect x={20} y={30} width={80} height={60} />];

      const bounds = getElementsBounds(elements);
      expect(bounds).toEqual({
        x: 20,
        y: 30,
        width: 80,
        height: 60,
      });
    });

    it('should calculate combined bounds for multiple elements', () => {
      const elements = [
        <Rect x={10} y={20} width={30} height={25} />, // (10,20) to (40,45)
        <Ellipse x={50} y={60} width={40} height={35} />, // (50,60) to (90,95)
        <Text x={5} y={15} width={20} height={15}>
          Text
        </Text>, // (5,15) to (25,30)
      ];

      const bounds = getElementsBounds(elements);
      expect(bounds).toEqual({
        x: 5, // 最小x
        y: 15, // 最小y
        width: 85, // 从5到90，宽度85
        height: 80, // 从15到95，高度80
      });
    });

    it('should handle elements with negative coordinates', () => {
      const elements = [
        <Rect x={-20} y={-10} width={30} height={25} />, // (-20,-10) to (10,15)
        <Ellipse x={15} y={30} width={25} height={20} />, // (15,30) to (40,50)
      ];

      const bounds = getElementsBounds(elements);
      expect(bounds).toEqual({
        x: -20,
        y: -10,
        width: 60, // 从-20到40，宽度60
        height: 60, // 从-10到50，高度60
      });
    });

    it('should filter out null/undefined elements', () => {
      const elements = [
        <Rect x={0} y={0} width={20} height={15} />,
        null,
        undefined,
        <Ellipse x={30} y={25} width={15} height={10} />,
      ];

      const bounds = getElementsBounds(elements);
      expect(bounds).toEqual({
        x: 0,
        y: 0,
        width: 45, // 从0到45(30+15)
        height: 35, // 从0到35(25+10)
      });
    });

    it('should handle mixed component types', () => {
      const elements = [
        <Rect x={10} y={15} width={25} height={20} />,
        <Ellipse x={40} y={30} width={30} height={25} />,
        <Text x={5} y={10} width={15} height={12}>
          Label
        </Text>,
        <Path x={50} y={40} width={20} height={18} d="M 0 0 L 10 10" />,
      ];

      const bounds = getElementsBounds(elements);
      expect(bounds).toEqual({
        x: 5, // 最小x
        y: 10, // 最小y
        width: 65, // 从5到70(50+20)
        height: 48, // 从10到58(40+18)
      });
    });

    it('should handle elements with zero dimensions creating bounding box', () => {
      const elements = [
        <Rect x={10} y={20} width={0} height={0} />, // 点(10,20)
        <Ellipse x={30} y={40} width={0} height={0} />, // 点(30,40)
        <Text x={50} y={60} width={20} height={15}>
          Text
        </Text>, // 矩形
      ];

      const bounds = getElementsBounds(elements);
      expect(bounds).toEqual({
        x: 10,
        y: 20,
        width: 60, // 从10到70(50+20)
        height: 55, // 从20到75(60+15)
      });
    });

    it('should handle function components in array', () => {
      const IconComponent = () => <Rect x={5} y={5} width={20} height={20} />;
      const LabelComponent = () => (
        <Text x={30} y={10} width={40} height={15}>
          Label
        </Text>
      );

      const elements = [
        <IconComponent x={10} y={20} />, // 实际位置：(15,25)，尺寸：20x20
        <LabelComponent x={50} y={60} />, // 实际位置：(80,70)，尺寸：40x15
      ];

      const bounds = getElementsBounds(elements);
      expect(bounds).toEqual({
        x: 15, // 最小x
        y: 25, // 最小y
        width: 105, // 从15到120(80+40)
        height: 60, // 从25到85(70+15)
      });
    });

    it('extra case 1', () => {
      const Node = (props: any) => {
        return (
          <Group {...props}>
            <Rect width={30} height={30} />
            <Rect x={50} width={100} height={30} />
          </Group>
        );
      };
      expect(getElementBounds(<Node y={100} />)).toEqual({
        x: 0,
        y: 100,
        width: 150,
        height: 30,
      });
    });
  });

  describe('getCombinedBounds', () => {
    it('should return zero bounds for empty array', () => {
      const bounds = getCombinedBounds([]);
      expect(bounds).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should return zero bounds for null/undefined input', () => {
      const bounds = getCombinedBounds(null as any);
      expect(bounds).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should return copy of bounds for single element', () => {
      const boundsArray: Bounds[] = [{ x: 15, y: 25, width: 60, height: 40 }];

      const bounds = getCombinedBounds(boundsArray);
      expect(bounds).toEqual({
        x: 15,
        y: 25,
        width: 60,
        height: 40,
      });

      // 确保返回的是副本
      expect(bounds).not.toBe(boundsArray[0]);
    });

    it('should calculate combined bounds for multiple rectangles', () => {
      const boundsArray: Bounds[] = [
        { x: 10, y: 20, width: 30, height: 25 }, // (10,20) to (40,45)
        { x: 50, y: 60, width: 40, height: 35 }, // (50,60) to (90,95)
        { x: 5, y: 15, width: 20, height: 15 }, // (5,15) to (25,30)
      ];

      const bounds = getCombinedBounds(boundsArray);
      expect(bounds).toEqual({
        x: 5,
        y: 15,
        width: 85, // 从5到90
        height: 80, // 从15到95
      });
    });

    it('should handle bounds with negative coordinates', () => {
      const boundsArray: Bounds[] = [
        { x: -25, y: -15, width: 40, height: 30 }, // (-25,-15) to (15,15)
        { x: 20, y: 35, width: 30, height: 25 }, // (20,35) to (50,60)
      ];

      const bounds = getCombinedBounds(boundsArray);
      expect(bounds).toEqual({
        x: -25,
        y: -15,
        width: 75, // 从-25到50
        height: 75, // 从-15到60
      });
    });

    it('should handle bounds with zero dimensions', () => {
      const boundsArray: Bounds[] = [
        { x: 10, y: 20, width: 0, height: 0 }, // 点(10,20)
        { x: 30, y: 40, width: 0, height: 0 }, // 点(30,40)
        { x: 50, y: 60, width: 25, height: 20 }, // 矩形
      ];

      const bounds = getCombinedBounds(boundsArray);
      expect(bounds).toEqual({
        x: 10,
        y: 20,
        width: 65, // 从10到75(50+25)
        height: 60, // 从20到80(60+20)
      });
    });

    it('should handle all zero bounds', () => {
      const boundsArray: Bounds[] = [
        { x: 0, y: 0, width: 0, height: 0 },
        { x: 0, y: 0, width: 0, height: 0 },
        { x: 0, y: 0, width: 0, height: 0 },
      ];

      const bounds = getCombinedBounds(boundsArray);
      expect(bounds).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should handle mixed positive and zero bounds', () => {
      const boundsArray: Bounds[] = [
        { x: 0, y: 0, width: 0, height: 0 },
        { x: 20, y: 30, width: 40, height: 50 },
        { x: 0, y: 0, width: 0, height: 0 },
      ];

      const bounds = getCombinedBounds(boundsArray);
      expect(bounds).toEqual({
        x: 0,
        y: 0,
        width: 60, // 从0到60(20+40)
        height: 80, // 从0到80(30+50)
      });
    });
  });
});
