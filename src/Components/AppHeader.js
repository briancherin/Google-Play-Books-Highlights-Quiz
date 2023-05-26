import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import OptionsMenu from './OptionsMenu';
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from 'react-router-dom';

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

                <Typography variant="h6" className={classes.title}>
                    <RouterLink to={"/"} style={{textDecoration: 'none', color:'inherit'}}>Play Books Notes Quiz</RouterLink>
                </Typography>


                <Typography variant="h6">
                    <Button>
                        <RouterLink to={"/browse"} style={{textDecoration: 'none', color:'inherit'}}>Browse</RouterLink>
                    </Button>
                </Typography>
                <OptionsMenu showImportScreen={props.showImportScreen}/>
                <LocalLibraryIcon />
            </Toolbar>
        </AppBar>
    );
}

export default AppHeader;