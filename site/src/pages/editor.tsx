import {Page} from 'components/Layout/Page';
import {EditorContent} from 'components/LiveEditor';

export default function LiveEditorPage() {
  return (
    <Page
      toc={[]}
      routeTree={{title: 'Live Editor', path: '/editor', routes: []}}
      meta={{title: 'Live Editor - AntV Infographic'}}
      section="editor">
      <EditorContent />
    </Page>
  );
}
