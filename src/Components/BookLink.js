import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const BookLink = (props) => {
    return (
        <Tooltip title="Open highlight in Play Books">
            <IconButton>
                <a href={props.url} style={{textDecoration: "none", color:"inherit"}} target="_blank" rel="noopener noreferrer">
                    <OpenInNewIcon />
                </a>
            </IconButton>
        </Tooltip>
    );
}

export default BookLink;