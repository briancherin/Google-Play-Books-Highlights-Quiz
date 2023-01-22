import * as React from "react";
import {useState} from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import App from "./App";
import { HighlightsBrowser } from "./screens/HighlightsBrowser/HighlightsBrowser";
import { LoginScreen } from "./screens/LoginScreen/LoginScreen";
import Firebase from "./api/firebase/Firebase";
import * as ROUTES from "./routes";
import {GoogleLoginResponse} from "react-google-login";
import { FirebaseDatabase } from "./api/storage/firebase/FirebaseDatabase";

Firebase.initialize();

//https://www.sitepoint.com/react-router-complete-guide/


const Router = () => {
    const [ userLoggedIn, setUserLoggedIn ] = useState(Firebase.userIsLoggedIn());
    const [ authObject, setAuthObject ] = useState();

    const authResponseHandler = async (authResponse) => {
        setAuthObject(authResponse);

        const { id_token, access_token } = authResponse?.tokenObj ?? {id_token: null, access_token: null};

        if (id_token && access_token) {
            const firebaseUserResult = await Firebase.authenticateWithTokens(id_token, access_token);
            console.log("Firebase auth result from creds    ", firebaseUserResult);

            const refreshToken = firebaseUserResult.user.refreshToken;

            //Store the access token and refresh token in the database so that
            //the backend can make Gdrive requests for the user later
            await FirebaseDatabase.setUserRefChild("tokens", {accessToken: access_token, refreshToken: refreshToken});



            if (authResponse) {
                setUserLoggedIn(true);
            } else {
                setUserLoggedIn(false);
            }
        }



    }

    return (
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

    );
}


export default Router;