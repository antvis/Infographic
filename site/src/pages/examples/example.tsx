import DetailPage from '../../components/Gallery/DetailPage';
import {Page} from '../../components/Layout/Page';

export default function ExampleDetail() {
  return (
    <Page
      toc={[]}
      routeTree={{title: '示例', path: '/examples', routes: []}}
      meta={{title: '示例'}}
      section="examples"
      showFooter={false}>
      <DetailPage />
    </Page>
  );
}
