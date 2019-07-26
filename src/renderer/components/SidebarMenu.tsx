import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import { FormLabel } from '@material-ui/core';
import { ControllerSidebarItem, DetectorSidebarItem } from '../../enums/SidebarItems';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            position: 'sticky' as 'sticky'
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0
            }
        },
        appBar: {
            marginLeft: drawerWidth,
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`
            }
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none'
            }
        },
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: drawerWidth
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3)
        },
        labelContainer: {
            paddingTop: 8
        },
        menuLabel: {
            ...theme.typography.button,
            paddingLeft: theme.spacing(1),
            marginTop: theme.spacing(3),
            fontWeight: 'bold',
            color: '#aaa',
            letterSpacing: '0.2em'
        }
    })
);

interface SidebarMenuProps extends RouteComponentProps {}

function SidebarMenu(props: SidebarMenuProps) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <nav className={classes.drawer} aria-label="mailbox folders">
                <Drawer
                    variant="permanent"
                    anchor="left"
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <div>
                        <div className={classes.labelContainer}>
                            <FormLabel className={classes.menuLabel}>Controllers</FormLabel>
                        </div>
                        <List>
                            {Object.keys(ControllerSidebarItem)
                                .filter(key => isNaN(Number(key)))
                                .map((item: any) => (
                                    <Link
                                        to={`/controllers/${ControllerSidebarItem[item]}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                        key={ControllerSidebarItem[item]}
                                    >
                                        <ListItem
                                            button
                                            selected={
                                                `/controllers/${ControllerSidebarItem[item]}` ==
                                                props.location.pathname
                                            }
                                        >
                                            <ListItemText primary={item} />
                                        </ListItem>
                                    </Link>
                                ))}
                        </List>
                        <Divider />
                        <div className={classes.labelContainer}>
                            <FormLabel className={classes.menuLabel}>Detectors</FormLabel>
                        </div>
                        <List>
                            {Object.keys(DetectorSidebarItem)
                                .filter(key => isNaN(Number(key)))
                                .map((item: any) => (
                                    <ListItem
                                        button
                                        key={DetectorSidebarItem[item]}
                                        selected={
                                            `/detectors/${DetectorSidebarItem[item]}` ==
                                            props.location.pathname
                                        }
                                    >
                                        <ListItemText primary={item} />
                                    </ListItem>
                                ))}
                        </List>
                    </div>
                </Drawer>
            </nav>
        </div>
    );
}

export default withRouter(SidebarMenu);
