import app from 'firebase/app';
import * as firebase from 'firebase';

import { firebase_config } from '../credentials.json';

class Firebase {

    static initialized = false;
    static auth;
    static googleProvider;
    static user = null;

    // TODO: Do this a better way (see https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial)
    static initialize() {
        if (!this.initialized) {
            app.initializeApp(firebase_config);
            this.auth = app.auth();
            this.googleProvider = new app.auth.GoogleAuthProvider();
            this.initialized = true;
        }
        return app;
    }

    static async getFirebaseInstance() {
        this.initialize();
        return app;
    }

    static async getFirebaseObject() {
        await this.initialize();
        return firebase;
    }

    static async signInWithGoogle() {
        return new Promise(async (resolve, reject) => {
            await this.initialize();
            this.auth.signInWithPopup(this.googleProvider).then((user) => {
                this.user = user;
                resolve(user);
            }).catch((e) => {
                reject(e);
            });
        });

    }

    static async signOut() {
        if (!this.initialized) {
            await this.initialize();
        }
        this.auth.signOut().then(() => {
            this.user = null;
        }).catch(() => {

        });
    }

    static userIsLoggedIn() {
        return this.user !== null;
    }

    static getAuthObject() {
        return this.auth;
    }

    static getAuthProviders() {
        return ({
           googleProvider: this.googleProvider,
        });
    }

    static setAuthListener(listenerFunction) {
        this.auth.onAuthStateChanged(listenerFunction);
    }
}

export default Firebase;