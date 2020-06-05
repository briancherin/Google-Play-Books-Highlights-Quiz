import React from 'react';
import { Card, CardContent, Grid } from '@material-ui/core';



export default function GenericCard(props) {

    return(
        <Card style={{height:"100%", display:"inline-block"}}>
            <CardContent align={props.centered ? "center" : ""}>
            
                {props.children}
                
            </CardContent>
        </Card>
    );
}