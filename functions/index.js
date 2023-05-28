const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("firebase-functions/logger/compat"); // Use console.log() for logging


const crypto = require("crypto");

const https = require("https");

// const fetch = require("node-fetch");

 // import fetch from "node-fetch"

const { firebase_config } = require("./credentials.json");

const {GoogleDriveApi} = require("./googleDrive/gdrive");
const { getQuotesList } = require("./googleDrive/gdriveNotesHelper");

admin.initializeApp();


// Callable function: https://firebase.google.com/docs/functions/callable

exports.updateUserHighlights = functions.https.onCall((data, context) => {

    // Identify the user
    const uid = context.auth.uid;

    const taskId = data.taskId;

    // Fetch the user's access token and refresh token from the database
    return new Promise((resolve, reject) => {
        admin.database().ref(`users/${uid}/tokens`).once("value", async (snapshot) => {
            const val = snapshot.val();
            let access_token = val?.accessToken;
            let refresh_token = val?.refreshToken;
            let expires_at = val?.expires_at;

            if (!refresh_token) {
                await updateTaskFailure(uid, taskId, "Refresh token is missing from user database entry");
                throw new functions.https.HttpsError("unknown", "Refresh token is missing from user database entry");
            }

            // Refresh the access token (with refresh token) if expired
            if (access_token_is_expired(expires_at)) {
                try {
                    const access_token_obj = refresh_access_token(refresh_token)
                    access_token = access_token_obj.access_token
                    refresh_token = access_token_obj.refresh_token
                    expires_at = access_token_obj.expires_at
                } catch (e) {
                    await updateTaskFailure(uid, taskId, e);
                    throw new functions.https.HttpsError("unknown", e)
                }
            }

            // Get lastUpdated field from db

            let timestampLastUpdated;
            try {
                timestampLastUpdated = await getTimestampLastUpdated(uid);
                console.log("Got timestamp last updated: " + timestampLastUpdated);
            } catch (e) {
                await updateTaskFailure(uid, taskId, "Error fetching timestampLastUpdated from db: " + error);
                console.error("Error fetching timestampLastUpdated from db: " + error);
            }

            await updateTaskProgress(uid, taskId, "Importing highlights from Google Drive..."); // Description will be shown on frontend UI

            // Call GDrive API to update highlights
            const driveApi = new GoogleDriveApi(access_token, refresh_token, expires_at);
            let quotesList;
            try {
                let maxProgressInt = 0;
                quotesList = await getQuotesList(driveApi, timestampLastUpdated, (async (progress, fileObject) => { //Progress is a number from 0 to 100
                    console.log("All files progress: " + progress)


                   if (progress >= maxProgressInt) {
                        const str = `${Math.round(progress)}%`;
                        maxProgressInt += 10;
                        await updateTaskProgress(uid, taskId, `Importing highlights from Google Drive... ${str}`)
                   }

                }));
            } catch (e) {
                await updateTaskFailure(uid, taskId, "Error getting quotes list or parsing quotes: " + error);
                console.error("Error getting quotes list or parsing quotes: " + error);
            }

            await updateTaskProgress(uid, taskId, "Processing highlights..."); // Description will be shown on frontend UI

            // Transform quotesList to a dictionary where the key is the book title and the value is the original object
            const quotesDict = quotesList.reduce((obj, item) => {
                // obj is the accumulated dict
                // item is the particular item in the original array we are looking at
                const titleHash = crypto.createHash('md5').update(item.title).digest('hex');
                obj[titleHash] = item;
                return obj;
            }, {});

            // Save highlights to database
            // await admin.database().ref(`users/${uid}/highlights`).set(quotesList);
            await admin.database().ref(`users/${uid}/highlights`).update(quotesDict);

            // Set UNIX timestamp to show update time
            await setTimestampLastUpdatedNow(uid);

            // Mark task as completed
            await updateTaskCompleted(uid, taskId);


            console.log("Completed. Uploaded highlights to db.")

            resolve( {
                message: "Successfully called function.",
                uid: uid,
                taskId: taskId,
            });
        }, async (error) => {
            await updateTaskFailure(uid, taskId, "Error fetching user tokens from db: " + error);
            console.error("Error fetching user tokens from db: " + error)
        });
    });






});

const updateTaskFailure = async (uid, taskId, description) => {
    await updateTaskStatus(uid, taskId, "failed", description);
}

const updateTaskCompleted = async (uid, taskId) => {
    await updateTaskStatus(uid, taskId, "completed");
}

const updateTaskProgress = async (uid, taskId, description) => {
    await updateTaskStatus(uid, taskId, "progress", description);
}

const updateTaskStatus = async (uid, taskId, statusString, message="") => {
    await admin.database().ref(`users/${uid}/tasks/${taskId}`).set({
        status: statusString,
        description: message
    });
};


const access_token_is_expired = (expires_at) => {
    // expires_at is a UNIX timestamp int

    const current_timestamp = Math.floor(Date.now() / 1000);
    return expires_at <= current_timestamp;
}

const refresh_access_token = async (refreshToken) => {
    try {
        const access_token_obj = await tradeRefreshTokenForAccessToken(refresh_token);

        // Update access and refresh token in database
        try {
            await admin.database().ref(`users/${uid}/tokens`).set({
                accessToken: access_token_obj.access_token,
                refreshToken: access_token_obj.refresh_token,
                expires_at: access_token_obj.expires_at
            });
            console.log("Updated access/refresh token in database.")

            return access_token_obj;
        } catch (e) {
            console.error("Failed to update access/refresh token in database: " + e);
        }
    } catch (error) {
        console.log("Error: ", error)
        throw 'Unable to refresh access token'
    }
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

const getTimestampLastUpdated = async (uid) => {
    return new Promise((resolve, reject) => {

        admin.database().ref(`users/${uid}/dateLastUpdated`).once("value", async (snapshot) => {
            const timestamp = snapshot.val();

            if (timestamp == null) {
                resolve(-1);
            }

            resolve(timestamp);
        }, async (error) => {
            reject(error);
        });
    });


}

const setTimestampLastUpdatedNow = async (uid) => {
    await admin.database().ref(`users/${uid}/dateLastUpdated`).set(Math.floor(Date.now() / 1000));
}