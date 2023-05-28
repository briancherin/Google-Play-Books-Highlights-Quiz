import React from 'react';
import { Typography, LinearProgress, Card, CircularProgress } from '@material-ui/core';

const ProgressCard = ({text}) => {
    return(
        <Card style={{flexGrow: 1, backgroundColor:"white", padding:30}}>
            <Typography variant="h5" style={{textAlign: "center", paddingBottom:10}}>{text}</Typography>
            {/*<LinearProgress variant="determinate" value={props.progress}/>*/}
             <div style={{flexGrow: 1, display:"flex", justifyContent: "center", alignItems: "center"}}>
                 <CircularProgress />
             </div>
        </Card>
    );
}

export default ProgressCard;