import { Font } from './types';

const BASE_FONT_URL = 'https://assets.antv.antgroup.com';

const getUrl = (name: string) => `${name}/result.css`;

export const BUILT_IN_FONTS: Font[] = [
  {
    fontFamily: 'Alibaba PuHuiTi',
    name: '阿里巴巴普惠体',
    baseUrl: BASE_FONT_URL,
    fontWeight: {
      regular: getUrl('AlibabaPuHuiTi-Regular'),
      bold: getUrl('AlibabaPuHuiTi-Bold'),
    },
  },
  {
    fontFamily: 'Source Han Sans',
    name: '黑体',
    baseUrl: BASE_FONT_URL,
    fontWeight: { regular: getUrl('SourceHanSansCN-Regular') },
  },
  {
    fontFamily: 'Source Han Serif',
    name: '宋体',
    baseUrl: BASE_FONT_URL,
    fontWeight: { regular: getUrl('SourceHanSerifCN-Regular') },
  },
  {
    fontFamily: 'LXGW WenKai',
    name: '楷体',
    baseUrl: BASE_FONT_URL,
    fontWeight: { regular: getUrl('LXGWWenKai-Regular') },
  },
  {
    fontFamily: '851tegakizatsu',
    name: '手写体',
    baseUrl: BASE_FONT_URL,
    fontWeight: { regular: getUrl('851tegakizatsu-Regular') },
  },
];
