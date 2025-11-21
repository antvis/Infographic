import {Infographic} from '../../Infographic';

export function QuickStartDemo() {
  return (
    <Infographic
      options={{
        height: 240,
        // 数据
        data: {
          title: '互联网技术演进史',
          desc: '从Web 1.0到AI时代的关键里程碑',
          items: [
            {
              time: '1991',
              label: '万维网诞生',
              desc: 'Tim Berners-Lee发布首个网站，开启互联网时代',
              icon: 'icon:mdi/web',
            },
            {
              time: '2004',
              label: 'Web 2.0兴起',
              desc: '社交媒体和用户生成内容成为主流',
              icon: 'icon:mdi/account-multiple',
            },
            {
              time: '2007',
              label: '移动互联网',
              desc: 'iPhone发布，智能手机改变世界',
              icon: 'icon:mdi/cellphone',
            },
            {
              time: '2015',
              label: '云原生时代',
              desc: '容器化和微服务架构广泛应用',
              icon: 'icon:mdi/cloud',
            },
            {
              time: '2020',
              label: '低代码平台',
              desc: '可视化开发降低技术门槛',
              icon: 'icon:mdi/application-brackets',
            },
            {
              time: '2023',
              label: 'AI大模型',
              desc: 'ChatGPT引爆生成式AI革命',
              icon: 'icon:mdi/brain',
            },
          ],
        },
        themeConfig: {
          palette: 'antv',
        },
        // 使用预设模版
        template: 'list-row-horizontal-icon-arrow',
      }}
    />
  );
}

export const QuickStartDemoCode = `import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: "#container",
  height: 240,
  data: {
    title: '互联网技术演进史',
    desc: '从Web 1.0到AI时代的关键里程碑',
    items: [
      {
        time: '1991',
        label: '万维网诞生',
        desc: 'Tim Berners-Lee发布首个网站，开启互联网时代',
        icon: 'icon:mdi/web',
      },
      // ...
    ],
  },
  themeConfig: { palette: 'antv' },
  template: 'list-row-horizontal-icon-arrow',
});

infographic.render();`;
