import { FirebaseAuthHelper } from "../firebase/FirebaseAuthHelper";
import { FirebaseDatabase } from "../FirebaseDatabase";

export class FavoritesFirebaseStorage {

    static pushFavoriteToDatabase(quoteObject) {
        FirebaseDatabase.pushToUserRef("favorites", quoteObject).then((favoriteDatabaseKey) => {
            console.log("Pushed favorite to Firebase.");
        }).catch((e) => {
            console.error("Error while pushing favorite to Firebase: " + e);
        });
    }

    static removeFavoriteFromDatabase(quoteObject) {

    }
}