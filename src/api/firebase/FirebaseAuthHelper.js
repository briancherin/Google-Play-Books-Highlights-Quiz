import Firebase from "./Firebase";

export class FirebaseAuthHelper {
    static getLoggedInUserId() {
        if (Firebase.initialized && Firebase.userIsLoggedIn() != null) {
            return Firebase.auth.currentUser.uid;
        } else {
            return null;
        }
    }
}