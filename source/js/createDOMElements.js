/**
 * Create a link.
 * 
 * @param {String} href Address to some web page.
 * @param {String} text Text that is displayed on the link. 
 * @returns {HTMLLinkElement}
 */
function createLink(href, text) {
    let link = document.createElement('A');
    let textNode = document.createTextNode(text);
    if (href != '') {
        link.setAttribute('href', href);
    }
    link.appendChild(textNode);
    return link;
}

/**
 * Create a link to lookup link to wadoku for some word or query.
 * 
 * @param {String} word A Japanese word or sentence. Could be in German, theoretically.
 * @param {HTMLLinkElement}
 */
function createWadokuLink(word) {
    let href = 'https://www.wadoku.de/search/' + word;
    let text = 'Wadoku ▸';
    let link = createLink(href, text);
    link.classList.add('light-details_link');
    return link;
}

/**
 * Create a source for an audio file.
 * 
 * @param {String} url Address to audio file.
 * @param {String} type Data type such as 'audio/mpeg'. 
 */
function createSource(url, type) {
    let source = document.createElement('source');
    source.setAttribute('src', url);
    source.setAttribute('type', type);
    return source;
}

/**
 * Normally a tag precedes one or more translations in a dictionary entry and gives some general information (such as word type [noun etc.] or 
 * origin [wadoku etc.], for example).
 * 
 * @param {String} tagName Name of the tag.
 */
function createTagDiv(tagName) {
    let tag = document.createElement('DIV');
    let textnode = document.createTextNode(tagName);
    tag.classList.add('meaning-tags');
    tag.appendChild(textnode);
    return tag;
}

/**
 * Create a meaning block that contains the translations of a word.
 * 
 * @param {Number} meaningNumber The ordinal number that precedes the translation.
 * @param {String} text The translation of the japanese word.
 */
function createMeaningDiv(meaningNumber, text = '') {
    // Outer Container
    let meaningWrapper = document.createElement('DIV');
    meaningWrapper.classList.add('meaning-wrapper');

    // Inner container
    let definition = document.createElement('DIV');
    definition.classList.add('meaning-definition', 'zero-padding');
    meaningWrapper.appendChild(definition);

    // Divider
    let sectionDivider = document.createElement('SPAN');
    let ordinalNumber = meaningNumber + '. '
    var textnode = document.createTextNode(ordinalNumber);
    sectionDivider.classList.add('meaning-definition-section_divider');
    sectionDivider.appendChild(textnode);
    definition.appendChild(sectionDivider);

    // Meaning
    let meaning = document.createElement('SPAN');
    meaning.classList.add('meaning-meaning');
    definition.appendChild(meaning);
    var textnode = document.createTextNode(text);
    meaning.appendChild(textnode);

    return meaningWrapper;
}