import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { FormLabel, Button, Collapse, ListItemIcon, IconButton } from '@material-ui/core';
import { ControllerSidebarItem, DetectorSidebarItem } from '../../enums/SidebarItems';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HeaterState from '../../interfaces/HeaterState';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            position: 'sticky' as 'sticky',
            height: '100%'
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                flexShrink: 0
            }
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none'
            }
        },
        toolbar: theme.mixins.toolbar,
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
        },
        open: {
            borderRadius: 0,
            height: '100%'
        },
        close: {
            width: '100%',
            borderRadius: 0,
            margin: 0
        }
    })
);

interface SidebarMenuProps extends RouteComponentProps {
    isCollectingData: boolean;
    heaters: HeaterState[];
    onToggleDataCollection: () => void;
}

const arePropsEqual = (props: SidebarMenuProps, nextProps: SidebarMenuProps) =>
    props.isCollectingData === nextProps.isCollectingData &&
    props.heaters.length === nextProps.heaters.length &&
    props.location.pathname === nextProps.location.pathname;

const SidebarMenu = React.memo(function(props: SidebarMenuProps) {
    const classes = useStyles();
    const [epcDrawerIsOpen, setEpcDrawerOpen] = React.useState(false);
    const [mfcDrawerIsOpen, setMfcDrawerOpen] = React.useState(false);
    const [heaterDrawerIsOpen, setHeaterDrawerOpen] = React.useState(false);
    const [dioDrawerIsOpen, setDioDrawerOpen] = React.useState(false);
    const [mainDrawerIsOpen, setMainDrawerOpen] = React.useState(true);

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

    function handleSetMainDrawerOpen() {
        setMainDrawerOpen(!mainDrawerIsOpen);
    }

    const { isCollectingData, onToggleDataCollection, heaters } = props;

    return (
        <div className={classes.root} style={{ width: mainDrawerIsOpen ? 240 : 30 }}>
            <CssBaseline />
            {!mainDrawerIsOpen && (
                <IconButton
                    color="inherit"
                    onClick={handleSetMainDrawerOpen}
                    edge="start"
                    className={classes.open}
                >
                    <ChevronRightIcon />
                </IconButton>
            )}
            <nav className={classes.drawer}>
                <Drawer variant="persistent" anchor="left" open={mainDrawerIsOpen}>
                    <div>
                        <IconButton
                            color="inherit"
                            onClick={handleSetMainDrawerOpen}
                            edge="start"
                            className={classes.close}
                        >
                            {mainDrawerIsOpen && <ChevronLeftIcon />}
                        </IconButton>
                        <div className={classes.globalButtonPanel}>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={onToggleDataCollection}
                            >
                                {isCollectingData ? 'Stop' : 'Start'} Data Collection
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
                                <ListItemText primary="Electronic Pressure (EPC)" />
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
                                <ListItemText primary="Mass Flow (MFC)" />
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
}, arePropsEqual);

export default withRouter(SidebarMenu);
