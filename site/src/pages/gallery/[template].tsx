import {GetStaticPaths, GetStaticProps} from 'next';
import DetailPage from '../../components/Gallery/DetailPage';
import {TEMPLATES} from '../../components/Gallery/templates';
import {Page} from '../../components/Layout/Page';

interface Props {
  template: string;
}

export default function ExampleDetail({template}: Props) {
  return (
    <Page
      toc={[]}
      routeTree={{title: '示例', path: '/gallery', routes: []}}
      meta={{title: `${template} - Gallery`}}
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
  const template = params?.template as string;
  return {
    props: {
      template,
    },
  };
};
