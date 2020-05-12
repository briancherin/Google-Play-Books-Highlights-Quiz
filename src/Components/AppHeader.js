import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import GoogleAuthButton from './GoogleAuthButton';

const useStyles = makeStyles({
    toolbar: {
        backgroundColor: "#90caf9",
    },
    title: {
        flex: 1,
    }
});

const AppHeader = (props) => {

    const classes = useStyles();

    return (
        <AppBar position="static" elevation={0}>
            <Toolbar className={classes.toolbar}>
                <Typography variant="h6" className={classes.title}>Play Books Notes Quiz</Typography>
                <GoogleAuthButton authResponseHandler={props.authResponseHandler}/>
                <LocalLibraryIcon />
            </Toolbar>
        </AppBar>
    );
}

export default AppHeader;