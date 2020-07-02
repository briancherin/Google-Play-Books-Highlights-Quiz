import React, { useState, useRef } from 'react';
import { Card, CardContent, Grid, Button, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import BookLink from './BookLink';
import GenericCard from './GenericCard';
import HighlightBox from "./HighlightBox";


const useStyles = makeStyles({
    mainCard: {
        // padding: "15px"
    },
    answerChoice: {
        textTransform: "none",
        paddingTop: "5px",
        paddingBottom: "5px",
        paddingLeft: "10px",
    },
    correctAnswerChoice: {
        color: "green",
        // fontWeight: "bold"
    },
    incorrectSelection: {
        color: "red",
        textDecoration: "line-through"
    },
    incorrectAnswerIcon: {
        fill: "red"
    }


});


export default function GameCard(props) {

    const classes = useStyles();


    const { shouldShowAnswer, incorrectAnswersSelected } = props;
    const [ showDate, setShowDate ] = useState(false);

    const resetDateText = () => {
        setShowDate(false)
    }

    const scrollRef = useRef(null);

    const resetScrollbar = () => {
        scrollRef.current.scrollTop = 0;
    }

    return(
        <GenericCard>

                <Grid container direction="column" >

                    {/* Question area */}
                    <Grid item>
                        <HighlightBox
                            containerHeight={"25vh"}
                            scrollRef={scrollRef}
                            highlightColor={props.highlightColor}
                            highlightMessage={props.highlightMessage}
                            highlightNotes={props.highlightNotes}
                            bookLink={props.bookLink}
                            highlightDate={props.highlightDate}
                            showDate={showDate}
                            isFavorited={props.isFavorited}
                            toggleDate={() => setShowDate(!showDate)}
                            updateFavorites={props.updateFavorites}
                        />
                    </Grid>

                    {/* Answer choices area */}
                    <Grid item style={{paddingTop: "5%"}}>
                        {props.possibleTitles ? props.possibleTitles.map(answerChoice => {

                            const { title, isCorrectAnswerChoice, showIncorrectSelection } = answerChoice;
                            /* Classes to apply to each answer choice text */
                            const answerClasses = classNames({
                                [classes.answerChoice]: true,
                                [classes.correctAnswerChoice]: isCorrectAnswerChoice && shouldShowAnswer,
                                [classes.incorrectSelection]: incorrectAnswersSelected.includes(title)
                            });

                            const answerIconClasses = classNames({
                                [classes.incorrectAnswerIcon]: incorrectAnswersSelected.includes(title)
                            })

                            return(
                                <Grid container key={title}>
                                    {/* Answer choice */}
                                    <Grid item style={{flex:1}}>
                                        <Button disableRipple fullWidth={true} style={{justifyContent:"start"}}
                                            onClick={() => props.handleAnswerSelection(title)}>
                                            
                                            {/* Circle icon */}
                                            {(isCorrectAnswerChoice && shouldShowAnswer) 
                                                ? <FiberManualRecordIcon style={{fill:"green"}}/> 
                                                :
                                                    (incorrectAnswersSelected.includes(title))
                                                    ?
                                                        <FiberManualRecordIcon style={{fill:"red"}}/>
                                                    : <FiberManualRecordOutlinedIcon />
                                            }
        
                                            {/* Answer choice text */}
                                            <Typography  className={answerClasses} align="left">
                                                {title}
                                            </Typography>
                                                
                                        </Button>
                                    </Grid>
                                    {/* Link to highlight Play Books */}
                                    <Grid item>
                                        {(isCorrectAnswerChoice && shouldShowAnswer) 
                                            ? <BookLink url={props.bookLink} />
                                            : null
                                            }
                                    </Grid>
                                </Grid>
                            );
                        }) : null}
                    </Grid>
                    
                    {/* Bottom menu area */}
                    {shouldShowAnswer ? (
                        <Grid container style={{paddingTop:"20px", paddingLeft:"10px"}}>
                            <Typography style={{flex:1}}>
                                Good job!
                            </Typography>
                            <Button disableRipple variant="contained" style={{textTransform:"none"}}
                                onClick={() => {
                                    props.handleNextQuestion();
                                    resetDateText();
                                    resetScrollbar();
                                }}
                            >
                                <Typography>Next Question</Typography>
                            </Button>
                        </Grid>
                    )
                    : null}
                    


                </Grid>


              
                
        </GenericCard>
    );
}