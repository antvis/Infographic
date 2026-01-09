const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');
const globby = require('globby');

const CONTENT_DIR = path.join(__dirname, '../src/content');
const OUTPUT_DIR = path.join(__dirname, '../out');

const PAGES_DIR = path.join(__dirname, '../src/pages');

async function generate() {
  // 1. Process Markdown files
  const patterns = ['**/*.en.md', '**/*.en.mdx'];
  const files = await globby(patterns, {cwd: CONTENT_DIR});

  let llmsFull = '';
  let llms = '# Documentation Index\n\n';
  const seenUrls = new Set();

  // Sort files for consistent order
  files.sort();

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = await fs.readFile(filePath, 'utf8');
    const {data, content: body} = matter(content);

    const title = data.title || file;
    const description = data.description || '';

    // Clean URL path
    // Remove extension (.en.md or .en.mdx)
    let urlPath = file.replace(/\.en\.mdx?$/, '');
    // Remove "index" at the end (e.g. foo/index -> foo, or index -> /)
    if (urlPath === 'index' || urlPath.endsWith('/index')) {
      urlPath = urlPath.replace(/\/index$/, '').replace(/^index$/, '');
    }
    // Ensure root slash if empty (though usually we want relative or absolute paths, let's keep it clean)
    if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;

    seenUrls.add(urlPath);

    llms += `- [${title}](${urlPath}) ${
      description ? '- ' + description : ''
    }\n`;

    // Append to llms-full.txt
    llmsFull += `\n\n# ${title}\n\n`;
    llmsFull += `> File: ${file}\n\n`;
    llmsFull += body;
    llmsFull += '\n\n---\n';
  }

  // 2. Process Page files
  // Scan for pages, ignoring api, _*, and dynamic routes with brackets [ ]
  const pageFiles = await globby(['**/*.tsx'], {
    cwd: PAGES_DIR,
    ignore: ['_*', 'api/**', '**/*\\[*'],
  });
  pageFiles.sort();

  for (const file of pageFiles) {
    const filePath = path.join(PAGES_DIR, file);
    const content = await fs.readFile(filePath, 'utf8');

    // Try to extract title from meta={{title: '...'}}
    const titleMatch = content.match(
      /meta=\{\{.*?title:\s*['"]([^'"]+)['"].*?\}\}/s
    );
    let title = titleMatch
      ? titleMatch[1]
      : path.basename(file, path.extname(file));
    // Capitalize if fallback
    if (!titleMatch && title !== 'index') {
      title = title.charAt(0).toUpperCase() + title.slice(1);
    } else if (title === 'index') {
      // For index files, try to use dirname as title if no meta
      const dir = path.dirname(file);
      if (dir !== '.') {
        title = dir.charAt(0).toUpperCase() + dir.slice(1);
      } else {
        title = 'Home';
      }
    }

    let urlPath = file.replace(/\.tsx$/, '');
    // Remove "index" at the end (e.g. foo/index -> foo)
    if (urlPath === 'index' || urlPath.endsWith('/index')) {
      urlPath = urlPath.replace(/\/index$/, '').replace(/^index$/, '');
    }
    // Ensure properly formatted path
    if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;

    // Avoid duplicates if markdown already covered it (unlikely for pages dir vs content dir overlap unless mapped)
    // But check if path already in llms (simple check)
    if (seenUrls.has(urlPath)) continue;

    llms += `- [${title}](${urlPath})\n`;
  }

  // Write files
  await fs.mkdir(OUTPUT_DIR, {recursive: true});
  await fs.writeFile(path.join(OUTPUT_DIR, 'llms.txt'), llms);
  await fs.writeFile(path.join(OUTPUT_DIR, 'llms-full.txt'), llmsFull);

  console.log(
    `Successfully generated llms.txt and llms-full.txt in ${OUTPUT_DIR}`
  );
}

generate().catch(console.error);
