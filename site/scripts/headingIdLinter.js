const validateHeaderIds = require('./headingIDHelpers/validateHeadingIDs');
const generateHeadingIds = require('./headingIDHelpers/generateHeadingIDs');

const markdownPaths = process.argv.slice(2);
if (markdownPaths.includes('--fix')) {
  generateHeadingIds(markdownPaths.filter((path) => path !== '--fix'));
} else {
  validateHeaderIds(markdownPaths);
}
