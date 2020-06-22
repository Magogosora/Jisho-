/**
 * Wrap audio element and text into an object.
 * 
 * @param {HTMLAudioElement} audioElement Audio element.
 * @param {String} text Text displayed on link to audio.
 * @returns {AudioData} Audio data containing an audio element and text that is to be displayed on a play button.
 */
function audioData(audioElement, text) {
    return { audioElement, text };
}

/**
 * Adds audio from japanesepod101 if available otherwise from forvo if available to dictionary entry on jisho.
 * 
 * @param {JishoDictionaryEntry} jishoDictionaryEntry Dictionary entry on jisho.
 * @returns {void}
 */
async function addAudio(jishoDictionaryEntry) {
    if (jishoDictionaryEntry.hasAudio() === true) {
        return;
    }

    let word = jishoDictionaryEntry.word;
    let reading = jishoDictionaryEntry.reading;

    let japanesepodPromise = getJapanesePodAudio(word, reading);
    let forvoPromise = getForvoAudio(word);

    try {
        let data = await japanesepodPromise;
        if (data !== null) {
            insertAudio(jishoDictionaryEntry, data);
            return;
        }

        data = await forvoPromise;
        if (data !== null) {
            insertAudio(jishoDictionaryEntry, data);
            return;
        }
    }
    catch (error) {
        console.log('An error has occured:' + error);
    }
}

/**
 * Inserts audio into dictionary entry on jisho.
 * 
 * @param {JishoDictionaryEntry} jishoDictionaryEntry 
 * @param {AudioData} audioData 
 * @returns {void}
 */
function insertAudio(jishoDictionaryEntry, audioData) {
    let link = createLink('', audioData.text);
    link.classList.add('concept_audio', 'concept_light-status_link');
    link.addEventListener('click', function () {
        audioData.audioElement.play();
    })
    jishoDictionaryEntry.node.getElementsByClassName('concept_light-status_link')[0].before(audioData.audioElement);
    jishoDictionaryEntry.node.getElementsByClassName('concept_light-status_link')[0].before(link);
}

/**
 * Fetches audio data from forvo.
 * 
 * @param {String} word Japanese word.
 * @returns {Promise<?AudioData>} Object containing an audio element and text for a play button. 
 */
async function getForvoAudio(word) {
    let forvoURL = 'https://forvo.com/search/' + encodeURIComponent(word) + '/ja';
    return fetch(forvoURL)
        .then(response => response.text())
        .then(responseText => {
            let audioElement = parseForvoResponse(responseText);
            if (audioElement === null) {
                return null;
            }
            return audioData(audioElement, PLAY_AUDIO_TEXT_FORVO);
        })
        .catch(error => console.log('An error has occured:' + error));
}

/**
 * Fetches audio data from japanesepod101.
 * 
 * @param {String} word Japanese word.
 * @param {String} reading Reading of japanese word.
 * @returns {Promise<?AudioData>} Object containing an audio element and text for a play button. 
 */
async function getJapanesePodAudio(word, reading) {
    let kanaQuery = 'kana=' + reading
    let kanjiQuery = '&kanji=' + word
    let encodedURI = encodeURI(kanaQuery)
    if (!isKatakana(word) && !isKatakana(reading)) {
        encodedURI += encodeURI(kanjiQuery)
    }
    let japanesepodURL = 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?' + encodedURI;
    return fetch(japanesepodURL)
        .then(response => {
            if (response.headers.get('content-length') == AUDIO_NOT_AVAILABLE_JAPANESEPOD_CONTENT_LENGTH) {
                return null;
            }
            let audioElement = document.createElement('audio');
            let source = createSource(japanesepodURL, 'audio/mpeg');
            audioElement.appendChild(source);
            return audioData(audioElement, PLAY_AUDIO_TEXT_JAPANESEPOD);
        })
        .catch(error => console.log('An error has occured:' + error));
}