import {useEffect, useMemo, useState} from 'react';
import {getStoredLanguage, type Language} from '../../../utils/i18n';
import {Infographic} from '../../Infographic';

// 翻译文本
const translations = {
  'zh-CN': {
    title: '互联网技术演进史',
    desc: '从Web 1.0到AI时代的关键里程碑',
    items: [
      {
        time: '1991',
        label: '万维网诞生',
        desc: 'Tim Berners-Lee发布首个网站，开启互联网时代',
      },
      {
        time: '2004',
        label: 'Web 2.0兴起',
        desc: '社交媒体和用户生成内容成为主流',
      },
      {time: '2007', label: '移动互联网', desc: 'iPhone发布，智能手机改变世界'},
      {time: '2015', label: '云原生时代', desc: '容器化和微服务架构广泛应用'},
      {time: '2020', label: '低代码平台', desc: '可视化开发降低技术门槛'},
      {time: '2023', label: 'AI大模型', desc: 'ChatGPT引爆生成式AI革命'},
    ],
    codeTitle: '互联网技术演进史',
    codeDesc: '从Web 1.0到AI时代的关键里程碑',
    codeItemLabel: '万维网诞生',
    codeItemDesc: 'Tim Berners-Lee发布首个网站，开启互联网时代',
  },
  en: {
    title: 'Internet Technology Evolution',
    desc: 'Key milestones from Web 1.0 to AI era',
    items: [
      {
        time: '1991',
        label: 'World Wide Web',
        desc: 'Tim Berners-Lee launches first website, opening the Internet era',
      },
      {
        time: '2004',
        label: 'Web 2.0 Era',
        desc: 'Social media and user-generated content become mainstream',
      },
      {
        time: '2007',
        label: 'Mobile Internet',
        desc: 'iPhone launched, smartphones change the world',
      },
      {
        time: '2015',
        label: 'Cloud Native',
        desc: 'Containerization and microservices widely adopted',
      },
      {
        time: '2020',
        label: 'Low-Code Platform',
        desc: 'Visual development lowers technical barriers',
      },
      {
        time: '2023',
        label: 'AI Large Models',
        desc: 'ChatGPT triggers generative AI revolution',
      },
    ],
    codeTitle: 'Internet Technology Evolution',
    codeDesc: 'Key milestones from Web 1.0 to AI era',
    codeItemLabel: 'World Wide Web',
    codeItemDesc:
      'Tim Berners-Lee launches first website, opening the Internet era',
  },
};

const getSyntax = (lang: Language) => {
  const t = translations[lang] || translations.en;
  return `
infographic list-row-horizontal-icon-arrow
data
  title ${t.title}
  desc ${t.desc}
  items
    - time ${t.items[0].time}
      label ${t.items[0].label}
      desc ${t.items[0].desc}
      icon mdi/web
    - time ${t.items[1].time}
      label ${t.items[1].label}
      desc ${t.items[1].desc}
      icon mdi/account-multiple
    - time ${t.items[2].time}
      label ${t.items[2].label}
      desc ${t.items[2].desc}
      icon mdi/cellphone
    - time ${t.items[3].time}
      label ${t.items[3].label}
      desc ${t.items[3].desc}
      icon mdi/cloud
    - time ${t.items[4].time}
      label ${t.items[4].label}
      desc ${t.items[4].desc}
      icon mdi/application-brackets
    - time ${t.items[5].time}
      label ${t.items[5].label}
      desc ${t.items[5].desc}
      icon mdi/brain
themeConfig
  palette antv
      `;
};

const getCodeExample = (lang: Language) => {
  const t = translations[lang] || translations.en;
  return `import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: "#container",
  height: 240,
  editable: true,
});

const syntax = \`
infographic list-row-horizontal-icon-arrow
data
  title ${t.codeTitle}
  desc ${t.codeDesc}
  items
    - time 1991
      label ${t.codeItemLabel}
      desc ${t.codeItemDesc}
      icon mdi/web
    - ...
\`

infographic.render(syntax);`;
};

export function QuickStartDemo() {
  const [lang, setLang] = useState<Language>('zh-CN');

  useEffect(() => {
    setLang(getStoredLanguage());
  }, []);

  const syntax = useMemo(() => getSyntax(lang), [lang]);

  return (
    <Infographic
      init={{
        height: 240,
        editable: true,
      }}
      options={syntax}
    />
  );
}

export function useQuickStartDemoCode() {
  const [lang, setLang] = useState<Language>('zh-CN');

  useEffect(() => {
    setLang(getStoredLanguage());
  }, []);

  return useMemo(() => getCodeExample(lang), [lang]);
}

// 保留原有的导出以保持向后兼容
export const QuickStartDemoCode = getCodeExample('zh-CN');
