import { Flex, Radio } from 'antd';
import { useState } from 'react';
import { Composite } from './Composite';
import { ItemPreview } from './ItemPreview';
import { Preview } from './Preview';

export const App = () => {
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'composite';
  };

  const [tab, setTab] = useState(getInitialTab);

  const handleTabChange = (value: string) => {
    setTab(value);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', value);
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params}`,
    );
  };

  return (
    <Flex vertical style={{ height: '100%' }}>
      <Radio.Group
        options={[
          { label: '灵活组合', value: 'composite' },
          { label: '模版预览', value: 'preview' },
          { label: '数据项预览', value: 'item' },
        ]}
        value={tab}
        onChange={(e) => handleTabChange(e.target.value)}
        block
        optionType="button"
        buttonStyle="solid"
        style={{ padding: 16 }}
      />
      {tab === 'composite' ? (
        <Composite />
      ) : tab === 'preview' ? (
        <Preview />
      ) : (
        <ItemPreview />
      )}
    </Flex>
  );
};
