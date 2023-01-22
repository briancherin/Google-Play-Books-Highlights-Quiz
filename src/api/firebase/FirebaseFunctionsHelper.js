import Firebase from "./Firebase";



export async function callUpdateUserHighlights() {

    const UpdateUserHighlights = Firebase.functions.httpsCallable('updateUserHighlights');

    const result = await UpdateUserHighlights();

    console.log("Function call result: ", result);

}

