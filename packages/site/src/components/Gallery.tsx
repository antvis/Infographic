import { getTemplates } from '@antv/infographic';
import Infographic from './Infographic';

// registerResourceLoader(async (config) => {
//   const { data } = config;
//   const [type, id] = data.split(':');

//   if (type === 'icon') {
//     const res = await fetch(`https://api.iconify.design/${id}.svg`).then(
//       (res) => res.text(),
//     );
//     return loadSVGResource(res);
//   } else if (type === 'illus') {
//     // from: https://github.com/balazser/undraw-svg-collection
//     const rest = await fetch(
//       `https://raw.githubusercontent.com/balazser/undraw-svg-collection/refs/heads/main/svgs/${id}.svg`,
//     ).then((res) => res.text());
//     return loadSVGResource(rest);
//   }
// });

const containerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
  gap: '24px',
  padding: '20px 0',
};

const cardStyle: React.CSSProperties = {
  position: 'relative',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e8e8e8',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  cursor: 'pointer',
};

const cardHoverStyle = {
  transform: 'translateY(-4px)',
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
  borderColor: '#d0d0d0',
};

const contentStyle: React.CSSProperties = {
  height: '300px',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fafafa',
  overflow: 'hidden',
};

const infographicWrapperStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const labelStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#262626',
  backgroundColor: '#ffffff',
  borderTop: '1px solid #f0f0f0',
  textAlign: 'center',
  letterSpacing: '0.3px',
};

export default () => {
  const templates = getTemplates();
  const dataKeys = ['list', 'hierarchy', 'compare', 'swot'];
  const dataFallbackMap = {
    sequence: 'list',
  };

  return (
    <div style={containerStyle}>
      {templates.map((key) => {
        const d = key.split('-')[0];
        return (
          <div
            key={key}
            style={cardStyle}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = cardStyle.boxShadow || '';
              e.currentTarget.style.borderColor = cardStyle.borderColor || '';
            }}
          >
            <div style={contentStyle}>
              <div style={infographicWrapperStyle}>
                <Infographic
                  options={{ template: key }}
                  data={
                    dataKeys.includes(d)
                      ? d
                      : dataFallbackMap[d] || dataFallbackMap[key] || 'list'
                  }
                />
              </div>
            </div>
            <div style={labelStyle}>{key}</div>
          </div>
        );
      })}
    </div>
  );
};
