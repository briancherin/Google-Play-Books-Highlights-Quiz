import app from 'firebase/app';
import * as firebase from 'firebase';

import { firebase_config } from '../credentials.json';

const USE_FUNCTIONS_EMULATOR = false; // Use emulator for local development


class Firebase {



    static initialized = false;


    /**
     * @type {firebase.auth.Auth}
     */
    static auth;

    /**
     * @type {firebase.database.Database}
     */
    static database;

    /**
     * @type {firebase.functions.Functions}
     */
    static functions;


    static googleProvider;

    /**
     * @type {firebase.User}
     */
    static user = null;

    // TODO: Do this a better way (see https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial)
    static initialize() {
        if (!this.initialized) {
            app.initializeApp(firebase_config);
            this.auth = app.auth();
            this.database = app.database();
            this.functions = app.functions();
            this.googleProvider = new app.auth.GoogleAuthProvider();
            this.initialized = true;

            if (USE_FUNCTIONS_EMULATOR) {
                app.functions().useFunctionsEmulator("http://localhost:5001"); // For local testing
            }
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

    static async authenticateWithTokens(id_token, access_token) {
        const credential = this.googleProvider.credential(id_token, access_token);
        const userResult = await this.auth.signInWithCredential(credential);
        this.user = userResult.user;
        return userResult;
    }

    static async signInWithGoogle() {
        return new Promise(async (resolve, reject) => {
            await this.initialize();
            this.auth.signInWithPopup(this.googleProvider).then((userResult) => {
                this.user = userResult.user;
                resolve(userResult);
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
        return this.auth.currentUser !== null;

        //return this.initialized && this.user !== null;
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

    static getDatabaseObject() {
        return this.database;
    }
}

export default Firebase;