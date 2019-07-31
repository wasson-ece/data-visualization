import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import { FormLabel, Button, Collapse, ListItemIcon } from '@material-ui/core';
import { ControllerSidebarItem, DetectorSidebarItem } from '../../enums/SidebarItems';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Heater from '../../ti-components/controllers/Heater';

const drawerWidth = 260;

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
        },
        globalButtonPanel: {
            display: 'grid',
            justifyItems: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            padding: `${theme.spacing(2)}px 0px`
        },
        nested: {
            paddingLeft: theme.spacing(4)
        }
    })
);

interface SidebarMenuProps extends RouteComponentProps {
    isCollectingData: boolean;
    heaters: Heater[];
    onToggleDataCollection: () => void;
}

function SidebarMenu(props: SidebarMenuProps) {
    const classes = useStyles();
    const [epcDrawerIsOpen, setEpcDrawerOpen] = React.useState(false);
    const [mfcDrawerIsOpen, setMfcDrawerOpen] = React.useState(false);
    const [heaterDrawerIsOpen, setHeaterDrawerOpen] = React.useState(false);
    const [dioDrawerIsOpen, setDioDrawerOpen] = React.useState(false);

    function handleClickDioDrawer() {
        setDioDrawerOpen(!dioDrawerIsOpen);
    }

    function handleClickMfcDrawer() {
        setMfcDrawerOpen(!mfcDrawerIsOpen);
    }

    function handleClickHeaterDrawer() {
        setHeaterDrawerOpen(!heaterDrawerIsOpen);
    }

    function handleClickEpcDrawer() {
        setEpcDrawerOpen(!epcDrawerIsOpen);
    }

    const { isCollectingData, onToggleDataCollection, heaters } = props;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <nav className={classes.drawer}>
                <Drawer
                    variant="permanent"
                    anchor="left"
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <div>
                        <div className={classes.globalButtonPanel}>
                            <Button
                                color="primary"
                                variant="outlined"
                                onClick={onToggleDataCollection}
                            >
                                {isCollectingData ? 'Stop' : 'Start'} Collecting Data
                            </Button>
                        </div>
                        <div className={classes.labelContainer}>
                            <FormLabel className={classes.menuLabel}>Controllers</FormLabel>
                        </div>
                        <List>
                            <ListItem button onClick={handleClickDioDrawer}>
                                <ListItemText primary="Digital I/O (DIO)" />
                                {dioDrawerIsOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={dioDrawerIsOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem button className={classes.nested}>
                                        <ListItemIcon>
                                            <StarBorder />
                                        </ListItemIcon>
                                        <ListItemText primary="Starred" />
                                    </ListItem>
                                </List>
                            </Collapse>
                            <ListItem button onClick={handleClickEpcDrawer}>
                                <ListItemText primary="Electronic Pressure Controllers (EPC)" />
                                {epcDrawerIsOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={epcDrawerIsOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem button className={classes.nested}>
                                        <ListItemIcon>
                                            <StarBorder />
                                        </ListItemIcon>
                                        <ListItemText primary="EPCs Go Here, I Guess" />
                                    </ListItem>
                                </List>
                            </Collapse>
                            <ListItem button onClick={handleClickHeaterDrawer}>
                                <ListItemText primary="Heaters" />
                                {heaterDrawerIsOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={heaterDrawerIsOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {heaters.map(heater => (
                                        <Link
                                            to={`/controllers/${ControllerSidebarItem.Oven}/${heater.id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                            key={heater.id}
                                        >
                                            <ListItem
                                                button
                                                className={classes.nested}
                                                selected={
                                                    `/controllers/${ControllerSidebarItem.Oven}/${heater.id}` ===
                                                    props.location.pathname
                                                }
                                            >
                                                <ListItemText primary={`Oven #${heater.id}`} />
                                            </ListItem>
                                        </Link>
                                    ))}
                                </List>
                            </Collapse>
                            <ListItem button onClick={handleClickMfcDrawer}>
                                <ListItemText primary="Mass Flow Controllers (MFC)" />
                                {mfcDrawerIsOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={mfcDrawerIsOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem button className={classes.nested}>
                                        <ListItemIcon>
                                            <StarBorder />
                                        </ListItemIcon>
                                        <ListItemText primary="Starred" />
                                    </ListItem>
                                </List>
                            </Collapse>
                        </List>
                        <Divider />
                        <div className={classes.labelContainer}>
                            <FormLabel className={classes.menuLabel}>Detectors</FormLabel>
                        </div>
                        <List>
                            {Object.keys(DetectorSidebarItem)
                                .filter(key => isNaN(Number(key)))
                                .map((item: any) => (
                                    <ListItem button key={DetectorSidebarItem[item]}>
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
