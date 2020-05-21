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

export async function getQuotesList(authObject, clusterByTitle, callbackUpdateProgress) {

    return new Promise(async (resolve, reject) => {
        
        await authenticateApi(authObject);

        var quotesList = [];

        const bookFiles = await getFilesInFolder("Play Books Notes");

        const htmlList = await getAllFilesHtml(bookFiles);
        console.log("HTMLLIST:")
        console.log(htmlList);
        


        for (let i = 0; i < htmlList.length; i++) {
            const bookHtml = htmlList[i].html;
            const bookTitle = htmlList[i].name.substring(12, htmlList[i].name.length-1).trim();

            /* SAVE BOOK TITLE IN LIST FOR FUTURE USE */
            bookTitles.push(bookTitle);

            const bookQuotes = getQuotesListFromHTML(bookHtml);
            console.log("p2")

            const quotesObjectList = [];
            bookQuotes.forEach((quote) => {
                quotesObjectList.push({
                    bookTitle: bookTitle,
                    quoteText: quote.quoteText,
                    highlightColor: quote.highlightColor,
                    highlightNotes: quote.highlightNotes,
                    highlightDate: quote.highlightDate
                })
            });
            console.log("p3")

            console.log(`${i + 1} out of ${htmlList.length}`);
            callbackUpdateProgress((i + 1) / htmlList.length * 100);

            // Prevent rate limit from being exceeded:
            //await new Promise(resolve => setTimeout(resolve, 0.2));
            console.log("p4")


            if (clusterByTitle) {

                quotesList.push({
                    title: bookTitle,
                    quotes: quotesObjectList
                })
            } else {
                bookQuotes.forEach((quote) => {
                    quotesList.push({
                        bookTitle: bookTitle,
                        quoteText: quote.quoteText,
                        highlightColor: quote.highlightColor,
                        highlightNotes: quote.highlightNotes,
                        highlightDate: quote.highlightDate
                    });
                });
            }
          
            console.log("p5 (end)")
             
        }

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
            if (text !== "") {
                quotes.push({
                    quoteText: text,
                    highlightColor: highlightColor,
                    highlightNotes: highlightNotes,
                    highlightDate: highlightDate
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