import {useMemo} from 'react';
import {useLocaleBundle} from '../../../hooks/useTranslation';
import {Infographic} from '../../Infographic';

// 翻译文本
const TRANSLATIONS = {
  'zh-CN': {
    syntax: `
infographic list-row-horizontal-icon-arrow
data
  title 互联网技术演进史
  desc 从Web 1.0到AI时代的关键里程碑
  lists
    - time 1991
      label 万维网诞生
      desc Tim Berners-Lee发布首个网站，开启互联网时代
      icon mdi/web
    - time 2004
      label Web 2.0兴起
      desc 社交媒体和用户生成内容成为主流
      icon mdi/account-multiple
    - time 2007
      label 移动互联网
      desc iPhone发布，智能手机改变世界
      icon mdi/cellphone
    - time 2015
      label 云原生时代
      desc 容器化和微服务架构广泛应用
      icon mdi/cloud
    - time 2020
      label 低代码平台
      desc 可视化开发降低技术门槛
      icon mdi/application-brackets
    - time 2023
      label AI大模型
      desc ChatGPT引爆生成式AI革命
      icon mdi/brain
themeConfig
  palette antv
`,
    codeExample: `import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: "#container",
  height: 240,
  editable: true,
});

const syntax = \`
infographic list-row-horizontal-icon-arrow
data
  title 互联网技术演进史
  desc 从Web 1.0到AI时代的关键里程碑
  lists
    - time 1991
      label 万维网诞生
      desc Tim Berners-Lee发布首个网站，开启互联网时代
      icon mdi/web
    - ...
\`

infographic.render(syntax);`,
  },
  'en-US': {
    syntax: `
infographic list-row-horizontal-icon-arrow
data
  title Internet Technology Evolution
  desc Key milestones from Web 1.0 to AI era
  lists
    - time 1991
      label World Wide Web
      desc Tim Berners-Lee launches first website, opening the Internet era
      icon mdi/web
    - time 2004
      label Web 2.0 Era
      desc Social media and user-generated content become mainstream
      icon mdi/account-multiple
    - time 2007
      label Mobile Internet
      desc iPhone launched, smartphones change the world
      icon mdi/cellphone
    - time 2015
      label Cloud Native
      desc Containerization and microservices widely adopted
      icon mdi/cloud
    - time 2020
      label Low-Code Platform
      desc Visual development lowers technical barriers
      icon mdi/application-brackets
    - time 2023
      label AI Large Models
      desc ChatGPT triggers generative AI revolution
      icon mdi/brain
themeConfig
  palette antv
`,
    codeExample: `import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: "#container",
  height: 240,
  editable: true,
});

const syntax = \`
infographic list-row-horizontal-icon-arrow
data
  title Internet Technology Evolution
  desc Key milestones from Web 1.0 to AI era
  lists
    - time 1991
      label World Wide Web
      desc Tim Berners-Lee launches first website, opening the Internet era
      icon mdi/web
    - ...
\`

infographic.render(syntax);`,
  },
};

export function QuickStartDemo() {
  const translation = useLocaleBundle(TRANSLATIONS);

  return (
    <Infographic
      init={{
        height: 240,
        editable: true,
      }}
      options={translation.syntax}
    />
  );
}

export function useQuickStartDemoCode() {
  const translation = useLocaleBundle(TRANSLATIONS);
  return useMemo(() => translation.codeExample, [translation]);
}
