import React, {useEffect, useRef, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {Grid, IconButton, Tooltip} from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import NoteIcon from "@material-ui/icons/Note";

const LABEL_SHOW_DATE = "Show date";

const HighlightBox = ({scrollRef, highlightColor, highlightMessage, highlightNotes, bookLink, highlightDate, showDate, toggleDate}) => {

    const [ isFavorited, setIsFavorited ] = useState(false);

    const handleFavoriteClick = () => {
        setIsFavorited(!isFavorited);
        //TODO: Actually save or unsave
    }

    return (
        <div >
            <Typography ref={scrollRef} variant="h5" style={{padding:"15px", height:"25vh", overflow:"auto", backgroundColor: highlightColor}}>
                {/* Highlight content */}
                {highlightMessage}
                <br/>
                <Grid container style={{paddingTop:"10px"}}>
                    {/* Highlight date */}
                    <Grid item style={{flex: 1}}>
                        <Typography
                            style={{fontSize: 14, fontStyle: "italic", cursor: "pointer"}}
                            onClick={() => {if (toggleDate) toggleDate();}}
                        >
                            {showDate ? highlightDate : LABEL_SHOW_DATE}
                        </Typography>
                    </Grid>
                    {/* Favorites button */}
                    <Grid item>
                        <Tooltip title={isFavorited ? "Remove from favorites" : "Save in favorites"}>
                            <IconButton disableRipple onClick={()=>handleFavoriteClick()}>
                                { isFavorited
                                    ? <StarIcon />
                                    : <StarBorderIcon />
                                }

                            </IconButton>
                        </Tooltip>
                        {/* Highlight notes button */}
                        {highlightNotes !== "" && highlightNotes !== undefined ?
                            <Tooltip  interactive title={highlightNotes}>
                                <IconButton disableRipple >
                                    <NoteIcon style={{fill:"#42a5f5"}}/>
                                </IconButton>
                            </Tooltip>
                            : null
                        }

                    </Grid>
                </Grid>

            </Typography>
        </div>
    );
}

export default HighlightBox;