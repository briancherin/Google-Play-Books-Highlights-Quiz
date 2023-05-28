import Firebase from "./Firebase";
import { FirebaseDatabase } from "../storage/firebase/FirebaseDatabase";


// onReceiveHighlights: callback function that takes highlights list as param
export async function callUpdateUserHighlights(onProgressUpdate) {
    return new Promise(async (resolve, reject) => {

        const taskId = Math.floor(Math.random()*1000000);

        const UpdateUserHighlights = Firebase.functions.httpsCallable('updateUserHighlights');

        // Call cloud function
        try {
            // Start listening for task updates
            waitForTask(taskId, async () => {
                const highlightsDict = await fetchHighlights();
                const highlights = Object.values(highlightsDict);
                resolve(highlights);
            }, () => {
                reject("Fetch user highlights failed.");
            }, onProgressUpdate);

            await UpdateUserHighlights({taskId: taskId});

        } catch (e) {
            console.error("Failed: " + e)
            reject(e);
        }
    })
}

// monitor users/<userid>/tasks/<taskId> for status:"completed"|"failed"
function waitForTask(taskId, onSuccess, onFailure, onProgressUpdate) {
    // TODO: Implement timeout? If takes too long (10 sec), return failure

    FirebaseDatabase.getLoggedInUserRef()
        .child(`tasks/${taskId}`)
        .on("value", (snapshot) => {
            const status = snapshot.val()?.status;
            const description = snapshot.val()?.description;

            if (status !== null) {
                if (status === "completed") {
                    // Task completed. Fetch highlights from db.
                    onSuccess()
                    deleteTask(taskId);
                }
                else if (status === "failed") {
                    onFailure();
                    deleteTask(taskId);

                    if (description) {
                        console.log(`Task ${taskId} failed: ${description}`);
                    }
                }
                else if (status === "progress") {
                    onProgressUpdate(description);
                }

            }
        });
}

async function deleteTask(taskId) {
    await FirebaseDatabase.getLoggedInUserRef()
        .child(`tasks/${taskId}`).remove();
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
