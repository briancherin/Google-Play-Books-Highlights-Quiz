import { initializeDriveApi, getTitlesList } from "./googleDrive/gdriveNotesHelper";
import { QuizLocalStorage } from "./storage/local/QuizLocalStorage";
import { getQuotesList } from "./storage/firebase/QuotesFirebaseStorage";

export async function getQuestionsListFromDrive(driveAuthObject, maxQuestions, callbackUpdateProgress) {
    //initializeDriveApi();

    // const bookQuotesList = await getQuotesList(driveAuthObject, callbackUpdateProgress);
    const bookQuotesList = await getQuotesList();
    const bookTitles = getTitlesList();

    return generateQuestionsList(bookQuotesList, maxQuestions, bookTitles);
}

export function getQuestionsFromCachedQuotes(maxQuestions) {
    const bookQuotesList = QuizLocalStorage.getCachedQuotesList();
    const bookTitles = QuizLocalStorage.getCachedTitlesList();

    if (bookQuotesList !== undefined && bookTitles !== undefined) {
        return generateQuestionsList(bookQuotesList, maxQuestions, bookTitles);
    } else {
        return undefined;
    }
}

function generateQuestionsList(bookQuotesList, maxQuestions, bookTitles) {
    let questionsList = [];

    /* Form the questions and answer choices, and add them to the list */
    for (var i = 0; hasMoreQuotes(bookQuotesList) && i < maxQuestions; i++) {
        
        /* Select a random quote */
        const randomQuoteObject = selectRandomQuote(bookQuotesList);

        const { bookTitle, quoteText, highlightColor, highlightNotes, dateHighlighted, bookLink } = randomQuoteObject;
        
        /* Generate the other answer choices */
        let answerChoices = generateAnswerChoices(bookTitle, bookTitles);

        /* Add this question to the overall list */
        questionsList.push({
            titles: answerChoices,
            highlightedQuote: randomQuoteObject,
            correctAnswerTitle: bookTitle
        });

    }


    return questionsList;
}

/* Selects a random quote. Removes the selected quote from the overall list of quotes, to prevent repeats. */
function selectRandomQuote(bookQuotesList) {
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

    return randomQuoteObject;
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


