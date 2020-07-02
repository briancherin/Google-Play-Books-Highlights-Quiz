import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import FavoritesCard from "./FavoritesCard";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    list: {
        width: 300  // TODO: should this be different for mobile?
    }
});

const FavoritesList = (props) => {
    const classes = useStyles();

    return (
      <div>
        <List className={classes.list}>
            {props.favorites.map((favorite, index) => (
                <ListItem key={index}>
                    <FavoritesCard
                        highlightMessage={favorite.highlightMessage}
                        bookTitle={favorite.bookTitle}
                        updateFavorites={props.updateFavorites}
                    />
                </ListItem>
            ))}
        </List>
      </div>
    );
}

export default FavoritesList;