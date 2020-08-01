import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";
import { Typography } from "@material-ui/core";
import { HighlightsBrowser } from "./screens/HighlightsBrowser/HighlightsBrowser";


//https://www.sitepoint.com/react-router-complete-guide/

const Router = () => {

    const userIsLoggedIn = true;    // TODO: get from firebase

    return (

            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={userIsLoggedIn ? App : LoginScreen}/>
                    <Route exact path="/login" component={LoginScreen} />
                    <Route exact path="/browse" component={HighlightsBrowser} />
                </Switch>
            </BrowserRouter>

    );
}

const LoginScreen = () => {
    return(
        <Typography>Log in</Typography>
    );
}

export default Router;