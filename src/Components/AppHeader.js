import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import GoogleAuthButton from './GoogleAuthButton';
import OptionsMenu from './OptionsMenu';

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
                <OptionsMenu clearQuizScreen={props.clearQuizScreen} showImportScreen={props.showImportScreen}/>
                <LocalLibraryIcon />
            </Toolbar>
        </AppBar>
    );
}

export default AppHeader;