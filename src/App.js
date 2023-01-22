import React, { useState, useEffect } from 'react';
import './App.css';
import GameCard from './Components/GameCard';
import AppHeader from './Components/AppHeader';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getQuestionsListFromDrive, getQuestionsFromCachedQuotes } from './api/quizHelper';
import ProgressCard from './Components/ProgressCard';
import GenericCard from './Components/GenericCard';
import GoogleAuthButton from './Components/GoogleAuthButton';
import CustomDrawer from './Components/CustomDrawer';
import FavoritesList from "./Components/Favorites/FavoritesList";
import { FavoritesLocalStorage } from "./api/favorites/FavoritesLocalStorage";
import StarIcon from "@material-ui/icons/Star";
import { HighlightedQuote } from "./models/HighlightedQuote";
import Firebase from "./api/firebase/Firebase";
import { FirebaseAuthHelper } from "./api/firebase/FirebaseAuthHelper";
import Button from "@material-ui/core/Button";
import { callUpdateUserHighlights } from "./api/firebase/FirebaseFunctionsHelper";

// import { FirebaseDatabase } from "./api/FirebaseDatabase";

const useStyles = makeStyles({
  mainContainer: {
    backgroundColor: "#e3f2fd",
    background: "rgb(144,202,249) linear-gradient(180deg, rgba(144,202,249,1) 20%, rgba(227,242,253,1) 100%)",
    height: "100vh",
  }
});

const SCREEN_LIST = 0;
const SCREEN_QUIZ = 1;

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
  highlightedQuote: "One can never have enough socks. One can never have enough socksOne can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. . One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. One can never have enough socks. ",
  highlightColor: "yellow",
  highlightNotes: "lalalala",
  dateHighlighted: "January 1, 2022",
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
    highlightedQuote: "Uno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetinesUno nunca tiene suficiente calcetines"
},
];  
}
let usingCachedQuotes = false;
if (!DEBUG_MODE) {
  var questionsList = getQuestionsFromCachedQuotes(50); // TODO: Change the max? (Or get a new, unseen group once they are complete?)
  if (questionsList && questionsList?.length > 0) {
    usingCachedQuotes = true;
  }
}

// FirebaseDatabase.initialize();

console.log("QuestionsList:" + questionsList)

const App = ({ authObject }) => {
  const [ currScreen, setCurrScreen ] = useState(SCREEN_QUIZ);

  const [ importIsLoading, setImportIsLoading ] = useState(false);
  const [ loadingProgress, setLoadingProgress ] = useState(-1);

  const [ quizShouldStart, setQuizShouldStart ] = useState(false);

  const [ currQuestionIndex, setCurrQuestionIndex ] = useState(0);
  const [ shouldShowAnswer, setShouldShowAnswer ] = useState(false);
  const [ incorrectAnswersSelected, setIncorrectAnswersSelected ] = useState([]);

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  const [ favoritesList, setFavoritesList ] = useState(FavoritesLocalStorage.getFavoritesList());

  console.log("in App: favoritesList:")
  console.log(favoritesList)

  const classes = useStyles();


  useEffect(async () => {

    console.log("In useEffect. Is Firebase logged in?", Firebase.userIsLoggedIn(), FirebaseAuthHelper.getLoggedInUserId())


    if (authObject && authObject.tokenObj) {
      setIsLoggedIn(true);

      if (!usingCachedQuotes) {
        setImportIsLoading(true);
        setLoadingProgress(0); //Initiate loading spinner
        if (!DEBUG_MODE) {
          questionsList = await getQuestionsListFromDrive(authObject, 30, updateLoadingProgress, false);
          console.log("questionsList: " + questionsList.toString() + ", currQuestionNumber: " + currQuestionIndex);
        }
        setImportIsLoading(false);
      }

      if (questionsList?.length > 0) {
        setQuizShouldStart(true);
      }


    } else if (!DEBUG_MODE) {
      setIsLoggedIn(false);
    }
  }, [])


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

    console.log("authObject:" + JSON.stringify(authObject));
/*
      FirebaseDatabase.authenticate(authObject.tokenObj.id_token, authObject.tokenObj.access_token).then(() => {
        console.log("Initialized Firebase Database");
      }).catch((e) => {
        console.error("Failed to initialize Firebase Database: ")
        console.error(e)
      })*/

     /* if (authObject && authObject.tokenObj) {
        setLoadingProgress(0); //Initiate loading spinner
        setIsLoggedIn(true);
        if (!DEBUG_MODE) {
          questionsList = await getQuestionsListFromDrive(authObject, 30, updateLoadingProgress, false);
          console.log("questionsList: " + questionsList.toString() + ", currQuestionNumber: " + currQuestionIndex);
          setQuizShouldStart(true);
        }


      } else if (!DEBUG_MODE) {
        setIsLoggedIn(false);
      }*/
  }


  const resetQuizState = () => {
    setShouldShowAnswer(false);
    setIncorrectAnswersSelected([]);
  }

  const showNextQuestion = () => {

    const nextQuestionIndex = currQuestionIndex + 1;

    if (nextQuestionIndex < questionsList?.length) {

      resetQuizState();

      setCurrQuestionIndex(nextQuestionIndex);
    } else {
      //TODO: Show no_more_questions message
    }
  }

  const updateFavorites = (favoritesList) => {
    setFavoritesList(favoritesList);
  }

  const getCurrQuoteObject = () => {
    console.log("curr question: " + JSON.stringify(questionsList[currQuestionIndex]));
    return questionsList[currQuestionIndex]?.highlightedQuote;

    /*if (currQuestionIndex > 0) {
      let currQuestion = questionsList[currQuestionIndex];

      if (currQuestion !== undefined) {
        return new HighlightedQuote(
            currQuestion.quoteText,
            currQuestion.highlightColor,
            currQuestion.highlightNotes,
            currQuestion.dateHighlighted,
            currQuestion.bookLink,
            currQuestion.correctAnswerTitle,
            currQuestion.quoteIsFavorited,
        )
      }
    }*/
  }


  const quotesInitialized = isLoggedIn && questionsList?.length > 0;
  
  // @ts-ignore
  return (
    //nowrap: Prevent container from shifting to the side when js console is open or when text is long
    <Grid container direction="column" wrap="nowrap" className={classes.mainContainer}>
      <Grid item>
        <AppHeader authResponseHandler={authResponseHandler} 
                    showImportScreen={showImportScreen}/>
      </Grid>
      
      <Grid item container style={{paddingTop:"5%"}}>

        {/*FAVORTIES DRAWER*/}
        {
          quotesInitialized
            ? <CustomDrawer openButtonText={<StarIcon/>}>
                <FavoritesList favorites={favoritesList} updateFavorites={updateFavorites}/>
              </CustomDrawer>
            : null
        }

        <Grid item xs={false} sm={2} lg={4}/>

        <Grid item xs={12} sm={8} lg={4}>
            <GenericCard centered>
              <Typography variant="h5" style={{padding: "20px"}}>Import your highlights from Google Drive.</Typography>
              <Button onClick={()=>callUpdateUserHighlights()}>Import</Button>
            </GenericCard>
        </Grid>

        {/*<Grid item xs={12} sm={8} lg={4}>*/}
        {/*  {!quotesInitialized && loadingProgress === -1 ?*/}
        {/*    <GenericCard centered>*/}
        {/*      <Typography variant="h5" style={{padding: "20px"}}>Import your highlights from Google Drive.</Typography>*/}
        {/*      <Button>Import</Button>*/}
        {/*      /!*<GoogleAuthButton authResponseHandler={authResponseHandler} />*!/*/}
        {/*    </GenericCard>*/}

        {/*  : importIsLoading ?*/}
        {/*      <ProgressCard progress={loadingProgress}/>*/}
        {/*    */}

        {/*  : quizShouldStart || (quotesInitialized && questionsList?.length > 0 && currQuestionIndex >= 0)  ?*/}
        {/*    <GameCard*/}
        {/*      highlightedQuote={getCurrQuoteObject()}*/}
        {/*      quoteText={questionsList[currQuestionIndex].quoteText}*/}
        {/*      highlightColor={questionsList[currQuestionIndex].highlightColor}*/}
        {/*      highlightNotes={questionsList[currQuestionIndex].highlightNotes}*/}
        {/*      dateHighlighted={questionsList[currQuestionIndex].dateHighlighted}*/}
        {/*      bookLink={questionsList[currQuestionIndex].bookLink}*/}
        {/*      quoteIsFavorited={questionsList[currQuestionIndex].quoteIsFavorited}*/}
        {/*      shouldShowAnswer={shouldShowAnswer}*/}
        {/*      handleAnswerSelection={handleAnswerSelection}*/}
        {/*      handleNextQuestion={showNextQuestion}*/}
        {/*      incorrectAnswersSelected={incorrectAnswersSelected}*/}
        {/*      possibleTitles={questionsList[currQuestionIndex].titles}*/}
        {/*      isFavorited={favoritesList.filter((obj) => obj.quoteText === questionsList[currQuestionIndex].quoteText).length > 0} //TODO: Do this better (compare by object. move to its own function)*/}
        {/*      updateFavorites={updateFavorites}*/}
        {/*    />*/}

        {/*  : !isLoggedIn ?*/}
        {/*    <GameCard*/}
        {/*      quoteText={"Please sign in to your Google account."}*/}
        {/*      highlightColor={"yellow"}*/}
        {/*      shouldShowAnswer={shouldShowAnswer}*/}
        {/*      incorrectAnswersSelected={incorrectAnswersSelected}*/}
        {/*      possibleTitles={[]}*/}
        {/*    />*/}
        {/*  : loadingProgress === 100 && questionsList?.length === 0 ?*/}
        {/*  <GameCard*/}
        {/*    quoteText={"There are no Google Play Books notes in your account."}*/}
        {/*    highlightColor={"yellow"}*/}
        {/*    shouldShowAnswer={shouldShowAnswer}*/}
        {/*    incorrectAnswersSelected={incorrectAnswersSelected}*/}
        {/*    possibleTitles={[]}*/}
        {/*  />*/}
        {/*  */}
        {/*  : null*/}
        {/*  }*/}
        {/*  */}
        {/*</Grid>*/}
        <Grid item xs={false} sm={2} lg={4}/>

      </Grid>

    </Grid>
  );
}

export default App;
