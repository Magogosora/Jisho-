/**
 * Parse the response from weblio. Extract pitch accent number(s).
 * 
 * @param {String} weblioResponse Response from weblio in text form.
 * @param {String} word Japanese word.
 * @param {String} reading Reading of the Japanese word.
 */
function parseWeblioResponse(weblioResponse, word, reading) {
    let parser = new DOMParser();
    let weblioDocument = parser.parseFromString(weblioResponse, 'text/html');
    let vocabResults = weblioDocument.getElementsByClassName('midashigo');
    let pitchAccents = [];
    [...vocabResults].forEach(result => {
        if (result.title == word) {
            let boldElements = result.getElementsByTagName('B');
            if (boldElements != null && boldElements.length > 0) {
                let weblioReading = boldElements[0].innerText.replace(/(\s+)|・/gm, '');
                if (weblioReading != reading) {
                    return;
                }

                [...result.getElementsByTagName('SPAN')].forEach(span => {
                    let spanText = span.innerText;
                    if (spanText.includes('［')) {
                        let parseNum = parseInt(spanText.match(/\d+/gm));
                        pitchAccents.push(parseNum);
                    }
                });
            }
        }
    });
    return pitchAccents;
}