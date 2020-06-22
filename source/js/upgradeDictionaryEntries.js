/**
 * Invoke upgrading process for all dictionary entries
 */
function upgradeDictionaryEntries() {
    let primary = document.getElementById('primary');
    let base = primary != null ? primary : document;
    [...base.getElementsByClassName('concept_light')].forEach(upgradeDictionaryEntry);
}

/**
 * Write translations from wadoku to a dictionary entry.
 * 
 * @param {JishoDictionaryEntry} JishoDictionaryEntry Representation of a dictionary entry from jisho.
 * @param {WadokuResults[]} translations.wadokuResultsDifferentKana Contains translations from wadoku to a searched word.
 */
function insertTranslationsFromWadoku(JishoDictionaryEntry, allWadokuResults) {
    let meaningsWrapper = JishoDictionaryEntry.meaningsWrapper;
    allWadokuResults.forEach(wadokuResults => {
        wadokuResults.translations.forEach(translation => {
            let meaningNumber = JishoDictionaryEntry.lastOrdinalInMeaningsWrapper() + 1;
            let newMeaning = createMeaningDiv(meaningNumber, translation);
            meaningsWrapper.appendChild(newMeaning);
        })
    });
}

/**
 * Add translations from wadoku to a dictionary entry on jisho.
 * 
 * @param {JishoDictionaryEntry} JishoDictionaryEntry Representation of a dictionary entry from jisho.
 * @param {WadokuResults} wadokuResults Contains the data extracted from a search on wadoku.
 */
function addTranslationsFromWadoku(JishoDictionaryEntry, wadokuResults) {
    let meaningsWrapper = JishoDictionaryEntry.meaningsWrapper;

    let tag = createTagDiv('Wadoku');
    meaningsWrapper.appendChild(tag);

    let wadokuResultsSameKana = wadokuResults.wadokuResultsSameKana;
    let wadokuResultsDifferentKana = wadokuResults.wadokuResultsDifferentKana;

    let allTranslationObjects = wadokuResultsSameKana.concat(wadokuResultsDifferentKana);
    insertTranslationsFromWadoku(JishoDictionaryEntry, allTranslationObjects);
    if (allTranslationObjects.length === 0) {
        meaningNumber = JishoDictionaryEntry.lastOrdinalInMeaningsWrapper() + 1;
        noEntryDiv = createMeaningDiv(meaningNumber, NO_ENTRY_ON_WADOKU);
        meaningsWrapper.appendChild(noEntryDiv);
    }
}

/**
 * Request data from external sources such as
 * japanesepod101 and forvo for audio,
 * wadoku and weblio for pitch accent numbers, and 
 * wadoku for German translations.
 * If available, write data to dictionary entry on jisho .
 * 
 * @param {JishoDictionaryEntry} JishoDictionaryEntry Representation of a dictionary entry from jisho.
 */
async function addExternalData(jishoDictionaryEntry) {
    try {
        let word = jishoDictionaryEntry.word;
        let reading = jishoDictionaryEntry.reading;
        let readingHiragana = jishoDictionaryEntry.readingHiragana;

        addAudio(jishoDictionaryEntry);
        // Get data from weblio as soon as possible since it takes some time for it to load.
        let weblioPromise = getWeblioPitchAccents(word, reading);
        let wadokuData = await searchWordOnWadoku(word, readingHiragana);
        let wadokuDataForSameKana = wadokuData.wadokuResultsSameKana;

        addTranslationsFromWadoku(jishoDictionaryEntry, wadokuData);

        let pitchAccents = await getWadokuPitchAccents(wadokuDataForSameKana);
        if (typeof pitchAccents !== 'undefined' && pitchAccents.length > 0) {
            addHatsuon(jishoDictionaryEntry, pitchAccents);
            return;
        }

        pitchAccents = await weblioPromise;
        if (typeof pitchAccents !== 'undefined' && pitchAccents.length > 0) {
            addHatsuon(jishoDictionaryEntry, pitchAccents);
            return;
        }

        if (word in pitchPatternTable) {
            addHatsuon(pitchPatternTable[word]);
            return;
        }
    } catch (error) {
        console.log('An error has occured:' + error);
    }
}

/**
 * Fetch translations and other data from wadoku.
 * 
 * @param {JishoDictionaryEntry} jishoDictionaryEntry Object that contains the dictionary entry.
 * @returns {Promise} Promise containing the parsed response from wadoku.
 */
async function searchWordOnWadoku(word, reading) {
    // Wadoku expects hiragana for readings
    let wadokuURL = 'https://www.wadoku.de/search/' + encodeURIComponent(word);
    return fetch(wadokuURL)
        .then(response => response.text())
        .then(responseText => {
            return parseWadokuResponse(responseText, word, reading);
        })
        .catch(error => console.log('An error has occured:' + error));
}

/**
 * Add additional information to dictionary entry on jisho. Remove unwanted data.
 * 
 * @param {HTMLElement} dictionaryEntryNode HTML element of class 'concept_light'. This corresponds to a dictionary entry on jisho.
 */
function upgradeDictionaryEntry(dictionaryEntryNode) {
    try {
        jishoDictionaryEntry = new JishoDictionaryEntry(dictionaryEntryNode);
        removeWaniKaniLinks(jishoDictionaryEntry);

        upgradeDictionaryEntryWhenVisible(jishoDictionaryEntry);

        let word = jishoDictionaryEntry.word;
        let linkList = jishoDictionaryEntry.node.getElementsByClassName('f-dropdown')[0];
        if (containsKanji(word)) {
            addKanjiDetailsLink(linkList);
        }
        addLinkForSearchingWord(linkList, word);

        let linkWadoku = createWadokuLink(word);
        jishoDictionaryEntry.node.appendChild(linkWadoku);
    } catch (error) {
        console.log('An error has occured:' + error);
    }
}

/**
 * As soon as dictionary entry enters the visible screen start the upgrading process with data from external sources. 
 * The upgrading process starts automatically when scrolling down.
 * 
 * @param {JishoDictionaryEntry} JishoDictionaryEntry Representation of a dictionary entry from jisho.
 */
function upgradeDictionaryEntryWhenVisible(jishoDictionaryEntry) {
    let observer;

    let options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.01,
    };

    observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                addExternalData(jishoDictionaryEntry);
                observer.unobserve(jishoDictionaryEntry.node);
            }
        });
    }, options);
    observer.observe(jishoDictionaryEntry.node);
}