
//http://diveintohtml5.info/storage.html

export class LocalStorage {

    static put(key, value) {
        if (this.supports_html5_storage()) {
            localStorage[key] = value;
        }
    }

    static get(key) {
        if (this.supports_html5_storage()) {
            return localStorage[key];
        }
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