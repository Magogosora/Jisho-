/**
 * Add a link to 'Kanji Details' above the 'Links' link.
 * 
 * @param {HTMLUListElement} linkList All links under 'Links' from the dictionary entry.
 */
function addKanjiDetailsLink(linkList) {
    let kanjiDetails = [...linkList.childNodes].filter(el => el.innerText.split(' ')[0] == 'Kanji')[0].lastChild;
    let link = createLink(kanjiDetails.href, KANJI_DETAILS);
    link.classList.add('concept_light-status_link')

    last_element = [...linkList.parentNode.getElementsByClassName('concept_light-status_link')]
        .filter(el => el.innerText == 'Links')[0]
    last_element.before(link);
}

/**
 * Add the link 'Search WORD' to the list that contains a variety of links such as 'Edit on JMdict'
 * 
 * @param {HTMLUListElement} linkList All links under 'Links' from the dictionary entry.
 * @param {String} word Japanese word.
 */
function addLinkForSearchingWord(linkList, word) {
    let item = document.createElement('LI');
    let href = '/search/' + word;
    let text = 'Search for ' + word;
    let link = createLink(href, text);
    item.appendChild(link);
    let kanjiDetails = [...linkList.childNodes].filter(el => el.innerText.split(' ')[0] == 'Kanji')[0];
    if (kanjiDetails) {
        kanjiDetails.before(item);
    }
    else if (linkList.lastChild.innerText.split(' ')[0] == 'Edit') {
        linkList.lastChild.before(item);
    }
    else {
        linkList.appendChild(item);
    }
}