import DetailPage from '../../components/Gallery/DetailPage';
import {Page} from '../../components/Layout/Page';

export default function ExampleDetail() {
  return (
    <Page
      toc={[]}
      routeTree={{title: '示例', path: '/gallery', routes: []}}
      meta={{title: '示例'}}
      section="gallery"
      showFooter={false}>
      <DetailPage />
    </Page>
  );
}
