/**
 * Remove links to wanikani from a dictionary entry.
 * 
 * @param {JishoDictionaryEnry} jishoDictionaryEntry 
 */
function removeWaniKaniLinks(jishoDictionaryEntry) {
    let links = jishoDictionaryEntry.node.querySelectorAll('[href="http://wanikani.com/"]');
    [...links].forEach(link => {
        if (typeof link !== 'undefined' && link !== null) {
            let text = link.innerText;
            let textNode = document.createTextNode(text);
            let parentNode = link.parentNode;
            parentNode.removeChild(link);
            parentNode.appendChild(textNode);
        }
    });
}