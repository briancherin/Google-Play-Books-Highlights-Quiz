import React, { useState } from 'react';
import './App.css';
import GameCard from './Components/GameCard';
import AppHeader from './Components/AppHeader';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getQuestionsListFromDrive, getQuestionsFromCachedQuotes } from './api/quizHelper';
import ProgressCard from './Components/ProgressCard';
import GenericCard from './Components/GenericCard';
import GoogleAuthButton from './Components/GoogleAuthButton';

const useStyles = makeStyles({
  mainContainer: {
    backgroundColor: "#e3f2fd",
    background: "rgb(144,202,249) linear-gradient(180deg, rgba(144,202,249,1) 20%, rgba(227,242,253,1) 100%)",
    height: "100vh",
  }
});

const DEBUG_MODE = false;

if (DEBUG_MODE) {
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
  correctAnswerTitle: "Harry Potter and the Sorcerer's Stone",
  highlightText: "One can never have enough socks. One can never have enough socksOne can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. . One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. ",
  highlightColor: "yellow",
  highlightNotes: "lalalala",
  highlightDate: "January 1, 2022",
  bookLink: "book.com/page",
  }
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
}
if (!DEBUG_MODE) {
  var questionsList = [];
}

questionsList = getQuestionsFromCachedQuotes(50);
console.log(questionsList)

function App() {
  const [ loadingProgress, setLoadingProgress ] = useState(-1);

  const [ quizShouldStart, setQuizShouldStart ] = useState(false);

  const [ currQuestionIndex, setCurrQuestionIndex ] = useState(0);
  const [ shouldShowAnswer, setShouldShowAnswer ] = useState(false);
  const [ incorrectAnswersSelected, setIncorrectAnswersSelected ] = useState([]);

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  const classes = useStyles();



  const handleAnswerSelection = (selectedTitle) => {
    // if (selectedTitle === correctTitle) {
    if (selectedTitle === questionsList[currQuestionIndex].correctAnswerTitle) {
      setShouldShowAnswer(true);
    } else {
      setIncorrectAnswersSelected(incorrectAnswersSelected => [...incorrectAnswersSelected, selectedTitle]);
    }
  }

  const updateLoadingProgress = (progress) => {
    setLoadingProgress(progress);
  }

  const clearQuizScreen = () => { //For when deleting the cached highlights. Question on screen should go away.
    questionsList = []; 
    resetQuizState();
    setQuizShouldStart(false);
    setIsLoggedIn(false);
  }

  const showImportScreen = () => {
    clearQuizScreen();
  }


  /* Respones to Google sign in */
  /* Upon Google sign in, pull the quotes from google drive */
  const authResponseHandler = async (authObject) => {
      if (authObject && authObject.tokenObj) {
        setLoadingProgress(0); //Initiate loading spinner
        setIsLoggedIn(true);
        if (!DEBUG_MODE) {
          questionsList = await getQuestionsListFromDrive(authObject, 30, updateLoadingProgress, false);
          console.log("questionsList: " + questionsList.toString() + ", currQuestionNumber: " + currQuestionIndex);
          setQuizShouldStart(true);
        }
      } else if (!DEBUG_MODE) {
        setIsLoggedIn(false);
      }
  }


  const resetQuizState = () => {
    setShouldShowAnswer(false);
    setIncorrectAnswersSelected([]);
  }

  const showNextQuestion = () => {

    const nextQuestionIndex = currQuestionIndex + 1;

    if (nextQuestionIndex < questionsList.length) {

      resetQuizState();

      setCurrQuestionIndex(nextQuestionIndex);
    } else {
      //TODO: Show no_more_questions message
    }
  }


  return (
    //nowrap: Prevent container from shifting to the side when js console is open or when text is long
    <Grid container direction="column" wrap="nowrap" className={classes.mainContainer}>
      <Grid item>
        <AppHeader authResponseHandler={authResponseHandler} 
                    clearQuizScreen={clearQuizScreen} 
                    showImportScreen={showImportScreen}/>
      </Grid>
      
      <Grid item container style={{paddingTop:"5%"}}>
        <Grid item xs={false} sm={2} lg={4}/>
        <Grid item xs={12} sm={8} lg={4}>
          {questionsList === undefined || (!isLoggedIn && questionsList.length === 0) ?
            <GenericCard centered>
              <Typography variant="h5" style={{padding: "20px"}}>Import your highlights from Google Drive.</Typography>
              <GoogleAuthButton authResponseHandler={authResponseHandler} />
            </GenericCard>
          
            

          : quizShouldStart || (questionsList.length > 0 && currQuestionIndex >= 0)  ? 
            <GameCard 
            highlightMessage={questionsList[currQuestionIndex].highlightText}
            highlightColor={questionsList[currQuestionIndex].highlightColor}
            highlightNotes={questionsList[currQuestionIndex].highlightNotes}
            highlightDate={questionsList[currQuestionIndex].highlightDate}
            bookLink={questionsList[currQuestionIndex].bookLink}
            shouldShowAnswer={shouldShowAnswer}
            handleAnswerSelection={handleAnswerSelection}
            handleNextQuestion={showNextQuestion}
            incorrectAnswersSelected={incorrectAnswersSelected}
            possibleTitles={questionsList[currQuestionIndex].titles}
          />
          : loadingProgress !== -1 ?
              <ProgressCard progress={loadingProgress}/>
          : !isLoggedIn ?
            <GameCard
              highlightMessage={"Please sign in to your Google account."}
              highlightColor={"yellow"}
              shouldShowAnswer={shouldShowAnswer}
              incorrectAnswersSelected={incorrectAnswersSelected}
              possibleTitles={[]}
            />
          : loadingProgress === 100 && questionsList.length === 0 ?
          <GameCard
            highlightMessage={"There are no Google Play Books notes in your account."}
            highlightColor={"yellow"}
            shouldShowAnswer={shouldShowAnswer}
            incorrectAnswersSelected={incorrectAnswersSelected}
            possibleTitles={[]}
          />
          
          : null
          }
          
        </Grid>
        <Grid item xs={false} sm={2} lg={4}/>

      </Grid>

    </Grid>
  );
}

export default App;
