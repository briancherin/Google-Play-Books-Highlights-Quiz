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

const FavoritesList = ({favorites, updateFavorites}) => {
    const classes = useStyles();

    console.log("In favoritesList. favorites:")
    console.log(favorites)

    return (
      <div>
        <List className={classes.list}>
            {
                favorites.length === 0
                    ? <ListItem>You haven't favorited anything yet!</ListItem>
                    : favorites.map((favorite, index) => (
                            <ListItem key={index}>
                                <FavoritesCard
                                    highlightedQuote={favorite}
                                    updateFavorites={updateFavorites}
                                />
                            </ListItem>
                        ))
            }

        </List>
      </div>
    );
}

export default FavoritesList;