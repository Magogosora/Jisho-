/**
 * Add pitch diagrams to dictionary entry on jisho.
 * 
 * @param {JishoDictionaryEntry} jishoDictionaryEntry Dictionary entry from jisho.
 * @param {Number[]} pitchAccentNumbers Pitch accent numbers.
 */
function addHatsuon(jishoDictionaryEntry, pitchAccentNumbers = null) {
    if (pitchAccentNumbers === null) {
        return null;
    }
    if (jishoDictionaryEntry.hasPitchAccentDiagram()) {
        return null;
    }
    let firstPitchAccentNumber = pitchAccentNumbers[0]

    let arguments = {
        reading: jishoDictionaryEntry.reading, // Add option Katakana/Hiragana.
        pitchNum: firstPitchAccentNumber,
        locale: 'EN'
    };
    let hatsuonData = hatsuon(arguments);
    let diagram = drawPitchDiagram(hatsuonData);
    if (diagram === null) {
        return null;
    }

    fixWidth(jishoDictionaryEntry, diagram);

    let left = jishoDictionaryEntry.node.getElementsByClassName('concept_light-representation')[0];
    left.parentNode.after(diagram);
}

/**
 * If the diagram is too big it will be shifted above the translations, as it is the case for long Japanese words.
 * 
 * @param {JishoDictionaryEntry} jishoDictionaryEntry 
 * @param {HTMLDivElement} diagram Pitch accent diagram.
 */
function fixWidth(jishoDictionaryEntry, diagram) {
    let conceptLightWrapper = jishoDictionaryEntry.node.getElementsByClassName('concept_light-wrapper')[0];
    let conceptLightWrapperWidth = conceptLightWrapper.getBoundingClientRect().width;
    let pitchDiagramWidth = parseInt(diagram.style.width);

    if (conceptLightWrapperWidth < pitchDiagramWidth) {
        conceptLightWrapper.classList.add('concept_light-long_representation');
        let conceptLightStatus = jishoDictionaryEntry.node.getElementsByClassName('concept_light-status')[0];
        conceptLightStatus.classList.add('medium-3', 'columns', 'zero-padding');
        let conceptLightMeanings = jishoDictionaryEntry.node.getElementsByClassName('concept_light-meanings')[0];

        conceptLightMeanings.before(conceptLightStatus);
    }
}

/**
 * Fetch pitch accent number(s) from wadoku.
 * 
 * @param {WadokuResults[]} wadokuResultsSameKana All results from wadoku that have the same reading as the searched word.
 * @returns {Promise}
 */
async function getWadokuPitchAccents(wadokuResultsSameKana) {
    let promises = [...wadokuResultsSameKana].map(obj => fetch(obj.detailsLinkWadoku));
    return Promise.all(promises)
        .then(allResponses => Promise.all(allResponses.map(response => response.text())))
        .then(responseTexts => {
            let pitchAccents = [];
            for (text of responseTexts) {
                let pitchAccentsFromSingleEntry = parseWadokuDetailsPage(text);
                if (pitchAccentsFromSingleEntry != null) {
                    pitchAccents.push(...pitchAccentsFromSingleEntry)
                }
            }
            return pitchAccents;
        })
        .catch(error => console.log('An error has occured:' + error));
}

/**
 * Fetch pitch accent number(s) from weblio.
 * 
 * @param {String} word Japanese word.
 * @param {String} reading Reading of the Japanese word.
 * @returns {Promise}
 */
async function getWeblioPitchAccents(word, reading) {
    let weblioBaseURL = 'https://www.weblio.jp/content/';
    let weblioURL = weblioBaseURL + encodeURI(word);
    let headers = new Headers({
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0'
    });
    return fetch(weblioURL, {
        headers: headers
    })
        .then(response => response.text())
        .then(text => {
            return parseWeblioResponse(text, word, reading);
        })
        .catch(error => console.log('An error has occured:' + error));
}