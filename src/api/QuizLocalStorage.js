import { LocalStorage } from "./LocalStorage";


export class QuizLocalStorage extends LocalStorage {

    static getCachedQuotesList() {
        if (this.supports_html5_storage()) {
            return JSON.parse(this.get("quotesList"));
        } else {
            return undefined;
        }
    }

    static getCachedTitlesList() {
        return JSON.parse(this.get("titlesList"));
    }

    static saveCachedTitlesList(titlesList) {
        this.put("titlesList", JSON.stringify(titlesList));
    }

    static saveCachedQuotesList(quotesList) {
        this.put("quotesList", JSON.stringify(quotesList));
    }

    static clearAllCached() {
        this.saveCachedQuotesList([]);
        this.saveCachedQuotesList([]);    
    }

}