import { InfographicOptions } from '@antv/infographic';
import Infographic from '../Infographic';
import SectionHeader from '../SectionHeader';
import styles from './styles.module.css';

export default function StatsSection() {
  const statsOptions: Partial<InfographicOptions> = {
    data: {
      items: [
        { label: '数据项设计', desc: '丰富数据项设计', value: 26 },
        { label: '结构布局', desc: '多样结构布局', value: 28 },
        { label: '内置模版', desc: '开箱即用的模板', value: 80 },
        { label: '开源免费', desc: 'MIT 协议', value: 100 },
      ],
    },
    design: {
      structure: {
        type: 'chart-column',
        valueFormatter: (v, d) => {
          const label = d.label as string;
          if (label === '开源免费') return `${v}%`;
          if (label === '数据项设计' || label === '结构布局') return '~30';
          if (label === '内置模版') return '~80';
          return '';
        },
      },
      item: 'simple',
    },
    themeConfig: {
      palette: [
        '#1890ff',
        '#52c41a',
        '#fa8c16',
        '#722ed1',
        '#eb2f96',
        '#13c2c2',
        '#faad14',
        '#2f54eb',
      ],
    },
  };

  return (
    <section className={styles.statsSection}>
      <div className="container">
        <SectionHeader
          title="数据一览"
          subtitle="让数字说话，用可视化展现价值"
        />
        <Infographic
          options={statsOptions}
          showActions={true}
          containerStyle={{ width: '60%', margin: '0 auto' }}
        />
      </div>
    </section>
  );
}
