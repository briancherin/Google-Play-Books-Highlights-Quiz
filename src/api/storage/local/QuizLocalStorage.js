import { LocalStorage } from "./LocalStorage";

const KEY_QUOTES_LIST = "quotesList";
const KEY_TITLES_LIST = "titlesList";

export class QuizLocalStorage extends LocalStorage {

    static getCachedQuotesList() {
        return this.getParsed(KEY_QUOTES_LIST);
    }

    static getCachedTitlesList() {
        return this.getParsed(KEY_TITLES_LIST);
    }

    static saveCachedTitlesList(titlesList) {
        this.putJSON(KEY_TITLES_LIST, titlesList);
    }

    static saveCachedQuotesList(quotesList) {
        this.putJSON(KEY_QUOTES_LIST, quotesList);
    }

    static clearAllCached() {
        this.saveCachedQuotesList([]);
    }

}