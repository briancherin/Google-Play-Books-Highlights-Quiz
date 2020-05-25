import { initializeDriveApi, getQuotesList, getTitlesList } from "./gdriveNotesHelper";

export async function getQuestionsListFromDrive(driveAuthObject, maxQuestions, callbackUpdateProgress) {
    initializeDriveApi();

    const bookQuotesList = await getQuotesList(driveAuthObject, callbackUpdateProgress);
    const bookTitles = getTitlesList();



    let questionsList = [];

    for (var i = 0; hasMoreQuotes(bookQuotesList) && i < maxQuestions; i++) {
        // Pick a random title from all possible titles
        var randTitleIndex = Math.floor(Math.random() * bookQuotesList.length);
        var randomBookObject = bookQuotesList[randTitleIndex];


        // Pick a random quote from this title
        const randQuoteIndex = Math.floor(Math.random() * randomBookObject.quotes.length);
        const randomQuoteObject = randomBookObject.quotes[randQuoteIndex]; // This will be the quote selected

        randomBookObject.quotes.splice(randQuoteIndex, 1); // Delete the selected quote from the original list (Prevent future repeat)

        if (randomBookObject.quotes.length === 0) { // If used all the quotes for this book
            bookQuotesList.splice(randTitleIndex, 1); // Delete this title from the possible choices
        }
            

        const { bookTitle, quoteText, highlightColor, highlightNotes, highlightDate, bookLink } = randomQuoteObject;
        
        let answerChoices = generateAnswerChoices(bookTitle, bookTitles);


        questionsList.push({
            titles: answerChoices,
            highlightText: quoteText,
            highlightColor: highlightColor,
            highlightNotes: highlightNotes,
            highlightDate: highlightDate,
            bookLink: bookLink
        });

    }


    return questionsList;

}

function generateAnswerChoices(correctTitle, titlesList) {
    let answerChoices = [];

    //Add the correct answer choice to the list of answer choices
    answerChoices.push({
        title: correctTitle,
        isCorrectAnswerChoice: true
    });

    /* Get three other random book titles */
    getRandomSubarray(titlesList.filter((title) => title !== correctTitle), 3)
    .forEach((title) => {
        answerChoices.push({
            title: title,
            isCorrectAnswerChoice: false
        })
    });

    /* Shuffle the answer choices */
    answerChoices = getRandomSubarray(answerChoices, answerChoices.length);

    return answerChoices;
}


function hasMoreQuotes(bookQuotesList) {
        const len = bookQuotesList.length;
        var found = false;
        for (var i = 0; i < len; i++) { /* Each obj represents the quotes for one particular book */
            if (bookQuotesList[i].quotes.length !== 0 ) {
                found = true;
                break;
            }
        }
        return found;
    
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


