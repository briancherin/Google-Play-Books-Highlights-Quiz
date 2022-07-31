import { Typography } from "@material-ui/core";
import React from "react";
import Button from "@material-ui/core/Button";
import Firebase from "../../api/firebase/Firebase";
import * as ROUTES from '../../routes';
import GoogleAuthButton from "../../Components/GoogleAuthButton";
import Grid from "@material-ui/core/Grid";


export const LoginScreen = ({ authResponseHandler }) => {

    return(
        <Grid container>
            <Grid container item>
                <GoogleAuthButton authResponseHandler={authResponseHandler} />
            </Grid>
        </Grid>

    );
}