import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import FavoritesCard from "./FavoritesCard";

const FavoritesList = (props) => {

    return (
      <div>
        <List>
            {props.favorites.map((favorite, index) => (
                <ListItem key={index}>
                    <FavoritesCard quoteText={favorite.highlightText} bookTitle={favorite.bookTitle} />
                </ListItem>
            ))}
        </List>
      </div>
    );
}

export default FavoritesList;