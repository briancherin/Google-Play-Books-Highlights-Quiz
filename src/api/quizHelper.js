import { initializeDriveApi, getQuotesList, getTitlesList } from "./gdriveNotesHelper";

export async function getQuestionsListFromDrive(driveAuthObject, maxQuestions) {
    initializeDriveApi();

    const bookQuotesList = await getQuotesList(driveAuthObject);
    const bookTitles = await getTitlesList();



    let questionsList = [];

    for (var i = 0; i < bookQuotesList.length && i < maxQuestions; i++) {
        const randIndex = Math.floor(Math.random() * bookQuotesList.length);
        const randomQuoteObject = bookQuotesList[randIndex];
        bookQuotesList.splice(randIndex, 1); /* Don't repeat this quote in the future */

        const { bookTitle, quoteText } = randomQuoteObject;

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
            highlightText: quoteText
        });
    }


    return questionsList;

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

var x = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var fiveRandomMembers = getRandomSubarray(x, 5);