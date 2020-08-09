import { Typography } from "@material-ui/core";
import React from "react";
import Button from "@material-ui/core/Button";
import Firebase from "../../api/firebase/Firebase";
import * as ROUTES from '../../routes';


export const LoginScreen = (props) => {
    return(
        <Button
            onClick={() => {
                Firebase.signInWithGoogle().then(() => {
                    props.history.push(ROUTES.ROUTE_HOME);
                });
            }}
        >
            Sign in with Google
        </Button>
    );
}