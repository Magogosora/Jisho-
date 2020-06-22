/**
 * For every kanji in a box in the right sidebar add a link to 'Words containing KANJI'.
 */
function addWordsContainingKanjiLinks() {
    [...document.getElementsByClassName('kanji_light_content')].forEach(addWordsContainingKanjiLink);
}

/**
 * Add link with 'Words contaning KANJI' to the right sidebar.
 * 
 * @param {HTMLDivElement} kanjiDiv Contains a short description of a single kanji. 
 */
function addWordsContainingKanjiLink(kanjiDiv) {
    let kanji = kanjiDiv.childNodes[5].textContent.trim()
    let link = createLinkForWordsContainingKanji(kanji);
    kanjiDiv.nextSibling.nextSibling.after(link);
}

/**
 * Create a link allowing to search for words containing the given kanji.
 * 
 * @param {String} kanji A single kanji.
 */
function createLinkForWordsContainingKanji(kanji) {
    let href = '/search/*' + kanji + '*';
    let text = WORDS_CONTAINING_KANJI_EN + kanji
    let link = createLink(href, text)
    link.classList.add('light-details_link');
    return link;
}