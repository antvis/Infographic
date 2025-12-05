import {LanguageItem} from 'components/MDX/LanguagesContext';
import {MDXComponents} from 'components/MDX/MDXComponents';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~ IMPORTANT: BUMP THIS IF YOU CHANGE ANY CODE BELOW ~~~
const DISK_CACHE_BREAKER = 10;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default async function compileMDX(
  mdx: string,
  path: string | string[],
  params: {[key: string]: any}
): Promise<{content: string; toc: string; meta: any}> {
  const fs = require('fs');
  const {
    prepareMDX,
    PREPARE_MDX_CACHE_BREAKER,
  } = require('../utils/prepareMDX');
  const mdxComponentNames = Object.keys(MDXComponents);

  // 检测并读取 lock 文件
  function getLockfileContent() {
    const cwd = process.cwd();
    const lockfiles = [
      {name: 'pnpm-lock.yaml', path: cwd + '/pnpm-lock.yaml'},
      {name: 'yarn.lock', path: cwd + '/yarn.lock'},
      {name: 'package-lock.json', path: cwd + '/package-lock.json'},
    ];

    for (const lockfile of lockfiles) {
      try {
        if (fs.existsSync(lockfile.path)) {
          return fs.readFileSync(lockfile.path, 'utf8');
        }
      } catch (err) {
        // 继续尝试下一个
      }
    }

    console.warn('警告：未找到任何 lock 文件，缓存可能不稳定');
    return '';
  }

  // Normalize custom heading anchor syntax before caching.
  mdx = normalizeHeadingAnchors(mdx);

  // See if we have a cached output first.
  const {FileStore, stableHash} = require('metro-cache');
  const store = new FileStore({
    root: process.cwd() + '/node_modules/.cache/react-docs-mdx/',
  });
  const hash = Buffer.from(
    stableHash({
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ~~~~ IMPORTANT: Everything that the code below may rely on.
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      mdx,
      ...params,
      mdxComponentNames,
      DISK_CACHE_BREAKER,
      PREPARE_MDX_CACHE_BREAKER,
      lockfile: getLockfileContent(),
    })
  );
  const cached = await store.get(hash);
  if (cached) {
    console.log(
      'Reading compiled MDX for /' + path + ' from ./node_modules/.cache/'
    );
    return cached;
  }
  if (process.env.NODE_ENV === 'production') {
    console.log(
      'Cache miss for MDX for /' + path + ' from ./node_modules/.cache/'
    );
  }

  // If we don't add these fake imports, the MDX compiler
  // will insert a bunch of opaque components we can't introspect.
  // This will break the prepareMDX() call below.
  let mdxWithFakeImports =
    mdx +
    '\n\n' +
    mdxComponentNames
      .map((key) => 'import ' + key + ' from "' + key + '";\n')
      .join('\n');

  // Turn the MDX we just read into some JS we can execute.
  const {getRemarkPlugins} = require('../../plugins/markdownToHtml');
  const {compile: compileMdx} = await import('@mdx-js/mdx');
  const visit = (await import('unist-util-visit')).default;
  const remarkPlugins = await getRemarkPlugins();
  const jsxCode = await compileMdx(mdxWithFakeImports, {
    remarkPlugins: [
      ...remarkPlugins,
      (await import('remark-gfm')).default,
      (await import('remark-frontmatter')).default,
    ],
    rehypePlugins: [
      // Support stuff like ```js App.js {1-5} active by passing it through.
      function rehypeMetaAsAttributes() {
        return (tree) => {
          visit(tree, 'element', (node) => {
            if (
              // @ts-expect-error -- tagName is a valid property
              node.tagName === 'code' &&
              node.data &&
              node.data.meta
            ) {
              // @ts-expect-error -- properties is a valid property
              node.properties.meta = node.data.meta;
            }
          });
        };
      },
    ],
  });
  const {transform} = require('@babel/core');
  const jsCode = await transform(jsxCode, {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    presets: ['@babel/preset-react'],
  }).code;

  // Prepare environment for MDX.
  let fakeExports = {};
  const fakeRequire = (name: string) => {
    if (name === 'react/jsx-runtime') {
      return require('react/jsx-runtime');
    } else if (name === 'react/jsx-dev-runtime') {
      return require('react/jsx-dev-runtime');
    } else {
      // For each fake MDX import, give back the string component name.
      // It will get serialized later.
      return name;
    }
  };
  const evalJSCode = new Function('require', 'exports', jsCode);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // THIS IS A BUILD-TIME EVAL. NEVER DO THIS WITH UNTRUSTED MDX (LIKE FROM CMS)!!!
  // In this case it's okay because anyone who can edit our MDX can also edit this file.
  evalJSCode(fakeRequire, fakeExports);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // @ts-expect-error -- default exports is existed after eval
  const reactTree = fakeExports.default({});

  // Pre-process MDX output and serialize it.
  let {toc, children} = prepareMDX(reactTree.props.children);
  if (path === 'index') {
    toc = [];
  }

  // Parse Frontmatter headers from MDX.
  const fm = require('gray-matter');
  const meta = fm(mdx).data;

  // Load the list of translated languages conditionally.
  let languages: Array<LanguageItem> | null = null;
  if (typeof path === 'string' && path.endsWith('/translations')) {
    languages = await (
      await fetch(
        'https://raw.githubusercontent.com/reactjs/translations.react.dev/main/langs/langs.json'
      )
    ).json(); // { code: string; name: string; enName: string}[]
  }

  const output = {
    content: JSON.stringify(children, stringifyNodeOnServer),
    toc: JSON.stringify(toc, stringifyNodeOnServer),
    meta,
    languages,
  };

  // Serialize a server React tree node to JSON.
  function stringifyNodeOnServer(key: unknown, val: any) {
    if (
      val != null &&
      val.$$typeof === Symbol.for('react.transitional.element')
    ) {
      // Remove fake MDX props.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {mdxType, originalType, parentName, ...cleanProps} = val.props;
      return [
        '$r',
        typeof val.type === 'string' ? val.type : mdxType,
        val.key,
        cleanProps,
      ];
    } else {
      return val;
    }
  }

  // Cache it on the disk.
  await store.set(hash, output);
  return output;

  function normalizeHeadingAnchors(source: string): string {
    const lines = source.split('\n');
    let inFence = false;
    let fenceMarker = '';
    let fenceLength = 0;
    return lines
      .map((line) => {
        const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
        if (fenceMatch) {
          const markerChar = fenceMatch[2][0];
          if (!inFence) {
            inFence = true;
            fenceMarker = markerChar;
            fenceLength = fenceMatch[2].length;
          } else if (
            markerChar === fenceMarker &&
            fenceMatch[2].length >= fenceLength
          ) {
            inFence = false;
          }
          return line;
        }
        if (inFence) {
          return line;
        }
        const headingMatch = line.match(
          /^(\s{0,3}(?:>\s*)*#{1,6}.*?)(\s*\{#([^\}\s]+)\})\s*$/
        );
        if (!headingMatch) {
          return line;
        }
        const prefix = headingMatch[1].replace(/\s+$/, '');
        const id = headingMatch[3].trim();
        return `${prefix} {/*${id}*/}`;
      })
      .join('\n');
  }
}
