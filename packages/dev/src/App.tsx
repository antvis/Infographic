import { Flex, Radio } from 'antd';
import { useState } from 'react';
import { Composite } from './Composite';
import { Preview } from './Preview';

export const App = () => {
  const [tab, setTab] = useState('composite');

  return (
    <Flex vertical gap={16} style={{ padding: 16 }}>
      <Radio.Group
        options={[
          { label: '灵活组合', value: 'composite' },
          { label: '模版预览', value: 'preview' },
        ]}
        value={tab}
        onChange={(e) => setTab(e.target.value)}
        block
        optionType="button"
        buttonStyle="solid"
      />
      {tab === 'composite' ? <Composite /> : <Preview />}
    </Flex>
  );
};
