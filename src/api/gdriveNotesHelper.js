import cheerio from 'cheerio';
import { authenticateApi, getFilesInFolder, getFileHtml, loadApi, getAllFilesHtml } from './gdrive';

var bookTitles = [];

export function initializeDriveApi() {
    loadApi();
}

export function getTitlesList() {
    if (bookTitles.length !== 0) {
        return bookTitles;
    } else {

    }
}

export async function getQuotesList(authObject, callbackUpdateProgress) {

    return new Promise(async (resolve, reject) => {
        
        await authenticateApi(authObject);

        var quotesList = [];

        let bookFiles = await getFilesInFolder("Play Books Notes");

        /* USING ONLY A (random) PORTION OF BOOKFILES FOR TESTING */
        const maxFiles = bookFiles.length;
        if (maxFiles !== bookFiles.length) bookFiles = bookFiles.sort(() => Math.random() - Math.random()).slice(0, maxFiles);

        const htmlList = await getAllFilesHtml(bookFiles, (progress) => { //Progress is a number from 0 to 10
            callbackUpdateProgress(progress);
        });
        console.log("HTMLLIST:")
        console.log(htmlList);
        


        for (let i = 0; i < htmlList.length; i++) {
            const bookHtml = htmlList[i].html;
            const bookTitle = htmlList[i].name.substring(12, htmlList[i].name.length-1).trim();

            /* SAVE BOOK TITLE IN LIST FOR FUTURE USE */
            bookTitles.push(bookTitle);

            const bookQuotes = getQuotesListFromHTML(bookHtml);

            const quotesObjectList = [];
            bookQuotes.forEach((quote) => {
                quotesObjectList.push({
                    bookTitle: bookTitle,
                    quoteText: quote.quoteText,
                    highlightColor: quote.highlightColor,
                    highlightNotes: quote.highlightNotes,
                    highlightDate: quote.highlightDate,
                    bookLink: quote.bookLink
                })
            });



            quotesList.push({
                title: bookTitle,
                quotes: quotesObjectList
            })
            
             
        }
        console.log(quotesList)

        resolve(quotesList);

    })
    
}

/* @param html: html of a single file in the Play Books Notes folder */
export function getQuotesListFromHTML(html) {
    
    const $ = cheerio.load(html);

    let quotes = [];
    

     $('body').find('table > tbody > tr > td > table > tbody > tr > td > p > span[style*="background-color"]')
        .each((index, element)=> {
            const text = $(element).text();
            const highlightColor = getHighlightColor($(element).attr("style"))
            const highlightNotes = getHighlightNotes($(element).parent()[0].parent)
            const highlightDate = getHighlightDate($(element).parent()[0].parent)
            const bookLink = $(element).parent().parent().parent().parent().parent().find('td[colspan="1"] > p > span > a').attr("href")
            if (text !== "") {
                quotes.push({
                    quoteText: text,
                    highlightColor: highlightColor,
                    highlightNotes: highlightNotes,
                    highlightDate: highlightDate,
                    bookLink: bookLink
                });
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