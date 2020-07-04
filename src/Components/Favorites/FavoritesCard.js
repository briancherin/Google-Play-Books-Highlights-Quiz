import React from "react";
import GenericCard from "../GenericCard";
import {Typography} from "@material-ui/core";
import HighlightBox from "../HighlightBox";

const FavoritesCard = (props) => {

    return (
        <GenericCard>
            <HighlightBox highlightedQuote={props.highlightedQuote} updateFavorites={props.updateFavorites}/>
        </GenericCard>
    );
}

export default FavoritesCard;