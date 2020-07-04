import cheerio from 'cheerio';
import { authenticateApi, getFilesInFolder, loadApi, getAllFilesHtml } from './gdrive';
import { QuizLocalStorage } from './QuizLocalStorage';
import { HighlightedQuote } from "../models/HighlightedQuote";
import { FavoritesLocalStorage } from "./FavoritesLocalStorage";

var bookTitles = [];

export function initializeDriveApi() {
    loadApi();
}


export function getTitlesList() { //TODO: This seems bad?
    return bookTitles;
}

/* Get the quotes from Google Drive */
export async function getQuotesList(authObject, callbackUpdateProgress) {

    return new Promise(async (resolve, reject) => {
        
        await authenticateApi(authObject);

        let quotesList = [];

        let bookFiles = await getFilesInFolder("Play Books Notes");

        /* USING ONLY A (random) PORTION OF BOOKFILES FOR TESTING */
        const maxFiles = bookFiles.length;
        if (maxFiles !== bookFiles.length) bookFiles = bookFiles.sort(() => Math.random() - Math.random()).slice(0, maxFiles);

        const htmlList = await getAllFilesHtml(bookFiles, (progress) => { //Progress is a number from 0 to 10
            callbackUpdateProgress(progress); /* Update the progress bar */
        });

        for (let i = 0; i < htmlList.length; i++) {
            const bookHtml = htmlList[i].html;

            /* Parse the html for this file and extract the list of quotes */
            const bookQuotes = getQuotesListFromHTML(bookHtml); //All the quotes for this particular book

            if (bookQuotes.length > 0) {

                /* SAVE BOOK TITLE IN LIST FOR FUTURE USE */
                const bookTitle = bookQuotes[0].bookTitle
                bookTitles.push(bookTitle)

                //Add all the quotes from this book to the overall list of quotes (clustered by book)
                quotesList.push({
                    title: bookTitle,   //Mark each quote as belonging to this particular book
                    quotes: bookQuotes
                })
            }    
        }

        QuizLocalStorage.saveCachedQuotesList(quotesList); // Cache the quotesList for next time
        QuizLocalStorage.saveCachedTitlesList(bookTitles);

        resolve(quotesList);
    });
}


/* @param html: html of a single file in the Play Books Notes folder */
export function getQuotesListFromHTML(html) {
    
    const $ = cheerio.load(html);

    const title = $('body').find('table > tbody > tr > td > h1 > span').text();

    let quotes = [];
    

     $('body').find('table > tbody > tr > td > table > tbody > tr > td > p > span[style*="background-color"]')
        .each((index, element)=> {
            const text = $(element).text();
            const highlightColor = getHighlightColor($(element).attr("style"))
            const highlightNotes = getHighlightNotes($(element).parent()[0].parent)
            const dateHighlighted = getHighlightDate($(element).parent()[0].parent)
            console.log($(element))
            const bookLink = $(element).parent().parent().parent().parent().parent().find('td[colspan="1"] > p > span > a').attr("href")
            if (text !== "") {
                quotes.push(new HighlightedQuote(
                    text,
                    highlightColor,
                    highlightNotes,
                    dateHighlighted,
                    bookLink,
                    title,
                    FavoritesLocalStorage.quoteIsFavorited(text), // TODO: Change to entire quote object (or however quotes should be compared)
                ));
            }
        });

    return quotes;

}

function getHighlightColor(styleText) {
    const attr = "background-color:";
    const i = styleText.indexOf(attr);
    const color = styleText.substring(i + attr.length, i + attr.length + 7);

    return color;
}

/* Parent node is the <td> element which contains the highlight message, 
    any possible notes, and the date of the highlight */
function getHighlightNotes(parentNode) {
    var children = parentNode.children;

    var notes = "";

    //Highlighted quote is in children[0]

    if (children.length >= 5) {
        notes += children[2].firstChild.firstChild.data

    }

    


    return notes;
}

/* Parent node is the <td> element which contains the highlight message, 
    any possible notes, and the date of the highlight */
function getHighlightDate(parentNode) {
    var children = parentNode.children;

    if (children.length >= 2) {
        if (children.length < 5) { // No highlight note
            return children[2].firstChild.firstChild.data;
        } else {
            return children[4].firstChild.firstChild.data;
        }
    }

}