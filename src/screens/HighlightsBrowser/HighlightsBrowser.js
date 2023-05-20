import React, { useState } from 'react';
import { QuizLocalStorage } from "../../api/storage/local/QuizLocalStorage";
import { Collapse, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import { HighlightedQuote } from "../../models/HighlightedQuote";
import ListItemText from "@material-ui/core/ListItemText";
import HighlightBox from "../../Components/HighlightBox";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AppHeader from "../../Components/AppHeader";
import { makeStyles } from "@material-ui/core/styles";
// import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles({
    mainContainer: {
        // backgroundColor: "#e3f2fd",
        // background: "rgb(144,202,249) linear-gradient(180deg, rgba(144,202,249,1) 20%, rgba(227,242,253,1) 100%)",
        height: "100vh",
    }
});


const quotesList = QuizLocalStorage.getCachedQuotesList();

const itemsPerPage = 10;

// const paginationArray = new Array(numPages);
const paginationArray = [1,2,3]

export const HighlightsBrowser = () => {

    const classes = useStyles();

    const [ currPage, setCurrPage ] = useState(1);
    const [ collapseList, setCollapseList ] = useState({});
    const [ searchText, setSearchText ] = useState("");

    const handleClick = (index) => {
        const copy = {...collapseList};
        if (!(index in collapseList)) {
            copy[index] = true;
        } else {
            copy[index] = !copy[index];
        }
        setCollapseList(copy);
    }

    const handlePaginationChange = (event, value) => {
        setCollapseList({});
        setCurrPage(value);
    }

    const handleSearch = (event) => {
        setCurrPage(1);
        setSearchText(event.target.value);
    }

    const filteredQuotesList = searchText !== ""
        ? quotesList.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()))
        : quotesList;

    const numPages = Math.ceil(filteredQuotesList.length / itemsPerPage);

    return (
        <Grid container direction="column" wrap="nowrap" className={classes.mainContainer}>

            <Grid item container>

            <Grid item xs={false} sm={2} lg={4}/>


            <AppHeader/>


            <Grid item xs={false} sm={2} lg={2}/>

            <Grid item xs={12} sm={8} lg={8}>
                <TextField
                    value={searchText}
                    onChange={handleSearch}
                    label={"Search for book title"}
                />
                <List>
                    {
                        filteredQuotesList
                            .slice((currPage - 1) * itemsPerPage, currPage*itemsPerPage)
                            .map((bookGroup, index) => {
                                const { title, quotes} = bookGroup;
                                return (
                                    <div key={index}>
                                        <Divider />
                                        <ListItem button onClick={() => handleClick(index)}>
                                            <ListItemText primary={title}/>
                                        </ListItem>
                                        <Collapse in={collapseList[index]}>
                                            {
                                                quotes.map((quoteJson, index2) => {
                                                    const quoteObject = HighlightedQuote.fromJson(quoteJson);
                                                    // return <ListItem key={index2}>{quoteObject.quoteText}</ListItem>
                                                    return <div>
                                                        <HighlightBox key={index2} style={{margin: 10}} highlightedQuote={quoteObject} showDate showBookLink/>
                                                        <Divider style={{backgroundColor: "white"}}/>
                                                    </div>
                                                })
                                            }
                                        </Collapse>
                                    </div>
                                );
                        })

                    }
                </List>
                <Divider />
                <Box component={"span"}>
                    {
                        Array.from({length: numPages}, (val, index) => {
                            console.log("HI")
                            return(
                                <Button key={index} onClick={()=>handlePaginationChange(null, index+1)}>{index+1}</Button>
                            )
                        })
                    }

                    {/*<Pagination
                        count={numPages}
                        page={currPage}
                        onChange={handlePaginationChange}
                        defaultPage={1}
                        showFirstButton
                        showLastButton
                    />*/}
                </Box>
            </Grid>

            <Grid item xs={false} sm={2} lg={2}/>

            </Grid>

        </Grid>


    );
};