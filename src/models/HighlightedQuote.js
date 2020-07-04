import GameCard from "../Components/GameCard";
import React from "react";

export class HighlightedQuote {

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