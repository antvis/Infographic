/** @jsxImportSource ../../../src */
import { describe, expect, it } from 'vitest';
import { Group, Path, Rect, renderSVG, Text } from '../../../src';

describe('SVG Animation Examples', () => {
  it('should create a pulsing button effect', () => {
    const PulsingButton = () => (
      <Group>
        <Rect
          x={10}
          y={10}
          width={100}
          height={40}
          rx={5}
          fill="#1890ff"
          opacity={0.8}
        >
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </Rect>
        <Text x={60} y={30} fill="white" fontSize={16} textAnchor="middle">
          Click Me
        </Text>
      </Group>
    );

    const svg = renderSVG(<PulsingButton />);
    expect(svg).toContain('<animate');
    expect(svg).toContain('attributeName="opacity"');
    expect(svg).toContain('values="0.8;1;0.8"');
  });

  it('should create a dashed line animation (流动的虚线边)', () => {
    const FlowingDashedLine = () => (
      <Path
        d="M 50,50 L 200,50"
        stroke="#52c41a"
        strokeWidth={3}
        fill="none"
        strokeDasharray="10,5"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="15"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </Path>
    );

    const svg = renderSVG(<FlowingDashedLine />);
    expect(svg).toContain('stroke-dasharray="10,5"');
    expect(svg).toContain('attributeName="stroke-dashoffset"');
    expect(svg).toContain('from="0"');
    expect(svg).toContain('to="15"');
  });

  it('should create a path drawing animation (路径绘制动画)', () => {
    const DrawingPath = () => {
      const pathLength = 300; // 路径总长度
      return (
        <Path
          d="M 20,50 Q 100,20 180,50 T 340,50"
          stroke="#fa8c16"
          strokeWidth={2}
          fill="none"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength}
        >
          <animate
            attributeName="stroke-dashoffset"
            from={String(pathLength)}
            to="0"
            dur="3s"
            fill="freeze"
          />
        </Path>
      );
    };

    const svg = renderSVG(<DrawingPath />);
    expect(svg).toContain('stroke-dasharray="300"');
    expect(svg).toContain('stroke-dashoffset="300"');
    expect(svg).toContain('from="300"');
    expect(svg).toContain('to="0"');
  });

  it('should create a rotating loader (旋转加载器)', () => {
    const RotatingLoader = () => (
      <Group>
        <Rect
          x={45}
          y={5}
          width={10}
          height={40}
          rx={5}
          fill="#13c2c2"
          transform="translate(50, 50)"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="1s"
            repeatCount="indefinite"
          />
        </Rect>
      </Group>
    );

    const svg = renderSVG(<RotatingLoader />);
    expect(svg).toContain('<animateTransform');
    expect(svg).toContain('type="rotate"');
    expect(svg).toContain('from="0 50 50"');
    expect(svg).toContain('to="360 50 50"');
  });

  it('should create a breathing effect (呼吸效果)', () => {
    const BreathingCircle = () => (
      <circle cx={50} cy={50} r={30} fill="#722ed1">
        <animate
          attributeName="r"
          values="30;40;30"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    );

    const svg = renderSVG(<BreathingCircle />);
    expect(svg).toContain('attributeName="r"');
    expect(svg).toContain('values="30;40;30"');
    expect(svg).toContain('attributeName="opacity"');
  });

  it('should create a complex edge animation for graphs (复杂的图边动画)', () => {
    const AnimatedEdge = ({
      d,
      color = '#1890ff',
    }: {
      d: string;
      color?: string;
    }) => (
      <Group>
        {/* 背景线 */}
        <Path d={d} stroke={color} strokeWidth={2} fill="none" opacity={0.3} />
        {/* 流动的虚线 */}
        <Path
          d={d}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeDasharray="8,4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="12"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </Path>
      </Group>
    );

    const svg = renderSVG(
      <AnimatedEdge d="M 10,50 L 100,50 L 150,100" color="#52c41a" />,
    );
    expect(svg).toContain('stroke-dasharray="8,4"');
    expect(svg).toContain('attributeName="stroke-dashoffset"');
    expect(svg).toContain('stroke="#52c41a"');
  });
});
