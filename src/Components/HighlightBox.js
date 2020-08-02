import React, {useEffect, useRef, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {Grid, IconButton, Tooltip} from "@material-ui/core";
import PropTypes from 'prop-types';
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import NoteIcon from "@material-ui/icons/Note";
import { FavoritesLocalStorage } from "../api/FavoritesLocalStorage";
import { HighlightedQuote } from "../models/HighlightedQuote";
import BookLink from "./BookLink";



const LABEL_SHOW_DATE = "Show date";

const HighlightBox = ({
  highlightedQuote,
  containerHeight,
  scrollRef,
  showDate,
  toggleDate,
  updateFavorites,
  showBookLink
}) => {

  const { quoteText, highlightColor, highlightNotes, dateHighlighted } = highlightedQuote;

    const quoteIsFavorited = FavoritesLocalStorage.quoteIsFavorited(quoteText); // TODO: change to other param?

  const handleFavoriteClick = () => {
    const newIsFavorited = !quoteIsFavorited;

    if (newIsFavorited) {
      console.log("Will push to favorites");
      highlightedQuote.quoteIsFavorited = true;
      FavoritesLocalStorage.pushToFavoritesList(highlightedQuote);
    } else {
      console.log("Will remove from favorites");
      FavoritesLocalStorage.removeFromFavoritesList(highlightedQuote);
    }

    updateFavorites(FavoritesLocalStorage.getFavoritesList()); // Propagate the changes to the favorites UI
  };

  return (
    <div>
      <Typography
        ref={scrollRef}
        variant="h5"
        style={{
          padding: "15px",
          height: containerHeight,
          overflow: "auto",
          backgroundColor: highlightColor,
        }}
      >
        {/* Highlight content */}
        {quoteText}
        <br />
        <Grid container style={{ paddingTop: "10px" }}>
          {/* Highlight date */}
          <Grid item style={{ flex: 1 }}>
            <Typography
              style={{ fontSize: 14, fontStyle: "italic", cursor: "pointer" }}
              onClick={() => {
                if (toggleDate) toggleDate();
              }}
            >
              {showDate ? dateHighlighted : LABEL_SHOW_DATE}
            </Typography>
          </Grid>
          {/* Favorites button */}
          <Grid item>
            <Tooltip
              title={
                  quoteIsFavorited ? "Remove from favorites" : "Save in favorites"
              }
            >
              <IconButton disableRipple onClick={() => handleFavoriteClick()}>
                {quoteIsFavorited ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>
            {/* Highlight notes button */}
            {highlightNotes !== "" && highlightNotes !== undefined ? (
              <Tooltip interactive title={highlightNotes}>
                <IconButton disableRipple>
                  <NoteIcon style={{ fill: "#42a5f5" }} />
                </IconButton>
              </Tooltip>
            ) : null}

        {/* Book link, if enabled */}
          { showBookLink
              ? <BookLink url={highlightedQuote.bookLink}/>
              : null
          }
          </Grid>
        </Grid>
      </Typography>
    </div>
  );
};

HighlightBox.propTypes = {
    containerHeight: PropTypes.string,   // e.g. "25vh"
    updateFavorites: PropTypes.func,
    // highlightedQuote: PropTypes.instanceOf(HighlightedQuote),
}

export default HighlightBox;