import * as firebase from 'firebase';
import app from 'firebase/app';


import { firebase_config } from '../../credentials.json';
import Firebase from "../../firebase/Firebase";
import { FirebaseAuthHelper } from "../../firebase/FirebaseAuthHelper";

export class FirebaseDatabase {


    static getDatabase() {
        return Firebase.database;
    }

    static getLoggedInUserRef() {
        let uid = FirebaseAuthHelper.getLoggedInUserId();
        console.log("Got uid: " + uid);
        if (uid !== null) {
            return this.getDatabase().ref(`users/${uid}`);
        } else {
            return null;
        }
    }

    static pushToUserRef(location, data) {
        return new Promise((resolve, reject) => {
            if (Firebase.initialized && Firebase.userIsLoggedIn()) {
                let userRef = this.getLoggedInUserRef();
                if (userRef !== null) {
                    let ref = userRef.child(location);
                    let newPushKey = ref.push().key;
                    ref.child(newPushKey).set(data).then(() => {
                        resolve(newPushKey);
                    }).catch((e) => {
                        reject(e);
                    })
                } else {
                    reject("userRef is null");
                }
            } else {
                reject("User is not logged in");
            }
        })

    }

}