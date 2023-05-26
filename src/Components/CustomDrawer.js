import React from 'react';
import Button from "@material-ui/core/Button";
import {Drawer} from "@material-ui/core";

//https://material-ui.com/components/drawers/#temporary-drawer
const CustomDrawer = (props) => {

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = (shouldOpen) => {
        setDrawerOpen(shouldOpen);
    }

    return (
        <div>
            <Button variant="contained" style={{backgroundColor: "white"}} onClick={() => toggleDrawer(true)}>{props.openButtonText}</Button>
            <Drawer anchor={'left'} open={drawerOpen} onClose={() => toggleDrawer(false)}>
                {props.children}
            </Drawer>
        </div>
    );
}
export default CustomDrawer;