import * as React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Option from '../../interfaces/Option';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            width: '100%',
            backgroundColor: theme.palette.background.paper
        },
        tabAppBar: {
            position: 'relative'
        }
    })
);

interface TabMenuProps {
    options: Option[];
    onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
    value?: number;
}

export default function TabMenu(props: TabMenuProps) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar color="default" className={classes.tabAppBar}>
                <Tabs
                    value={props.value}
                    onChange={props.onChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    {props.options.map((option: Option) => (
                        <Tab label={option.label} key={option.id} />
                    ))}
                </Tabs>
            </AppBar>
            {/* <TabPanel value={value} index={0}>
                Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
            <TabPanel value={value} index={3}>
                Item Four
            </TabPanel>
            <TabPanel value={value} index={4}>
                Item Five
            </TabPanel>
            <TabPanel value={value} index={5}>
                Item Six
            </TabPanel>
            <TabPanel value={value} index={6}>
                Item Seven
            </TabPanel> */}
        </div>
    );
}
