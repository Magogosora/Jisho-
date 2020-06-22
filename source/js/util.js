/**
 * Test if input contains kanji. Returns true if the input contains a [kanji] (https://en.wikipedia.org/wiki/Kanji).
 * 
 * @param {String} input Any string. 
 * @returns {Boolean}
 */
function containsKanji(input = '') {
    if (isEmpty(input)) {
        return false;
    }
    return [...input].some(isCharKanji);
}

/**
 * Returns a new string replacing katakana by the corresponding hiragana. 
 * 
 * @param {String} input Any string.
 * @returns {String}
 */
function katakanaToHiragana(input = '') {
    if (isEmpty(input)) {
        return false;
    }
    return [...input].map(char =>
        (isCharKatakana(char) && !isCharLongDash(char))
            ? (String.fromCharCode(char.charCodeAt(0) - HIRA_KATA_DIF))
            : char
    ).join('');
}

/**
 * Returns the number of digraphs in a Japanese word.
 * 
 * @param {String} reading Reading of Japanese word.
 * @returns {Number}
 */
function countDigraphs(reading = '') {
    var kana = reading.split('');
    return kana.reduce((accumulator, currentValue) =>
        isDigraph(currentValue) ? (accumulator > 0 ? accumulator : 0) + 1 : (accumulator > 0 ? accumulator : 0));
}

/**
 * Remove any number of elements from the DOM tree.
 * 
 * @param  {...any} args 
 */
function removeElement(...args) {
    [...args].forEach(element => {
        if (typeof element !== 'undefined') {
            return element.parentNode.removeChild(element);
        }
    })
}

