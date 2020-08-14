import { FavoritesLocalStorage } from "./FavoritesLocalStorage";
import { FavoritesFirebaseStorage } from "./FavoritesFirebaseStorage";

export class FavoritesStorage {

    static addToFavorites(quoteObject) {
        FavoritesLocalStorage.pushToFavoritesList(quoteObject);
        FavoritesFirebaseStorage.pushFavoriteToDatabase(quoteObject);
    }

    static removeFromFavorites(quoteObject) {
        FavoritesLocalStorage.removeFromFavoritesList(quoteObject);
        FavoritesFirebaseStorage.removeFavoriteFromDatabase(quoteObject);
    }

}