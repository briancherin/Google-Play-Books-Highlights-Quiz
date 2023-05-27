import Firebase from "./Firebase";
import { FirebaseDatabase } from "../storage/firebase/FirebaseDatabase";


// onReceiveHighlights: callback function that takes highlights list as param
export async function callUpdateUserHighlights() {
    return new Promise(async (resolve, reject) => {

        const UpdateUserHighlights = Firebase.functions.httpsCallable('updateUserHighlights');

        // Call cloud function
        try {
            await UpdateUserHighlights();

            const highlightsDict = await fetchHighlights();
            const highlights = Object.values(highlightsDict);
            resolve(highlights);

        } catch (e) {
            console.error("Fetch user highlights failed: " + e)
            reject("Fetch user highlights failed: " + e);
        }
    })
}


async function fetchHighlights() {
    return new Promise((resolve, reject) => {
        FirebaseDatabase.getLoggedInUserRef()
            .child("highlights")
            .once("value", (snapshot) => {
                console.log("Got result from fetchHighlights:")
                console.log(snapshot)
                const highlights = snapshot.val();
                resolve(highlights);
            }).catch((error) => {
                reject(error);
        })
    })

}
