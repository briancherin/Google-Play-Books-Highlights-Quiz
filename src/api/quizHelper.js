import { initializeDriveApi, getQuotesList, getTitlesList } from "./gdriveNotesHelper";

export async function getQuestionsListFromDrive(driveAuthObject, maxQuestions, clusterByTitle) {
    initializeDriveApi();

    const bookQuotesList = await getQuotesList(driveAuthObject, clusterByTitle);
    const bookTitles = await getTitlesList();


    let questionsList = [];
    console.log(bookQuotesList);

    for (var i = 0; hasMoreQuotes(bookQuotesList, clusterByTitle) && i < maxQuestions; i++) {
        var randIndex = Math.floor(Math.random() * bookQuotesList.length);
        var randomQuoteObject = bookQuotesList[randIndex];

        if (clusterByTitle) { // Picked a random title from all possible titles
            // Pick a random quote from this title
            const randIndex2 = Math.floor(Math.random() * randomQuoteObject.quotes.length);
            const newRandomQuoteObject = randomQuoteObject.quotes[randIndex2];
            randomQuoteObject.quotes.splice(randIndex, 1); // Prevent future repeat (remove from list of possible quotes)

            if (randomQuoteObject.quotes.length === 0) { // If used all the quotes for this book
                bookQuotesList.splice(randIndex, 1); // Delete this title from the possible choices
            }

            randomQuoteObject = newRandomQuoteObject; // Use the selected quote
            
        } else {    // Picked a random quote from all possible quotes
            randomQuoteObject.splice(randIndex, 1); /* Don't repeat this quote in the future */
        }

        const { bookTitle, quoteText, highlightColor } = randomQuoteObject;
        let answerChoices = [];

        answerChoices.push({
            title: bookTitle,
            isCorrectAnswerChoice: true
        });

        /* Get three other random book titles */
        getRandomSubarray(bookTitles.filter((title) => title !== bookTitle), 3)
            .forEach((title) => {
                answerChoices.push({
                    title: title,
                    isCorrectAnswerChoice: false
                })
        });

        /* Shuffle the answer choices */
        answerChoices = getRandomSubarray(answerChoices, answerChoices.length);

        questionsList.push({
            titles: answerChoices,
            highlightText: quoteText,
            highlightColor: highlightColor
        });

        console.log(questionsList)
    }


    return questionsList;

}


function hasMoreQuotes(bookQuotesList, clusterByTitle) {
    if (clusterByTitle) {
        const len = bookQuotesList.length;
        var found = false;
        for (var i = 0; i < len; i++) { /* Each obj represents the quotes for one particular book */
            console.log(bookQuotesList[i].quotes)
            if (bookQuotesList[i].quotes.length !== 0 ) {
                found = true;
                console.log("set found to true")
                break;
            }
        }
        console.log("found = " + found);
        return found;
    } else {
        return bookQuotesList.length !== 0;
    }
}

/* Copied from https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array */
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}


