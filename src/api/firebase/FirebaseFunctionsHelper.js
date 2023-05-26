import Firebase from "./Firebase";
import { FirebaseDatabase } from "../storage/firebase/FirebaseDatabase";


// onReceiveHighlights: callback function that takes highlights list as param
export async function callUpdateUserHighlights() {
    return new Promise(async (resolve, reject) => {
        const UpdateUserHighlights = Firebase.functions.httpsCallable('updateUserHighlights');

        // Call cloud function and get taskId
        try {
            const result = await UpdateUserHighlights();
            const taskId = result.data.taskId;

            // Wait for task to complete
            waitForTask(taskId, async () => {
                const highlightsDict = await fetchHighlights();
                const highlights = Object.values(highlightsDict);
                resolve(highlights);
            }, () => {
                reject("Fetch user highlights failed.");
            })

        } catch (e) {
            reject(e);
        }
    })
}

// monitor users/<userid>/tasks/<taskId> for status:"completed"|"failed"
function waitForTask(taskId, onSuccess, onFailure) {
    // TODO: Implement timeout? If takes too long (10 sec), return failure

    FirebaseDatabase.getLoggedInUserRef()
        .child(`tasks/${taskId}`)
        .on("value", (snapshot) => {
            const status = snapshot.val()?.status;

            if (status !== null) {
                if (status === "completed") {
                    // Task completed. Fetch highlights from db.
                    onSuccess()
                }
                else if (status === "failed") {
                    onFailure()
                }

                // Delete task
                FirebaseDatabase.getLoggedInUserRef()
                    .child(`tasks/${taskId}`).remove();

            }
        });
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
