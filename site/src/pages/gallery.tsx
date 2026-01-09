import {Page} from 'components/Layout/Page';
import GalleryPage from '../components/Gallery/GalleryPage';
import {useLocaleBundle} from '../hooks/useTranslation';

const TRANSLATIONS = {
  'zh-CN': {
    title: '示例',
  },
  'en-US': {
    title: 'Gallery',
  },
};

export default function Gallery() {
  const t = useLocaleBundle(TRANSLATIONS);

  return (
    <Page
      toc={[]}
      routeTree={{title: t.title, path: '/gallery', routes: []}}
      meta={{title: t.title}}
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
