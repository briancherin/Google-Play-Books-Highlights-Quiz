const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// Callable function: https://firebase.google.com/docs/functions/callable

exports.updateUserHighlights = functions.https.onCall((data, context) => {

    // Identify the user
    const uid = context.auth.uid;

    console.log("Hello. Called function!")

    return {
        message: "Successfully called function.",
        uid: uid,
    };

    // Fetch the user's access token and refresh token from the database
  /*  admin.database().ref(`users/${uid}/tokens`).once("value", (snapshot) => {
        const val = snapshot.val();
        const access_token = val?.access_token;
        const refresh_token = val?.refresh_token;


    });*/

    // Refresh the access token (with refresh token) if expired

    // Call GDrive API to update highlights
})