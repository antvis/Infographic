import {Page} from 'components/Layout/Page';
import {EditorContent} from 'components/LiveEditor';

export default function LiveEditorPage() {
  return (
    <Page
      toc={[]}
      routeTree={{title: 'Live Editor', path: '/editor', routes: []}}
      meta={{titleForTitleTag: 'Live Editor'}}
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
