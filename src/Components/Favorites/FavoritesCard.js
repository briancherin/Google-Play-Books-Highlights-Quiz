import React from "react";
import GenericCard from "../GenericCard";
import {Typography} from "@material-ui/core";
import HighlightBox from "../HighlightBox";

const FavoritesCard = (props) => {

    return (
        <GenericCard>
            {/*<Typography>{props.quoteText}</Typography>*/}
            {/*<Typography>{props.bookTitle}</Typography>*/}
            <HighlightBox highlightMessage={props.quoteText} />
        </GenericCard>
    );
}

export default FavoritesCard;