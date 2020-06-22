/**
 * Contains the data extracted from a search on wadoku.
 * The data contained in the object is the searched word, its reading, and a link to a page containing further details.
 *
 * @typedef {Object} WadokuResults
 * @property {String} word Japanese word.
 * @property {String} reading Reading of the word in kana.
 * @property {String[]} translations Contains the translations from wadoku.
 * @property {String} detailsLinkWadoku Link to wadoku page that contains the word's pitch accent and other details.
 */

/**
* Contains pitch accent information.
*
* @typedef {Object} Hatsuon
* @property {String} reading
* @property {String[]} morae
* @property {Number} pitchNum
* @property {Number[]} pattern
* @property {String} patternName
*/

/**
* Contains results from wadoku where the searched word's kana do not match the kana of the result's word and also contains
* results where the kana match.
*
* @typedef {Object} SplittedWadokuResults
* @property {WadokuResults} wadokuResultsDifferentKana Results from wadoku that do not share the same reading the word from jisho.
* @property {WadokuResults} wadokuResultsSameKana Results from wadoku that share the same reading with the word from jisho.
*/

/**
 * Cointains an audio element and a string.
 *
 * @typedef {Object} AudioData
 * @property {HTMLAudioElement} audioElement
 * @property {String} text
 */