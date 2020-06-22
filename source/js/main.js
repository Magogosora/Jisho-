/**
 * Run scripts modifying the content on jisho.
 */
function main() {
    addWordsContainingKanjiLinks();
    upgradeDictionaryEntries();
    enableSwitchingResults();
}

/**
 * Allows searching for queries such as "word1 word2" and switching between the results while retaining the functionality 
 * of this webextension. (Otherwise, the webextension would fail to work after reloading #main_results.)
 * 
 * @returns {undefined}
 */
function enableSwitchingResults() {
    let main_results = document.getElementById('main_results');
    if (typeof main_results === 'undefined' || main_results === null) {
        return;
    }

    let element = document.createElement('SPAN');
    main_results.appendChild(element);

    let isInDOMTree = main_results.contains(element);
    let observer = new MutationObserver(function (mutations) {
        if (document.body.contains(element) == false && isInDOMTree == true) {
            main();
            isInDOMTree = false;
            observer.disconnect();
        }
    });
    observer.observe(main_results.parentNode, { childList: true, subtree: true });
}

/**
 * Run scripts of this webextension as soon as the 'pageshow' event has been triggered on *://jisho.org/*.
 */
window.addEventListener('pageshow', function (event) {
    if (!event.persisted) {
        main();
    }
});