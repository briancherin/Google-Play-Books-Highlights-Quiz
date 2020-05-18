import React from 'react';
import { Typography, LinearProgress, Card } from '@material-ui/core';

const ProgressCard = (props) => {
    return(
        <Card style={{flexGrow: 1, backgroundColor:"white", padding:30}}>
            <Typography variant="h5" style={{textAlign: "center", paddingBottom:10}}>Loading highlights</Typography>
            <LinearProgress variant="determinate" value={props.progress}/>
        </Card>
    );
}

export default ProgressCard;