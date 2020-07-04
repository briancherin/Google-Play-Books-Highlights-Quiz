import { LocalStorage } from "./LocalStorage";
import { HighlightedQuote } from "../models/HighlightedQuote";

const KEY_FAVORITES_LIST = "favoritesList";

export class FavoritesLocalStorage extends LocalStorage {

    static getFavoritesList() {
        const list = this.getParsed(KEY_FAVORITES_LIST);
        if (list && list !== '') return list;
        return [];
    }

    static saveFavoritesList(favoritesList) {
        this.putJSON(KEY_FAVORITES_LIST, favoritesList);
    }

    static pushToFavoritesList(favoriteObj) {
        const list = this.getFavoritesList();
        list.push(favoriteObj)
        this.saveFavoritesList(list);
    }

    static quoteIsFavorited(quoteText) {
        const list = this.getFavoritesList();
        for (let i = 0; i < list.length; i++) {
            if (list[i].quoteText === quoteText) return true;    //TODO: Replace with Quote object type (search for entire obj)
        }
        return false;
    }

    // TODO: Remove by specific quote text, or an id?
    static removeFromFavoritesList(favoriteObjToDelete) {
        const newList = this.getFavoritesList()
            .filter((obj) => {
                // return obj !== favoriteObjToDelete;
                return obj.quoteText !== favoriteObjToDelete.quoteText; // TODO: Replace with Quote object type (search for entire obj)
            });
        this.saveFavoritesList(newList);
    }

    static clearAllFavorites() {
        this.saveFavoritesList([]);
    }
}