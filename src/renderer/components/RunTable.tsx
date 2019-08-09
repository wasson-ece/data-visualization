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
import { Button, Toolbar, TextField, FormLabel } from '@material-ui/core';
import { isRunValid } from '../reducers/run';
import { remainingMinutes, minutesToString } from '../../util/heater-timing';
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
            width: 80
        },
        ki: {
            width: 80
        },
        kd: {
            width: 80
        },
        baselineTemp: { width: 160 },
        setpointTemp: { width: 160 },
        baselineHoldTime: { width: 160 },
        setpointHoldTime: { width: 160 }
    })
);

const useRunStatusPanelStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
            backgroundColor: lighten(theme.palette.background.default, 0.2),
            borderLeft: `solid 4px ${theme.palette.primary.main}`,
            borderRadius: theme.shape.borderRadius,
            margin: theme.spacing(2, 0),
            width: 'fit-content'
        },
        label: {
            ...theme.typography.button,
            marginBottom: theme.spacing(2),
            display: 'block'
        },
        content: {
            paddingLeft: theme.spacing(1)
        },
        statusTime: {
            width: 'fit-content'
        }
    })
);

export interface CurrentRunProps {
    currentRun: Run;
}

export const CurrentRunStatusPanel = (props: CurrentRunProps) => {
    const classes = useRunStatusPanelStyles();
    const { currentRun } = props;
    const equilHoldTime = Number(currentRun.equilibrationTime);
    const setpointHoldTime = Number(currentRun.setpointHoldTime);

    const remainingEquilibrationTime: number = remainingMinutes(
        currentRun.startTime,
        equilHoldTime
    );
    const remainingSetpointHoldTime: number = remainingMinutes(
        currentRun.startTime,
        equilHoldTime + setpointHoldTime
    );

    return (
        <div className={classes.root}>
            <FormLabel className={classes.label}>Current Run Status</FormLabel>
            <div className={classes.content}>
                {(remainingEquilibrationTime > 0 && (
                    <TextField
                        label="Remaining Equil. Time"
                        value={minutesToString(remainingEquilibrationTime)}
                        disabled
                        className={classes.statusTime}
                        InputProps={{
                            disableUnderline: true,
                            inputProps: {
                                style: { fontSize: 28, color: '#fff', width: 'fit-content' }
                            }
                        }}
                    />
                )) ||
                    null}
                {(remainingSetpointHoldTime > 0 && remainingEquilibrationTime < 0 && (
                    <TextField
                        label="Remaining Setpoint Time"
                        value={minutesToString(remainingSetpointHoldTime)}
                        disabled
                        className={classes.statusTime}
                        InputProps={{
                            disableUnderline: true,
                            inputProps: {
                                style: { fontSize: 28, color: '#fff', width: 'fit-content' }
                            }
                        }}
                    />
                )) ||
                    null}
                {remainingEquilibrationTime <= 0 && remainingSetpointHoldTime <= 0 ? (
                    <div>Run finished! ✔️</div>
                ) : null}
            </div>
        </div>
    );
};

export interface RunTableProps {
    id: string;
    runs: Run[];
    currentRun?: Run;
    onStartRuns: () => void;
    onStopRuns: () => void;
    onClearFinishedRuns: () => void;
}

export default function RunTable(props: RunTableProps) {
    const classes = useStyles();

    const { runs, id, currentRun, onStopRuns, onStartRuns, onClearFinishedRuns } = props;

    return (
        <Paper className={classes.root}>
            <Toolbar className={classes.statusContainer}>
                {currentRun && <CurrentRunStatusPanel currentRun={currentRun} />}
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
}
