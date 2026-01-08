import {Page} from 'components/Layout/Page';
import GalleryPage from '../components/Gallery/GalleryPage';

export default function Gallery() {
  return (
    <Page
      toc={[]}
      routeTree={{title: '示例', path: '/gallery', routes: []}}
      meta={{title: '示例'}}
      section="gallery"
      topNavOptions={{
        hideBrandWhenHeroVisible: true,
        overlayOnHome: true,
        heroAnchorId: 'gallery-hero-anchor',
      }}>
      <GalleryPage />
    </Page>
  );
}
