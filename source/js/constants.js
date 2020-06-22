/**
 * Look for at most this many meanings in dicitionary entry on jisho.
 * 
 * @constant
 * @type {Number}
 */
const MAX_LOOP = 100;

/* Position of first/last hiragana/katakana/kanji in unicode. */
const HIRAGANA_START = 0x3040;
const HIRAGANA_END = 0x309f;
const KATAKANA_START = 0x30a0;
const KATAKANA_END = 0x30ff;
const KANJI_START = 0x4e00;
const KANJI_END = 0x9faf;
/* Position of ー　in unicode */
const PROLONGED_SOUND_MARK = 0x30fc;
/* Spread between hiragana and katakana in unicode */
const HIRA_KATA_DIF = KATAKANA_START - HIRAGANA_START

const HIRA_DIGRAPHS = ['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゃ', 'ゅ', 'ょ', 'ゎ', 'ゕ', 'ゖ'];
const KATA_DIGRAPHS = ['ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ャ', 'ュ', 'ョ', 'ヮ', 'ヵ', 'ヶ'];

const PATTERN_NAMES = {
    HEIBAN: {
        EN: 'heiban',
        JA: '平板',
    },
    ATAMADAKA: {
        EN: 'atamadaka',
        JA: '頭高',
    },
    NAKADAKA: {
        EN: 'nakadaka',
        JA: '中高',
    },
    ODAKA: {
        EN: 'odaka',
        JA: '尾高',
    },
    UNKNOWN: {
        EN: 'unknown',
        JA: '不詳',
    },
};

const PATTERN_COLORS = {
    HEIBAN: '#d20ca3',
    ATAMADAKA: '#EA9316',
    NAKADAKA: '#27a2ff',
    ODAKA: '#0cd24d',
    UNKNOWN: '#CCCCCC',
}

/* Regex commands used in cleaning translations from wadoku */
const CLEAN_WADOKU = /[。~￨･…\s]/gm
const CLEAN_WADOKU_LEAVE_SPACES = /[。~￨･]|(\r\n|\n|\r)/gm // removed … \s

/**
 * Any HTMLElement from wadoku containing these classes can be removed.
 * 
 * @constant
 * @type {String[]}
 */
const DELETE_WADOKU_CLASSES = ['genus', 'indexnr', 'hidden', 'descr', 'season', 'label', 'transcr', 'expl', 'klammer'];

/**
 * 
 * Do not alter any HTMLElement from wadoku containing any of these classes.
 * 
 * @constant
 * @type {String[]}
 */
const ALLOWED_WADOKU_CLASSES = ['orth', 'senses', 'sense', 'syn', 'anto'];

/**
 * This message is displayed in the dictionary entry on jisho if no results have been found on wadoku.
 */
const NO_ENTRY_ON_WADOKU = 'Keinen Eintrag gefunden';

/**
 * Text for link to details on kanji used in dictionary entry.
 */
const KANJI_DETAILS = 'Kanji details';

/**
 * Text in link to 'Word containing KANJI'.
 * 
 * @constant
 * @type {String}
 */
const WORDS_CONTAINING_KANJI_EN = 'Words containing ';
// const WORDS_CONTAINING_KANJI = WORDS_CONTAINING_KANJI_EN;

/**
 * A response from japanesepod101 having a content length of this size means that the requested audio is not available.  
 * 
 * @constant
 * @type {Number} 
 */
const AUDIO_NOT_AVAILABLE_JAPANESEPOD_CONTENT_LENGTH = 52288;

/**
 * Text displayed on buttons that play the audios from japanesepod101.
 * 
 * @constant
 * @type {String}
 */
const PLAY_AUDIO_TEXT_JAPANESEPOD = 'Play audio₁';

/**
 * Text displayed on buttons that play the audios from forvo.
 * 
 * @constant
 * @type {String}
 */
const PLAY_AUDIO_TEXT_FORVO = 'Play audio₂';
