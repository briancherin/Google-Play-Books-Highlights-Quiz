import React, { useState, useRef } from 'react';
import { Card, CardContent, Grid, Button, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import NoteIcon from '@material-ui/icons/Note';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import BookLink from './BookLink';


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

const SHOW_DATE = "Show date";

export default function GameCard(props) {

    const classes = useStyles();

    const scrollRef = useRef(null);

    const { shouldShowAnswer, incorrectAnswersSelected } = props;

    const [ dateText, setDateText ] = useState(SHOW_DATE)

    const [ isFavorited, setIsFavorited ] = useState(false);

    const resetDateText = () => {
        setDateText(SHOW_DATE)
    }

    const resetScrollbar = () => {
        scrollRef.current.scrollTop = 0;
    }

    const handleFavoriteClick = () => {
        setIsFavorited(!isFavorited);
        //TODO: Actually save or unsave
    }


    return(
        <Card className={classes.mainCard} style={{height:"100%", display:"inline-block"}}>
            <CardContent>

                <Grid container direction="column" >

                    {/* Question area */}
                    <Grid item>
                        <div >
                        <Typography ref={scrollRef} variant="h5" style={{padding:"15px", height:"25vh", overflow:"auto", backgroundColor: props.highlightColor}}>
                            {props.highlightMessage}
                            <br/>
                            <Grid container style={{paddingTop:"10px"}}>
                                <Grid item style={{flex: 1}}>
                                    <Typography style={{fontSize: 14, fontStyle: "italic", cursor: "pointer"}} onClick={() => setDateText(props.highlightDate)}>{dateText}</Typography> 
                                </Grid>
                                <Grid item>
                                    <Tooltip title={isFavorited ? "Remove from favorites" : "Save in favorites"}>
                                       <IconButton disableRipple onClick={()=>handleFavoriteClick()}>
                                        { isFavorited 
                                        ? <StarIcon />
                                        : <StarBorderIcon />
                                        }
                                        
                                    </IconButton> 
                                    </Tooltip>
                                    
                                    {props.highlightNotes !== "" && props.highlightNotes !== undefined ?
                                        <Tooltip  interactive title={props.highlightNotes}>
                                            <IconButton disableRipple >
                                                <NoteIcon style={{fill:"#42a5f5"}}/>
                                            </IconButton>
                                        </Tooltip>
                                    : null
                                    }
                                    
                                </Grid>
                            </Grid>

                        </Typography>
                        </div>
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


              
                
            </CardContent>
        </Card>
    );
}