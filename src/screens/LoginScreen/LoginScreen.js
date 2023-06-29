import { Typography } from "@material-ui/core";
import React from "react";
import Button from "@material-ui/core/Button";
import Firebase from "../../api/firebase/Firebase";
import * as ROUTES from '../../routes';
import GoogleAuthButton from "../../Components/GoogleAuthButton";
import Grid from "@material-ui/core/Grid";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";


export const LoginScreen = ({ authResponseHandler }) => {

    const login = useGoogleLogin({
        onSuccess: authResponseHandler,
        flow: 'auth-code',
        scope: "https://www.googleapis.com/auth/drive.readonly"
    })

    return(
        <Grid container>
            <Grid container item>
                {/*<GoogleAuthButton authResponseHandler={authResponseHandler} />*/}
                {/*<GoogleLogin onSuccess={authResponseHandler} onError={() => {console.error("Login failed.")}}/>*/}

                <Button onClick={() => login()}>Sign in with Google</Button>

            </Grid>
        </Grid>

    );
}