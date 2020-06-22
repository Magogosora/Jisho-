/** Class representing a dictionary entry on jisho. */
class JishoDictionaryEntry {
    constructor(dictionaryEntry) {
        this.node = dictionaryEntry;
        this.word = this.readWord();
        this.reading = this.readReading();
        this.readingHiragana = katakanaToHiragana(this.reading);
        this.meaningsWrapper = this.readMeaningsWrapper();
    }

    /**
     * Read out the reading from the dictionary entry.
     */
    readReading() {
        let jishoKana = '';
        let furigana = this.node.getElementsByClassName('furigana')[0];
        if (typeof furigana === 'undefined' || furigana === null) {
            return '';
        }

        if (furigana.innerText == '') {
            return this.readWord();
        }

        [...furigana.children].forEach(element => {
            if (element.tagName == 'SPAN' && element.innerText == '') {
                jishoKana += '*';
            }
            else if (element.classList.contains('kanji')) {
                jishoKana += element.innerText;
            }
        });

        /* rb rt tags */
        if (jishoKana == '' || jishoKana == '*') { // ヨーロッパ --- 欧羅巴
            jishoKana = furigana.innerText + jishoKana;
        }

        let okurigana = this.node.getElementsByClassName('text')[0];
        [...okurigana.children].forEach(element => {
            if (element.tagName == 'SPAN' && element.className == '') {
                jishoKana = jishoKana.replace('*', element.innerText);
            }
        })

        return jishoKana.replace(/[\*]/g, ''); // replacing any asteriks left: addresses bug with 小火
    }

    /**
     * Read out the Japanese word from the dictionary entry.
     */
    readWord() {
        return this.node
            .getElementsByClassName('concept_light-representation')[0]
            .getElementsByClassName('text')[0]
            .innerText.replace(/\([^()]*\)/g, '');
    }

    /**
     * Read out the meanings-wrapper from the dictionary entry.
     */
    readMeaningsWrapper() {
        return this.node.getElementsByClassName('meanings-wrapper')[0];
    }

    /**
     * Get ordinal number of for a meaning/translation in this dictionary entry
     * 
     * @param {HTMLElement} [meaning] Element of class 'meaning-wrapper'
     * @returns {Number} Ordinal number of current meaning/translation
     */
    readMeaningOrdinal(meaning) {
        return parseInt(meaning.innerText.split('.')[0], 10);
    }

    /**
     * Get ordinal number of the last meaning/translation of this dictionary entry
     * 
     * @returns {Number} Ordinal number of last meaning/translation in a dictionary entry
     */
    lastOrdinalInMeaningsWrapper() {
        let lastOrdinal = 1;
        let children = [...this.meaningsWrapper.childNodes]
        for (let i = children.length - 1; i >= 0; i--) {
            let tmp = this.readMeaningOrdinal(children[i]);
            if (!isNaN(tmp)) {
                lastOrdinal = tmp;
                break;
            }
        }
        return lastOrdinal;
    }

    /**
     * Test if the dictionary entry has a pitch accent diagram attached.
     */
    hasPitchAccentDiagram() {
        return this.node.getElementsByClassName('pitchDiagram').length > 0 ? true : false;
    }

    /**
     * Test if the dictionary entry has an audio file attached.
     */
    hasAudio() {
        let audioElement = this.node.getElementsByClassName('concept_audio');
        if (typeof audioElement !== 'undefined' && audioElement.length !== 0) {
            return true;
        }
        return false;
    }
}


