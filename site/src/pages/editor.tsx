import {Page} from 'components/Layout/Page';
import {EditorContent} from 'components/LiveEditor';
import {useLocaleBundle} from '../hooks/useTranslation';

const TRANSLATIONS = {
  'zh-CN': {
    title: '编辑器',
  },
  'en-US': {
    title: 'Live Editor',
  },
};

export default function LiveEditorPage() {
  const t = useLocaleBundle(TRANSLATIONS);

  return (
    <Page
      toc={[]}
      routeTree={{title: t.title, path: '/editor', routes: []}}
      meta={{titleForTitleTag: t.title}}
      topNavOptions={{
        hideBrandWhenHeroVisible: true,
        overlayOnHome: true,
        heroAnchorId: 'editor-hero-anchor',
      }}
      showTitle={false}
      showSidebar={false}
      section="editor">
      <EditorContent />
    </Page>
  );
}
