import {GetStaticPaths, GetStaticProps} from 'next';
import DetailPage from '../../components/Gallery/DetailPage';
import {TEMPLATES} from '../../components/Gallery/templates';
import {Page} from '../../components/Layout/Page';
import {useLocaleBundle} from '../../hooks/useTranslation';

const TRANSLATIONS = {
  'zh-CN': {
    routeTitle: '示例',
    gallery: '示例库',
  },
  'en-US': {
    routeTitle: 'Example',
    gallery: 'Gallery',
  },
};

interface Props {
  template: string;
}

export default function ExampleDetail({template}: Props) {
  const t = useLocaleBundle(TRANSLATIONS);

  return (
    <Page
      toc={[]}
      routeTree={{title: t.routeTitle, path: '/gallery', routes: []}}
      meta={{title: `${template} - ${t.gallery}`}}
      section="gallery"
      showFooter={false}>
      <DetailPage templateId={template} />
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = TEMPLATES.map((t) => ({
    params: {template: t.template},
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({params}) => {
  const template = params?.template;
  if (typeof template !== 'string') {
    return {notFound: true};
  }

  return {
    props: {
      template,
    },
  };
};
