import * as d3 from 'd3';
import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group, Path } from '../../jsx';
import { ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface NetworkNode extends d3.SimulationNodeDatum {
  id: number;
  data: any;
  isCenter: boolean;
  _originalIndex: number[];
}

export interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  source: number | NetworkNode;
  target: number | NetworkNode;
}

export interface RelationNetworkProps extends BaseStructureProps {
  spacing?: number;
  showConnections?: boolean;
}

export const RelationNetwork: ComponentType<RelationNetworkProps> = (props) => {
  const {
    Title,
    Item,
    data,
    spacing = 120,
    showConnections = true,
    options,
  } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  if (items.length === 0) {
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group>
          <ItemsGroup />
        </Group>
      </FlexLayout>
    );
  }

  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );

  /** --- Force Layout --- */
  function runForceLayout(): { nodes: NetworkNode[]; links: NetworkLink[] } {
    const nodes: NetworkNode[] = items.map((item, index) => ({
      id: index,
      data: item,
      isCenter: index === 0,
      _originalIndex: [index],
    }));

    const links: NetworkLink[] = items.slice(1).map((_, index) => ({
      source: 0,
      target: index + 1,
    }));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink<NetworkNode, NetworkLink>(links)
          .id((d: any) => d.id)
          .distance(spacing),
      )
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(0, 0))
      .force(
        'collision',
        d3
          .forceCollide()
          .radius(Math.max(itemBounds.width, itemBounds.height) / 2 + 10),
      );

    for (let i = 0; i < 300; ++i) simulation.tick();

    return { nodes, links };
  }

  const { nodes, links } = runForceLayout();

  /** --- 偏移 --- */
  const minX = Math.min(...nodes.map((d) => d.x ?? 0));
  const minY = Math.min(...nodes.map((d) => d.y ?? 0));
  const offsetX = Math.max(0, -minX + itemBounds.width / 2);
  const offsetY = Math.max(0, -minY + itemBounds.height / 2);

  const positionBy = (x: number, y: number) => ({
    positionH: x < -50 ? 'flipped' : x > 50 ? 'normal' : 'center',
    positionV: y < -50 ? 'flipped' : y > 50 ? 'normal' : 'middle',
  });

  /** --- 节点 --- */
  const nodesEls: JSXElement[] = nodes
    .map((node) => {
      if (node.x == null || node.y == null) return null;

      const x = node.x + offsetX - itemBounds.width / 2;
      const y = node.y + offsetY - itemBounds.height / 2;
      const { positionH, positionV } = positionBy(node.x, node.y);

      return (
        <Item
          key={node.id}
          indexes={node._originalIndex}
          datum={node.data}
          data={data}
          x={x}
          y={y}
          positionH={positionH}
          positionV={positionV}
        />
      );
    })
    .filter(Boolean) as JSXElement[];

  /** --- 连线 --- */
  const linksMap = new Map(nodes.map((n) => [n.id, n]));
  const linksEls: JSXElement[] = showConnections
    ? (links
        .map((link) => {
          const src =
            typeof link.source === 'object'
              ? link.source
              : linksMap.get(link.source);
          const tgt =
            typeof link.target === 'object'
              ? link.target
              : linksMap.get(link.target);

          if (
            !src ||
            !tgt ||
            src.x == null ||
            src.y == null ||
            tgt.x == null ||
            tgt.y == null
          )
            return null;

          const linePath = `M ${src.x + offsetX} ${src.y + offsetY} L ${tgt.x + offsetX} ${tgt.y + offsetY}`;
          return (
            <Path
              d={linePath}
              stroke={getColorPrimary(options)}
              strokeWidth={2}
              strokeOpacity={0.6}
            />
          );
        })
        .filter(Boolean) as JSXElement[])
    : [];

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group>
        <Group>{linksEls}</Group>
        <ItemsGroup>{nodesEls}</ItemsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('relation-network', {
  component: RelationNetwork,
  composites: ['title', 'item'],
});
