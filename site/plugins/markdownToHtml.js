const customHeaders = require('./remark-header-custom-ids'); // Custom header id's for i18n
const smartyPants = require('./remark-smartypants'); // Cleans up typography

let cachedTooling;

async function loadRemarkTooling() {
  if (!cachedTooling) {
    cachedTooling = (async () => {
      const [
        {remark},
        {default: externalLinks},
        {default: images},
        {default: unrwapImages},
        {default: remarkRehype},
        {default: rehypeStringify},
      ] = await Promise.all([
        import('remark'),
        import('remark-external-links'),
        import('remark-images'),
        import('remark-unwrap-images'),
        import('remark-rehype'),
        import('rehype-stringify'),
      ]);

      return {
        remark,
        remarkRehype,
        rehypeStringify,
        remarkPlugins: [
          externalLinks,
          customHeaders,
          images,
          unrwapImages,
          smartyPants,
        ],
      };
    })();
  }

  return cachedTooling;
}

module.exports = {
  getRemarkPlugins,
  markdownToHtml,
};

async function markdownToHtml(markdown) {
  const {remark, remarkRehype, rehypeStringify, remarkPlugins} =
    await loadRemarkTooling();
  const processor = remark();
  for (const plugin of remarkPlugins) {
    processor.use(plugin);
  }
  const result = await processor
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}

async function getRemarkPlugins() {
  const {remarkPlugins} = await loadRemarkTooling();
  return remarkPlugins;
}
