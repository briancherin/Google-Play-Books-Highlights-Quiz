import cheerio from 'cheerio';
import { authenticateApi, getFilesInFolder, getFileHtml, loadApi } from './gdrive';

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

export async function getQuotesList(authObject, clusterByTitle) {

    return new Promise(async (resolve, reject) => {
        
        await authenticateApi(authObject);

        var quotesList = [];

        const bookFiles = await getFilesInFolder("Play Books Notes");

        

        const numBooksToGet = 0; /* Will be sorted by most recent. maybe. */

        for (let i = 0; i < numBooksToGet; i++) {
            const file = bookFiles[i];
            const bookHtml = await getFileHtml(file.id);

            const bookTitle = file.name.substring(12, file.name.length-1);

            /* SAVE BOOK TITLE IN LIST FOR FUTURE USE */
            bookTitles.push(bookTitle);

            const bookQuotes = getQuotesListFromHTML(bookHtml);

            const quotesObjectList = [];
            bookQuotes.forEach((quote) => {
                quotesObjectList.push({
                    bookTitle: bookTitle,
                    quoteText: quote
                })
            });

            console.log(`${i + 1} out of ${numBooksToGet}`)

            // Prevent rate limit from being exceeded:
            await new Promise(resolve => setTimeout(resolve, 0.2));


            if (clusterByTitle) {

                quotesList.push({
                    title: bookTitle,
                    quotes: quotesObjectList
                })
            } else {
                bookQuotes.forEach((quote) => {
                    quotesList.push({
                        bookTitle: file.name,
                        quoteText: quote
                    });
                });
            }
          
             
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
            if (text !== "") {
                quotes.push(text);
            }
        });

    return quotes;

}