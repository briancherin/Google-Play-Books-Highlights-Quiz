import React from 'react';
import { Card, CardContent, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';


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

    return(
        <Card className={classes.mainCard}>
            <CardContent>

                <Grid container direction="column">

                    {/* Question area */}
                    <Grid item>
                        <Typography variant="h5" style={{padding:"15px"}}>
                            <mark>{props.highlightMessage}</mark>
                        </Typography>
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
                                <Grid item key={title}>
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
                                onClick={() => props.handleNextQuestion()}
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