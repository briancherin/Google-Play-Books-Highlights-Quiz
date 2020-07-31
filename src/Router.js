import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";
import { Typography } from "@material-ui/core";


//https://www.sitepoint.com/react-router-complete-guide/

const Router = () => {

    const userIsLoggedIn = true;    // TODO: get from firebase

    return (

        userIsLoggedIn
            ? <App />
            : <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={LoginScreen}/>
                    <Route exact path="/login" component={LoginScreen} />
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