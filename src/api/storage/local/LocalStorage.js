
//http://diveintohtml5.info/storage.html

export class LocalStorage {

    static put(key, value) {
        if (this.supports_html5_storage()) {
            localStorage[key] = value;
        }
    }

    // value is a JSON object, which will be stored as a string
    static putJSON(key, value) {
        this.put(key, JSON.stringify(value));
    }

    static get(key) {
        if (this.supports_html5_storage()) {
            return localStorage[key];
        }
        return undefined;
    }

    // Returns the JSON-parsed string with the specified key
    static getParsed(key) {
        const str = this.get(key);
        if (str) return JSON.parse(str);
        return undefined;
    }

    static contains(key) {
        if (this.supports_html5_storage()) {
            return key in localStorage;       
        }
    }

    static supports_html5_storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch(e) {
            return false;
        }
    }

}