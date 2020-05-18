import React, { useState, useEffect } from 'react';
import './App.css';
import GameCard from './Components/GameCard';
import AppHeader from './Components/AppHeader';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getQuestionsListFromDrive } from './api/quizHelper';

const useStyles = makeStyles({
  mainContainer: {
    backgroundColor: "#e3f2fd",
    background: "rgb(144,202,249) linear-gradient(180deg, rgba(144,202,249,1) 20%, rgba(227,242,253,1) 100%)",
    height: "100vh",
  }
});
/*
 var questionsList = [{
   
    titles: [
    {title: "Harry Potter and the Sorcerer's Stone",
    isCorrectAnswerChoice: true}, 
    {title: "Don't Sleep, There Are Snakes",
    isCorrectAnswerChoice: false}, 
    {title: "Foundation and Earth",
    isCorrectAnswerChoice: false}, 
    {title: "Tuesdays With Morrie",
    isCorrectAnswerChoice: false}
  ],
  highlightText: "One can never have enough socks"},
  highlightColor: "yellow"
  ,
  {titles: [
  {title: "2 Harry Potter and the Sorcerer's Stone",
  isCorrectAnswerChoice: true}, 
  {title: "2 Don't Sleep, There Are Snakes",
  isCorrectAnswerChoice: false}, 
  {title: "2 Foundation and Earth",
  isCorrectAnswerChoice: false}, 
  {title: "2 Tuesdays With Morrie",
  isCorrectAnswerChoice: false}

],
  highlightText: "Uno nunca tiene suficiente calcetines"
},


]; 
*/
var questionsList = [];

function App() {

  const [ correctTitle, setCorrectTitle ] = useState(""); //Change to "" when done testing
  const [ currQuestionIndex, setCurrQuestionIndex ] = useState(-1);
  const [ shouldShowAnswer, setShouldShowAnswer ] = useState(false);
  const [ correctAnswerSelected, setCorrectAnswerSelected ] = useState(false);
  const [ incorrectAnswersSelected, setIncorrectAnswersSelected ] = useState([]);

  const classes = useStyles();


  const handleAnswerSelection = (selectedTitle) => {
    if (selectedTitle === correctTitle) {
      setShouldShowAnswer(true);
      setCorrectAnswerSelected(true);
    } else {
      setIncorrectAnswersSelected(incorrectAnswersSelected => [...incorrectAnswersSelected, selectedTitle]);
    }
  }

  /* Respones to Google sign in */
  const authResponseHandler = async (authObject) => {
      questionsList = await getQuestionsListFromDrive(authObject, 30, true);
      startQuiz();
  }

  const startQuiz = () => {
    console.log(questionsList)
    if (questionsList.length > 0) {
      setCurrQuestionIndex(0);
      setCorrectTitle(questionsList[0].titles.filter((title) => title.isCorrectAnswerChoice)[0].title);
    }
  }

  const resetQuizState = () => {
    setShouldShowAnswer(false);
    setCorrectAnswerSelected(false);
    setIncorrectAnswersSelected([]);
  }

  const showNextQuestion = () => {

    const nextQuestionIndex = currQuestionIndex + 1;

    if (nextQuestionIndex < questionsList.length) {

      resetQuizState();

      setCurrQuestionIndex(nextQuestionIndex);
      setCorrectTitle(questionsList[nextQuestionIndex].titles.filter((title) => title.isCorrectAnswerChoice)[0].title);
    } else {
      //TODO: Show no_more_questions message
    }
  }


  return (
    //nowrap: Prevent container from shifting to the side when js console is open or when text is long
    <Grid container direction="column" wrap="nowrap" className={classes.mainContainer}>
      <Grid item>
        <AppHeader authResponseHandler={authResponseHandler}/>
      </Grid>
      
      <Grid item container style={{paddingTop:"5%"}}>
        <Grid item xs={false} sm={2} lg={4}/>
        <Grid item xs={12} sm={8} lg={4}>
          {questionsList.length > 0 && currQuestionIndex >= 0 ? 
            <GameCard 
            highlightMessage={questionsList[currQuestionIndex].highlightText}
            highlightColor={questionsList[currQuestionIndex].highlightColor}
            shouldShowAnswer={shouldShowAnswer}
            handleAnswerSelection={handleAnswerSelection}
            handleNextQuestion={showNextQuestion}
            incorrectAnswersSelected={incorrectAnswersSelected}
            possibleTitles={questionsList[currQuestionIndex].titles}
          />
          : 
          <GameCard
            highlightMessage={"There are no Google Play Books notes in your account."}
            highlightColor={"yellow"}
            shouldShowAnswer={shouldShowAnswer}
            incorrectAnswersSelected={incorrectAnswersSelected}
            possibleTitles={[]}
          />
          }
          
        </Grid>
        <Grid item xs={false} sm={2} lg={4}/>

      </Grid>

    </Grid>
  );
}

export default App;
