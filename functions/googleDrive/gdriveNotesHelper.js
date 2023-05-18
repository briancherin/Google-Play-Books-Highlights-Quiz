const cheerio = require('cheerio')

/* Get the quotes from Google Drive */
// driveApi param is instance of GoogleDriveApi class
async function getQuotesList(driveApi, callbackUpdateProgress) {

    return new Promise(async (resolve, reject) => {

        let quotesList = [];

        let bookFiles = await driveApi.getFilesInFolder("Play Books Notes");

        /* USING ONLY A (random) PORTION OF BOOKFILES FOR TESTING */
        const maxFiles = 5//bookFiles.length;
        if (maxFiles !== bookFiles.length) bookFiles = bookFiles.sort(() => Math.random() - Math.random()).slice(0, maxFiles);

        const htmlList = await driveApi.getAllFilesHtml(bookFiles, (progress) => { //Progress is a number from 0 to 10
            callbackUpdateProgress(progress); /* Update the progress bar */
        });

        for (let i = 0; i < htmlList.length; i++) {
            const bookHtml = htmlList[i].html;

            /* Parse the html for this file and extract the list of quotes */
            const bookQuotes = getQuotesListFromHTML(bookHtml); //All the quotes for this particular book

            if (bookQuotes.length > 0) {

                /* SAVE BOOK TITLE IN LIST FOR FUTURE USE */
                const bookTitle = bookQuotes[0].bookTitle

                //Add all the quotes from this book to the overall list of quotes (clustered by book)
                quotesList.push({
                    title: bookTitle,   //Mark each quote as belonging to this particular book
                    quotes: bookQuotes
                })
            }    
        }
        resolve(quotesList);
    });
}


/* @param html: html of a single file in the Play Books Notes folder */
function getQuotesListFromHTML(html) {
    
    const $ = cheerio.load(html);

    const title = $('body').find('table > tbody > tr > td > h1 > span').text();

    let quotes = [];
    

     $('body').find('table > tbody > tr > td > table > tbody > tr > td > p > span[style*="background-color"]')
        .each((index, element)=> {
            const text = $(element).text();
            const highlightColor = getHighlightColor($(element).attr("style"))
            const highlightNotes = getHighlightNotes($(element).parent()[0].parent)
            const dateHighlighted = getHighlightDate($(element).parent()[0].parent)

            const bookLink = $(element).parent().parent().parent().parent().parent().find('td[colspan="1"] > p > span > a').attr("href")
            if (text !== "") {
                quotes.push(new HighlightedQuote(
                    text,
                    highlightColor,
                    highlightNotes,
                    dateHighlighted,
                    bookLink,
                    title,
                    false, // TODO: how to handle favorites???
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

class HighlightedQuote {

    constructor(quoteText, highlightColor, highlightNotes, dateHighlighted, bookLink, bookTitle, quoteIsFavorited) {
        this.quoteText = quoteText;
        this.highlightColor = highlightColor;
        this.highlightNotes = highlightNotes;
        this.dateHighlighted = dateHighlighted;
        this.bookLink = bookLink;
        this.bookTitle = bookTitle;
        this.quoteIsFavorited = quoteIsFavorited;
    }

    static fromJson(obj) {
        return new HighlightedQuote(
            obj.quoteText,
            obj.highlightColor,
            obj.highlightNotes,
            obj.dateHighlighted,
            obj.bookLink,
            obj.bookTitle,
            obj.quoteIsFavorited
        );
    }

}


module.exports = {
    getQuotesList
}