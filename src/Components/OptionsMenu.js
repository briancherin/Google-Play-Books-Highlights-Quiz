import React from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { clearAllCached } from '../api/gdriveNotesHelper';

const OptionsMenu = (props) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const clearCachedHighlights = () => {
        clearAllCached();
        handleClose();
        props.clearQuizScreen();
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <div>
            <IconButton
                aria-label="options"
                aria-controls="options-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon style={{fill:"white"}}/>
            </IconButton>

            <Menu
                id="options-menu"
                anchorEl={anchorEl}
                open={open}
                keepMounted
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                transformOrigin={{vertical: "top", horizontal: "center"}}
            >
                <MenuItem onClick={() => clearCachedHighlights()}>
                    Clear cached highlights
                </MenuItem>
            </Menu>
        </div>
    );
}

export default OptionsMenu;