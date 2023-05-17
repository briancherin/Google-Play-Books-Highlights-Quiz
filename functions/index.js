const functions = require("firebase-functions");
const admin = require("firebase-admin");

const https = require("https");

// const fetch = require("node-fetch");

 // import fetch from "node-fetch"

const { firebase_config } = require("./credentials.json");

admin.initializeApp();


// Callable function: https://firebase.google.com/docs/functions/callable

exports.updateUserHighlights = functions.https.onCall((data, context) => {

    // Identify the user
    const uid = context.auth.uid;

    console.log("Hello. Called function!")


    // Fetch the user's access token and refresh token from the database
    admin.database().ref(`users/${uid}/tokens`).once("value", async (snapshot) => {
        const val = snapshot.val();
        let access_token = val?.accessToken;
        const refresh_token = val?.refreshToken;
        const expires_at = val?.expires_at;

        console.log(val)

        console.log("Fetched user's access token and refresh token: ");
        console.log(access_token)
        console.log(refresh_token)
        console.log(expires_at)

        if (!refresh_token) {
            throw new functions.https.HttpsError("unknown", "Refresh token is missing from user database entry");
        }

        // Refresh the access token (with refresh token) if expired
       if (access_token_is_expired(expires_at)) {
            try {
                access_token_obj = await tradeRefreshTokenForAccessToken(refresh_token);
                access_token = access_token_obj.access_token; // Update local access token for later use

                // Update access and refresh token in database
                try {
                    await admin.database().ref(`users/${uid}/tokens`).set({
                        accessToken: access_token_obj.access_token,
                        refreshToken: access_token_obj.refresh_token,
                        expires_at: access_token_obj.expires_at
                    });
                    console.log("Updated access/refresh token in database.")
                } catch (e) {
                    console.error("Failed to update access/refresh token in database: " + e);
                }



            } catch (error) {
                console.log("Error: ", error)
                throw 'Unable to refresh access token'
            }
       }



        // Call GDrive API to update highlights

    });

    return {
        message: "Successfully called function.",
        uid: uid,
    };

});

const access_token_is_expired = (expires_at) => {
    // expires_at is a UNIX timestamp int

    const current_timestamp = Math.floor(Date.now() / 1000);
    return expires_at <= current_timestamp;
}

const tradeRefreshTokenForAccessToken = (refreshToken) => {

    // Adapted from https://stackoverflow.com/a/57119131

    const firebaseApiKey = firebase_config.apiKey;

    const postData = `grant_type=refresh_token&refresh_token=${refreshToken}`;

    const url = 'https://securetoken.googleapis.com/v1/token?key=' + firebaseApiKey;

    const options = {
        method: "POST",
        headers: {'content-type': 'application/x-www-form-urlencoded', 'content-length': postData.length},
    }

    return new Promise((resolve, reject) => {
        const req = https.request(url, options,  (res) => {

           const body = []
           res.on('data', (chunk) => body.push(chunk));
           res.on('end', () => {
               const resString = Buffer.concat(body).toString();

               if (res.statusCode < 200 || res.statusCode > 299) {
                   console.log("HI IN REQ ERROR")
                   reject("Error refreshing access token. HTTP error " + res.statusCode + ": " + resString);
               }

               console.log("Got refreshed access token: " + resString);

               const resultObj = JSON.parse(resString);

               const objToReturn = {
                   access_token: resultObj.access_token,
                   refresh_token: resultObj.refresh_token,
                   expires_at: (resultObj.expires_in + (Math.floor(Date.now() / 1000))) // Go from expires_in to expires_at
               }

               resolve(objToReturn);
           });
       });

        req.on('error', (err) => {reject(err)});
        req.on('timeout', () => {req.destroy(); reject("Timed out")})
        req.write(postData);
        req.end();
    });


}