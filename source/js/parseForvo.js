/**
 * Parse the response from forvo and extracts an audio element from forvo.
 * 
 * @param {String} forvoResponse Response from forvo.
 * @returns {?HTMLAudioElement} Audio data from forvo.
 */
function parseForvoResponse(forvoResponse) {
    let parser = new DOMParser();
    let forvoDocument = parser.parseFromString(forvoResponse, 'text/html');
    let play = forvoDocument.getElementsByClassName('play')[0];
    if (play == null) {
        return null;
    }

    let raw = play.getAttribute('onclick').split("'");
    let audioObj = document.createElement('audio');
    const typeOgg = 'audio/ogg';
    const typeMpeg = 'audio/mpeg';
    if (raw[5] != '') { // mp3 high quality?
        var mp3h = 'https://audio00.forvo.com/audios/mp3/' + atob(raw[5]);
        let source1 = createSource(mp3h, typeMpeg);
        audioObj.append(source1);
    }
    if (raw[7] != '') { // ogg high quality?
        var oggh = 'https://audio00.forvo.com/audios/ogg/' + atob(raw[7]);
        let source2 = createSource(oggh, typeOgg);
        audioObj.append(source2);
    }
    if (raw[1] != '') { // mp3 low quality?
        var mp3l = 'https://audio00.forvo.com/mp3/' + atob(raw[1]);
        let source3 = createSource(mp3l, typeMpeg);
        audioObj.append(source3);
    }
    if (raw[3] != '') { // ogg low quality?
        var oggl = 'https://audio00.forvo.com/ogg/' + atob(raw[3]);
        let source4 = createSource(oggl, typeOgg);
        audioObj.append(source4);
    }
    if (audioObj.childNodes.length == 0) {
        return null
    }
    return audioObj;
}