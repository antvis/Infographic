import { getTemplates } from '@antv/infographic';
import { Flex, Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import { Infographic } from './Infographic';
import { COMPARE_DATA, HIERARCHY_DATA, LIST_DATA } from './data';

const templates = getTemplates();

const DATA = {
  list: { label: '列表数据', value: LIST_DATA },
  hierarchy: { label: '层级数据', value: HIERARCHY_DATA },
  compare: { label: '对比数据', value: COMPARE_DATA },
} as const;

export const Preview = () => {
  const [template, setTemplate] = useState(templates[0]);
  const [data, setData] = useState<keyof typeof DATA>('list');

  useEffect(() => {
    if (template.startsWith('hierarchy-')) {
      setData('hierarchy');
    } else if (template.startsWith('compare-')) {
      setData('compare');
    } else {
      setData('list');
    }
  }, [template]);

  return (
    <Flex vertical>
      <Form layout="inline">
        <Form.Item label="模板">
          <Select
            value={template}
            style={{ width: 200 }}
            options={templates.map((value) => ({ label: value, value }))}
            onChange={(value) => setTemplate(value)}
          />
        </Form.Item>
        <Form.Item label="数据">
          <Select
            value={data}
            style={{ width: 200 }}
            options={Object.entries(DATA).map(([key, { label }]) => ({
              label,
              value: key,
            }))}
            onChange={(value) => setData(value)}
          />
        </Form.Item>
      </Form>
      <Infographic
        options={{
          template,
          data: DATA[data].value,
          padding: 20,
        }}
      />
    </Flex>
  );
};
