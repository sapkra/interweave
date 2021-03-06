/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

// Our index re-exports TypeScript types, which Babel is unable to detect and omit.
// Because of this, Webpack and other bundlers attempt to import values that do not exist.
// To mitigate this issue, we need this module specific index file that manually exports.

const withEmojiData = require('./esm/withEmojiData').default;
const Emoji = require('./esm/Emoji').default;
const EmojiDataManager = require('./esm/EmojiDataManager').default;
const EmojiMatcher = require('./esm/EmojiMatcher').default;

withEmojiData.Emoji = Emoji;
withEmojiData.EmojiDataManager = EmojiDataManager;
withEmojiData.EmojiMatcher = EmojiMatcher;

module.exports = withEmojiData;
