/**
 * Contains the results from a search on wadoku.
 * 
 * @param {String} word Japanese word.
 * @param {String} reading Reading of the word in kana.
 * @param {String} detailsLinkWadoku Link to wadoku page that contains the word's pitch accent and other details.
 * @return {WadokuResults} Object that contains the input data. Translations still have to be inserted.
 */
function wadokuResults(word = '', reading = '', detailsLinkWadoku = '') {
    return {
        word,
        reading,
        translations: [],
        detailsLinkWadoku,
    };
}

/**
 * Parse response from search on wadoku and extract the relevant data such as words, readings, translations and links to details.
 * 
 * @param {String} wadokuResponseText Response from wadoku in text form.
 * @param {String} word Japanese word.
 * @param {String} readingHiragana Reading of japanese word in hiragana.
 * @returns {SplittedWadokuResults} Results from wadoku.
 */
function parseWadokuResponse(wadokuResponseText = '', word = '', readingHiragana = '') {
    let parser = new DOMParser();
    let wadokuDocument = parser.parseFromString(wadokuResponseText, "text/html");
    let reading = readingHiragana;

    let wadokuResultsDifferentKana = [];
    let wadokuResultsSameKana = [];

    let bound = 5; // Usually only the first five entries are relevant.
    for (let k = 0; k < bound; k++) {
        let wadokuAllWords = getWordWadoku(wadokuDocument, k);
        if (typeof wadokuAllWords === 'undefined' || wadokuAllWords === null) {
            break;
        }
        let wadokuKana = getHiraganaWadoku(wadokuDocument, k);
        if (typeof wadokuKana === 'undefined' || wadokuKana === null) {
            break;
        }

        // console.log("jisho word: " + wordJisho + " - wadoku word: " + allWordsWadoku);
        // console.log("jisho kana: " + kanaJisho + " - wadoku kana: " + kanaWadoku);

        let isWadokuWordRelevant = false;
        let isAddKana = true;
        let isNaAdj = false;

        if (isHiragana(word) && !wadokuAllWords.includes(word)) { // から
            continue;
        }

        // First condition addresses ダブる.
        // Second condition addresses キャンピング etc (pure katakana words).
        if (reading === null || isKatakana(word)) {
            reading = katakanaToHiragana(word);
        }

        if (wadokuAllWords.includes(word)) {
            isWadokuWordRelevant = true;
        }
        if (wadokuKana == reading) { // Necessary due to 晩御飯　vs 晩ご飯.
            isWadokuWordRelevant = true;
            isAddKana = false;
        }
        if (isHiragana(word)) {
            isAddKana = false;
        }
        if (reading + "な" == wadokuKana) {
            isWadokuWordRelevant = true;
            isAddKana = false;
            isNaAdj = true;
        }

        if (isWadokuWordRelevant == false) {
            continue;
        }
        else {
            bound++;
        }

        let detailsURI = getDetailsLinkWadoku(wadokuDocument, k);
        let detailsLinkWadoku = '';
        if (typeof detailsURI !== 'undefined' && detailsURI !== null) {
            detailsLinkWadoku = 'https://www.wadoku.de/' + encodeURIComponent(detailsURI);
        }

        let senses = wadokuDocument.getElementsByClassName("senses")[k];
        cleanSensesElementWadokuDocument(senses);
        let allTranslations = [...senses.getElementsByClassName("sense")];
        let translationObj = wadokuResults(word, wadokuKana, detailsLinkWadoku)

        allTranslations.forEach(translation => {
            cleanWadokuTranslatios(translation);
            let translationText = translation.innerText.replace(/\s+\./g, '.');
            if (isAddKana == true) {
                translationText = "｢" + wadokuKana + "」" + translationText;
            } else if (isNaAdj == true) {
                translationText = "(な-Adj) " + translationText;
            }
            translationObj.translations.push(translationText);
        });

        if (isAddKana == true || isNaAdj == true) {
            wadokuResultsDifferentKana.push(translationObj);
        }
        else {
            wadokuResultsSameKana.push(translationObj);
        }
    }
    return { wadokuResultsDifferentKana, wadokuResultsSameKana };
}

/**
 * Get link to wadoku page containing details to some word.
 * 
 * @param {HTMLElement} wadokuDocument HTML page of wadoku containing the search results.
 * @param {Number} number Corresponds to the row in the table of the search results on wadoku.
 * @returns {String} Link to wadoku page that contains details to a word.
 */
function getDetailsLinkWadoku(wadokuDocument, number) {
    let div = wadokuDocument.querySelectorAll('div.japanese');
    if (div.length > 0 && typeof div[number] !== 'undefined') {
        let a = div[number].querySelector('a');
        if (typeof a !== 'undefined') {
            return a.getAttribute('href');
        }
    }
    return null;
}

/**
 * Get all words of n-th dictionary entry on wadoku.
 * 
 * @param {HTMLElement} [wadokuDocument = null] HTML page of wadoku containing the search results.
 * @param {Number} [number = -1] Corresponds to the number'th row in the table of the search results on wadoku.
 * @returns {String[]} All words from number-th dictionary entry on wadoku.
 */
function getWordWadoku(wadokuDocument = null, number = -1) {
    let div = wadokuDocument.querySelectorAll('div.japanese');
    if (div.length > 0 && typeof div[number] !== 'undefined') {
        removeHiddenElements(div[number]);
        return div[number].innerText.replace(CLEAN_WADOKU, '').split('；');
    }
    return null;
}

/**
 * Get reading in hiragana of n-th dictionary entry on wadoku.
 * 
 * @param {HTMLElement} [wadokuDocument = null] HTML page of wadoku containing the search results.
 * @param {Number} [number = -1] Corresponds to the number'th row in the table of the search results on wadoku.
 * @returns {String} Reading in hiragana.
 */
function getHiraganaWadoku(wadokuDocument = null, number = -1) {
    let div = wadokuDocument.querySelectorAll('div.reading');
    if (div.length > 0 && typeof div[number] !== 'undefined') {
        removeHiddenElements(div[number]);
        return div[number].innerText.replace(CLEAN_WADOKU, '');
    }
    return null;
}

/**
 * Remove elements with class 'hidden' in subtree of root.
 * 
 * @param {HTMLElement} [root = null] Any HTML element. 
 */
function removeHiddenElements(root = null) {
    [...root.getElementsByTagName("*")].forEach(element => {
        if (element.classList.contains('hidden')) {
            removeElement(element);
        }
    })
}

/**
 * Remove elements with certain classes in subtree of root. 
 * Moreover remove unwanted classes from elements in subtree of root.
 * 
 * @param {HTMLElement} [root = null] Any HTML element.
 */
function cleanWadokuTranslatios(root = null) {
    // Remove certain classes before modifying
    [...root.getElementsByTagName('*')].forEach(element => {
        if (DELETE_WADOKU_CLASSES.some(kill => element.classList.contains(kill))) {
            removeElement(element);
        }
    });

    // Remove unwanted class names
    [...root.getElementsByTagName('*')].forEach(element => {
        if (element.classList.contains('syn')) {
            let textNode = document.createTextNode('⇒'); // ⇒ → ⟶  → ≈
            element.firstChild.before(textNode);
        }
        if (element.classList.contains('anto')) {
            let textNode = document.createTextNode('⇔'); // ⇔ ↔  ↔ ⤧ ⤨ ⤄ ¬
            element.firstChild.before(textNode);
        }
        if (!ALLOWED_WADOKU_CLASSES.some(value => element.classList.contains(value))) {
            element.className = '';
        }
    });

    root.innerText = root.innerText.replace(CLEAN_WADOKU_LEAVE_SPACES, '').trim();
}

/**
 * Delete class names from all elements in subtree of root with class 'master'
 * 
 * @param {HTMLElement} root Any HTML element. 
 */
function cleanSensesElementWadokuDocument(root) {
    [...root.getElementsByTagName('*')].forEach(ele => {
        if (ele.classList.contains('master')) {
            ele.className = '';
        }
    });
}

/**
 * Parse the reponse from wadoku and extract pitch accent number(s) from page with details.
 * 
 * @param {String} wadokuResponse Response from wadoku in text form.
 * @returns {Number[]} Pitch accents from wadoku.
 */
function parseWadokuDetailsPage(wadokuResponse) {
    let parser = new DOMParser();
    let wadokuDocument = parser.parseFromString(wadokuResponse, "text/html");
    let pitchCollection = wadokuDocument.getElementsByClassName('accents');
    if (pitchCollection.length > 0) { // multiple pitches example: 映画
        let multiplePitches = pitchCollection[0].getElementsByClassName('accent');
        return [...multiplePitches].map(pitch => parseInt(pitch.innerText));
    }
    return [];
}