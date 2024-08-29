import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QuizLocalStorage } from "../../api/storage/local/QuizLocalStorage";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Collapse } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import HighlightBox from "../../Components/HighlightBox";

const quotesList = QuizLocalStorage.getCachedQuotesList();

console.log(quotesList)

export const BookDetails = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bookTitle = queryParams.get('title');

    const bookQuotes = quotesList.find(bookGroup => bookGroup.title === bookTitle)?.quotes;

    console.log(bookQuotes)

    const [ showQuotesList, setShowQuotesList ] = useState(false);

    function handleClickViewQuotes() {
        setShowQuotesList(prev => !prev);
    }

    return (
        <div>
            <p><a href={"/browse"}>Back to browse</a></p>
            <h1>{bookTitle}</h1>

            <div >
                <ListItem button onClick={() => handleClickViewQuotes()}>
                    <ListItemText primary={'View quotes'}/>

                </ListItem>

                <Collapse in={showQuotesList}>
                    {

                            bookQuotes && bookQuotes.map((quoteObject) => {
                                return <div>
                                    <HighlightBox  style={{margin: 10}} highlightedQuote={quoteObject} showDate showBookLink/>
                                    <Divider style={{backgroundColor: "white"}}/>
                                </div>
                            })



                    }
                </Collapse>
            </div>


        </div>
    )
}