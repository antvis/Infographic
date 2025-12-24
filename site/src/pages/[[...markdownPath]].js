import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import {useRouter} from 'next/router';
import {Fragment, useEffect, useMemo, useState} from 'react';
import compileMDX from 'utils/compileMDX';
import sidebarHome from '../sidebarHome.json';
import sidebarLearnEn from '../sidebarLearn.en.json';
import sidebarLearn from '../sidebarLearn.json';
import sidebarReferenceEn from '../sidebarReference.en.json';
import sidebarReference from '../sidebarReference.json';
import {getStoredLanguage} from '../utils/i18n';

export default function Layout({
  content,
  toc,
  meta,
  languages,
  contentEn,
  tocEn,
  metaEn,
}) {
  const [currentLang, setCurrentLang] = useState('zh-CN');

  useEffect(() => {
    const lang = getStoredLanguage();
    setCurrentLang(lang);
  }, []);

  const isEnglish = currentLang.toLowerCase().startsWith('en');

  // Select content based on current language
  const activeContent = isEnglish && contentEn ? contentEn : content;
  const activeToc = isEnglish && tocEn ? tocEn : toc;
  const activeMeta = isEnglish && metaEn ? metaEn : meta;

  const parsedContent = useMemo(
    () => JSON.parse(activeContent, reviveNodeOnClient),
    [activeContent]
  );
  const parsedToc = useMemo(
    () => JSON.parse(activeToc, reviveNodeOnClient),
    [activeToc]
  );
  const section = useActiveSection();
  let routeTree;
  switch (section) {
    case 'home':
    case 'unknown':
      routeTree = sidebarHome;
      break;
    case 'learn':
      routeTree = isEnglish ? sidebarLearnEn : sidebarLearn;
      break;
    case 'reference':
      routeTree = isEnglish ? sidebarReferenceEn : sidebarReference;
      break;
  }
  return (
    <Page
      toc={parsedToc}
      routeTree={routeTree}
      meta={activeMeta}
      section={section}
      languages={languages}>
      {parsedContent}
    </Page>
  );
}

function useActiveSection() {
  const {asPath} = useRouter();
  const cleanedPath = asPath.split(/[\?\#]/)[0];
  if (cleanedPath === '/') {
    return 'home';
  } else if (cleanedPath.startsWith('/reference')) {
    return 'reference';
  } else if (asPath.startsWith('/learn')) {
    return 'learn';
  } else {
    return 'unknown';
  }
}

// Deserialize a client React tree from JSON.
function reviveNodeOnClient(parentPropertyName, val) {
  if (Array.isArray(val) && val[0] == '$r') {
    // Assume it's a React element.
    let Type = val[1];
    let key = val[2];
    if (key == null) {
      key = parentPropertyName; // Index within a parent.
    }
    let props = val[3];
    if (Type === 'wrapper') {
      Type = Fragment;
      props = {children: props.children};
    }
    if (Type in MDXComponents) {
      Type = MDXComponents[Type];
    }
    if (!Type) {
      console.error('Unknown type: ' + Type);
      Type = Fragment;
    }
    return <Type key={key} {...props} />;
  } else {
    return val;
  }
}

// Put MDX output into JSON for client.
export async function getStaticProps(context) {
  const fs = require('fs');
  const rootDir = process.cwd() + '/src/content/';

  // Read MDX from the file.
  let path = (context.params.markdownPath || []).join('/') || 'index';

  // Try to load both Chinese and English versions
  let mdx, mdxEn;
  let hasEnglish = false;

  // Try Chinese version
  try {
    mdx = fs.readFileSync(rootDir + path + '.md', 'utf8');
  } catch {
    try {
      mdx = fs.readFileSync(rootDir + path + '/index.md', 'utf8');
    } catch (e) {
      throw new Error(`No Chinese markdown file found for path: ${path}`);
    }
  }

  // Try English version
  try {
    mdxEn = fs.readFileSync(rootDir + path + '.en.md', 'utf8');
    hasEnglish = true;
  } catch {
    try {
      mdxEn = fs.readFileSync(rootDir + path + '/index.en.md', 'utf8');
      hasEnglish = true;
    } catch (e) {
      // English version doesn't exist, use Chinese as fallback
      mdxEn = mdx;
    }
  }

  const {toc, content, meta, languages} = await compileMDX(mdx, path, {});

  let tocEn = toc;
  let contentEn = content;
  let metaEn = meta;

  if (hasEnglish) {
    const resultEn = await compileMDX(mdxEn, path, {});
    tocEn = resultEn.toc;
    contentEn = resultEn.content;
    metaEn = resultEn.meta;
  }

  return {
    props: {
      toc,
      content,
      meta,
      languages,
      tocEn,
      contentEn,
      metaEn,
    },
  };
}

// Collect all MDX files for static generation.
export async function getStaticPaths() {
  const {promisify} = require('util');
  const {resolve} = require('path');
  const fs = require('fs');
  const readdir = promisify(fs.readdir);
  const stat = promisify(fs.stat);
  const rootDir = process.cwd() + '/src/content';

  // Find all MD files recursively.
  async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(
      subdirs.map(async (subdir) => {
        const res = resolve(dir, subdir);
        return (await stat(res)).isDirectory()
          ? getFiles(res)
          : res.slice(rootDir.length + 1);
      })
    );
    return (
      files
        .flat()
        // ignores `errors/*.md`, they will be handled by `pages/errors/[errorCode].tsx`
        .filter((file) => file.endsWith('.md') && !file.startsWith('errors/'))
    );
  }

  // 'foo/bar/baz.md' -> ['foo', 'bar', 'baz']
  // 'foo/bar/qux/index.md' -> ['foo', 'bar', 'qux']
  function getSegments(file) {
    let segments = file.slice(0, -3).replace(/\\/g, '/').split('/');
    if (segments[segments.length - 1] === 'index') {
      segments.pop();
    }
    return segments;
  }

  const files = await getFiles(rootDir);

  const paths = files
    .filter((file) => {
      // Filter out English versions and files that have dedicated page components
      // to avoid path conflicts
      if (file.endsWith('.en.md')) {
        return false; // Don't create separate routes for English versions
      }
      const segments = getSegments(file);
      const path = segments.join('/');
      return path !== 'ai' && path !== 'examples';
    })
    .map((file) => ({
      params: {
        markdownPath: getSegments(file),
        // ^^^ CAREFUL HERE.
        // If you rename markdownPath, update patches/next-remote-watch.patch too.
        // Otherwise you'll break Fast Refresh for all MD files.
      },
    }));

  return {
    paths: paths,
    fallback: false,
  };
}
