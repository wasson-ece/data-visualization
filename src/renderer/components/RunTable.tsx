import * as React from 'react';
import { createStyles, Theme, makeStyles, lighten } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Run from '../../interfaces/Run';
import HeaterRunRow from './HeaterRunRow';
import { Button, Toolbar } from '@material-ui/core';
import { isRunValid } from '../reducers/run';
import clsx from 'clsx';
import { red } from '@material-ui/core/colors';

const hasValidRun = (runs: Run[]): boolean => runs.some(run => isRunValid(run));

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            overflowX: 'auto',
            width: 1000,
            margin: '0 auto',
            marginTop: theme.spacing(3)
        },
        table: {
            minWidth: 650
        },
        runFinished: {
            backgroundColor: '#443939'
        },
        statusContainer: {},
        startRunBtnContainer: {
            width: '100%',
            display: 'grid',
            justifyContent: 'end',
            gridTemplateColumns: 'auto auto'
        },
        dangerButton: {
            color: red[500],
            marginRight: theme.spacing(2)
        },
        tableCell: {
            padding: '8px 8px 8px 8px'
        },
        statusCell: {
            width: 200
        },
        kp: {
            width: 100
        },
        ki: {
            width: 100
        },
        kd: {
            width: 100
        },
        baselineTemp: { width: 160 },
        setpointTemp: { width: 160 },
        baselineHoldTime: { width: 160 },
        setpointHoldTime: { width: 160 }
    })
);

export interface RunTableProps {
    id: string;
    runs: Run[];
    currentRun?: Run;
    onStartRuns: () => void;
    onStopRuns: () => void;
    onClearFinishedRuns: () => void;
}

const areRunTablePropsEqual = (props: RunTableProps, nextProps: RunTableProps) =>
    props.runs === nextProps.runs &&
    props.currentRun === nextProps.currentRun &&
    props.id === nextProps.id;

export default React.memo(function RunTable(props: RunTableProps) {
    const classes = useStyles();

    const { runs, id, currentRun, onStopRuns, onStartRuns, onClearFinishedRuns } = props;

    return (
        <Paper className={classes.root}>
            <Toolbar className={classes.statusContainer}>
                <div className={classes.startRunBtnContainer}>
                    <Button onClick={onClearFinishedRuns} className={classes.dangerButton}>
                        Clear Finished Runs
                    </Button>
                    <Button
                        disabled={!hasValidRun(runs)}
                        variant="outlined"
                        color="primary"
                        onClick={currentRun ? onStopRuns : onStartRuns}
                    >
                        {currentRun ? 'Stop' : 'Start'} Runs
                    </Button>
                </div>
            </Toolbar>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={clsx(classes.tableCell, classes.kp)}>Kp</TableCell>
                        <TableCell className={clsx(classes.tableCell, classes.ki)}>Ki</TableCell>
                        <TableCell className={clsx(classes.tableCell, classes.kd)}>Kd</TableCell>
                        <TableCell className={clsx(classes.tableCell, classes.baselineTemp)}>
                            Baseline Temperature (°C)
                        </TableCell>
                        <TableCell className={clsx(classes.tableCell, classes.setpointTemp)}>
                            Setpoint Temperature (°C)
                        </TableCell>
                        <TableCell className={clsx(classes.tableCell, classes.baselineHoldTime)}>
                            Equil. Hold Time (Minutes)
                        </TableCell>
                        <TableCell className={clsx(classes.tableCell, classes.setpointHoldTime)}>
                            Setpoint Hold Time (Minutes)
                        </TableCell>
                        <TableCell className={classes.tableCell}>Delete</TableCell>
                        <TableCell className={clsx(classes.tableCell, classes.statusCell)}>
                            Status
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {runs.map((run, index) => (
                        <HeaterRunRow
                            run={run}
                            key={`${id}-${index}`}
                            heaterId={id}
                            runIndex={index}
                        />
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}, areRunTablePropsEqual);
