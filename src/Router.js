import * as React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import App from "./App";
import { HighlightsBrowser } from "./screens/HighlightsBrowser/HighlightsBrowser";
import { LoginScreen } from "./screens/LoginScreen/LoginScreen";
import Firebase from "./api/firebase/Firebase";
import * as ROUTES from "./routes";
import {GoogleLoginResponse} from "react-google-login";
import { FirebaseDatabase } from "./api/storage/firebase/FirebaseDatabase";
import { GoogleOAuthProvider, hasGrantedAllScopesGoogle } from "@react-oauth/google";
import { google_cloud_credentials } from "./api/credentials.json";
import { alt_client_id } from "./api/credentials.json";
import { initializeDriveApi } from "./api/googleDrive/gdriveNotesHelper";

import jwt_decode from "jwt-decode";


Firebase.initialize();

//https://www.sitepoint.com/react-router-complete-guide/


const Router = () => {
    const [ userLoggedIn, setUserLoggedIn ] = useState(Firebase.userIsLoggedIn());
    const [ authObject, setAuthObject ] = useState();

    useEffect(() => {

        initializeDriveApi();

    });

    const authResponseHandler = async (authResponse) => {

        console.log("Got auth response:")
        // console.log(jwt_decode(authResponse.credential))
        console.log(authResponse) // TODO: NEED TO MAKE SURE THE GDRIVE.READ SCOPE IS IN THIS

        const authCode = authResponse.code;

        try {
            const Oauth2Callback = Firebase.functions.httpsCallable('oauth2Callback');
            const response = await Oauth2Callback({authCode: authCode});
            console.log("Got response from Oauth2Callback function:")
            console.log(response)
            const {id_token, access_token} = response.data

            if (id_token && access_token) {
                const firebaseUserResult = await Firebase.authenticateWithTokens(id_token, access_token);

                setUserLoggedIn(Firebase.userIsLoggedIn());
            }

        } catch (e) {
                console.error("Failed to authenticate: ", e)
        }
/*
        const hasAccess = hasGrantedAllScopesGoogle(
            authResponse,
            'drive.readonly',
        );*/

        // console.log(hasAccess)

    }

    /*const authResponseHandler = async (authResponse) => {
        setAuthObject(authResponse);

        const { id_token, access_token, expires_at } = authResponse?.tokenObj ?? {id_token: null, access_token: null};

        if (id_token && access_token) {
            const firebaseUserResult = await Firebase.authenticateWithTokens(id_token, access_token);
            console.log("Firebase auth result from creds    ", firebaseUserResult);

            const refreshToken = firebaseUserResult.user.refreshToken;

            //Store the access token and refresh token in the database so that
            //the backend can make Gdrive requests for the user later
            await FirebaseDatabase.setUserRefChild("tokens", {
                accessToken: access_token,
                refreshToken: refreshToken,
                expires_at: expires_at
            });



            if (authResponse) {
                setUserLoggedIn(true);
            } else {
                setUserLoggedIn(false);
            }
        }



    }*/

    return (
        <GoogleOAuthProvider clientId={alt_client_id}>  {/*https://github.com/MomenSherif/react-oauth*/}
            <BrowserRouter>
                <Switch>
                    <Route exact path={ROUTES.ROUTE_HOME}
                           component={
                               !userLoggedIn
                                   ? () => LoginScreen({authResponseHandler})
                                   : () => App({authObject})
                           }/>
                    {/*<Route exact path={ROUTES.ROUTE_HOME} component={App}/>*/}
                    {/*<Route exact path={ROUTES.ROUTE_LOGIN} component={LoginScreen} />*/}
                    <Route exact path={ROUTES.ROUTE_BROWSE} component={HighlightsBrowser} />
                </Switch>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}


export default Router;