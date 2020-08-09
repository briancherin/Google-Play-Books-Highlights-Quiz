import React, { useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { HighlightsBrowser } from "./screens/HighlightsBrowser/HighlightsBrowser";
import { LoginScreen } from "./screens/LoginScreen/LoginScreen";
import Firebase from "./api/firebase/Firebase";
import * as ROUTES from "./routes";

Firebase.initialize();

//https://www.sitepoint.com/react-router-complete-guide/


const Router = () => {
    const [ userLoggedIn, setUserLoggedIn ] = useState(Firebase.userIsLoggedIn());

    useEffect(() => {
        Firebase.setAuthListener((user) => {
            if (user) {
                setUserLoggedIn(true);
            } else {
                setUserLoggedIn(false);
            }
        })
    }, []);

    return (
            <BrowserRouter>
                <Switch>
                    <Route exact path={ROUTES.ROUTE_HOME} component={!userLoggedIn ? LoginScreen : App}/>
                    {/*<Route exact path={ROUTES.ROUTE_HOME} component={App}/>*/}
                    <Route exact path={ROUTES.ROUTE_LOGIN} component={LoginScreen} />
                    <Route exact path={ROUTES.ROUTE_BROWSE} component={HighlightsBrowser} />
                </Switch>
            </BrowserRouter>

    );
}


export default Router;