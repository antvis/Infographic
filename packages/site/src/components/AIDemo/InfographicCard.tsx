import Infographic from '../Infographic';
import '../ResourceLoader';
import { InfographicConfig } from './types';

interface InfographicCardProps {
  options: InfographicConfig;
  loading?: boolean;
}

/**
 * 信息图渲染卡片组件
 * 基于新的 Infographic 组件，支持悬浮显示复制和放大按钮
 */
export default function InfographicCard({
  options,
  loading = false,
}: InfographicCardProps) {
  return (
    <div
      className="ai-infographic-card"
      style={{
        width: '100%',
        minWidth: 300,
        borderRadius: 8,
      }}
    >
      <Infographic
        options={{ themeConfig: { palette: 'antv' }, ...options }}
        loading={loading}
        containerStyle={{
          minWidth: 300,
          borderRadius: 8,
        }}
      />
    </div>
  );
}
