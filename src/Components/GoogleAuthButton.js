import React, { useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';

import { google_cloud_credentials } from '../api/credentials.json';
import GoogleLogin from 'react-google-login';

import { loadApi, authenticateApi, getFilesInFolder, getFileHtml } from '../api/gdrive';
import { getQuotesListFromHTML, initializeDriveApi, getQuotesList } from '../api/gdriveNotesHelper';

const GoogleAuthButton = (props) => {

    const CLIENT_ID = google_cloud_credentials.web.client_id;

    useEffect(() => {
        
        initializeDriveApi();
        
    });


    const authResponseHandler = async (authObject) => {
        props.authResponseHandler(authObject);
    }

    return(

        <GoogleLogin
            clientId={CLIENT_ID}
            onSuccess={authResponseHandler}
            onFailure={authResponseHandler}
            isSignedIn={false} /* If True, it will remember the login between sessions/refreshes */
            cookiePolicy={'single_host_origin'}
            scope={'https://www.googleapis.com/auth/drive.readonly'}
            discoveryDocs={'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'}
        />

        

    );

}

export default GoogleAuthButton;