import {Page} from 'components/Layout/Page';
import GalleryPage from '../components/Gallery/GalleryPage';

export default function Examples() {
  return (
    <Page
      toc={[]}
      routeTree={{title: '示例', path: '/examples', routes: []}}
      meta={{title: '示例'}}
      section="examples">
        <GalleryPage />
    </Page>
  );
}
