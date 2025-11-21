const toString = require('mdast-util-to-string');
const visit = require('unist-util-visit');
const toSlug = require('github-slugger').slug;

function patch(context, key, value) {
  if (!context[key]) {
    context[key] = value;
  }
  return context[key];
}

const svgIcon = `<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`;

module.exports = ({icon = svgIcon, className = `anchor`} = {}) => {
  return function transformer(tree) {
    const ids = new Set();
    visit(tree, 'heading', (node) => {
      let id;
      let customSyntax = null;
      const lastIndex = node.children.length - 1;
      if (lastIndex >= 0) {
        const lastChild = node.children[lastIndex];
        if (lastChild.type === 'mdxTextExpression') {
          // # My header {/*my-header*/}
          const expression = lastChild.value;
          const isValidCustomId =
            expression.startsWith('/*') && expression.endsWith('*/');
          if (!isValidCustomId) {
            throw Error(
              'Expected header ID to be like: {/*some-header*/}. ' +
                'Instead, received: ' +
                expression
            );
          }
          id = expression.slice(2, expression.length - 2);
          customSyntax = 'mdx';
        } else if (lastChild.type === 'text') {
          // # My header {#my-header}
          const match = /\s*\{#([^}]+)\}\s*$/.exec(lastChild.value);
          if (match) {
            id = match[1].trim();
            customSyntax = 'text';
            const textWithoutId = lastChild.value
              .slice(0, match.index)
              .replace(/\s+$/, '');
            if (textWithoutId) {
              lastChild.value = textWithoutId;
            } else {
              node.children.pop();
            }
          }
        }
      }
      if (id) {
        const slug = toSlug(id);
        if (id !== slug) {
          const syntaxHint =
            customSyntax === 'mdx' ? '{/*' + id + '*/}' : '{#' + id + '}';
          throw Error(
            'Expected header ID to be a valid slug. You specified: ' +
              syntaxHint +
              '. Replace it with: ' +
              syntaxHint.replace(id, slug)
          );
        }
      }
      if (!id) {
        // # My header
        id = toSlug(toString(node));
      }

      if (ids.has(id)) {
        throw Error(
          'Cannot have a duplicate header with id "' +
            id +
            '" on the page. ' +
            'Rename the section or give it an explicit unique ID. ' +
            'For example: #### Arguments {#setstate-arguments}'
        );
      }
      ids.add(id);

      const data = patch(node, 'data', {});
      patch(data, 'id', id);
      patch(data, 'htmlAttributes', {});
      patch(data, 'hProperties', {});
      patch(data.htmlAttributes, 'id', id);
      patch(data.hProperties, 'id', id);
    });
  };
};
