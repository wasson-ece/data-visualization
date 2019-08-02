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

const hasValidRun = (runs: Run[]): boolean => runs.some(run => isRunValid(run));

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: theme.spacing(3),
            overflowX: 'auto'
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
            justifyItems: 'right'
        }
    })
);

const useRunStatusPanelStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
            backgroundColor: lighten(theme.palette.background.default, 0.2),
            borderLeft: `solid 4px ${theme.palette.primary.main}`,
            borderRadius: theme.shape.borderRadius,
            margin: theme.spacing(2, 0)
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

    const remainingEquilibrationTime: number = currentRun && Date.now() - currentRun.startTime;
    const remainingSetpointHoldTime: number = 0 || NaN;

    return (
        <div className={classes.root}>
            <FormLabel className={classes.label}>Current Run Status</FormLabel>
            <div className={classes.content}>
                {(remainingEquilibrationTime && remainingEquilibrationTime > 0 && (
                    <TextField
                        label="Remaining Equil. Time"
                        value={remainingEquilibrationTime}
                        disabled
                        className={classes.statusTime}
                        InputProps={{
                            disableUnderline: true,
                            inputProps: {
                                style: { fontSize: 28, color: '#fff' }
                            }
                        }}
                    />
                )) ||
                    null}
                {(remainingSetpointHoldTime && remainingSetpointHoldTime > 0 && (
                    <TextField
                        label="Remaining Setpoint Time"
                        value={remainingSetpointHoldTime}
                        disabled
                        className={classes.statusTime}
                        InputProps={{
                            disableUnderline: true,
                            inputProps: {
                                style: { fontSize: 28, color: '#fff' }
                            }
                        }}
                    />
                )) ||
                    null}
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
}

export default function RunTable(props: RunTableProps) {
    const classes = useStyles();

    const { runs, id, currentRun, onStopRuns, onStartRuns } = props;

    return (
        <Paper className={classes.root}>
            <Toolbar className={classes.statusContainer}>
                {currentRun && <CurrentRunStatusPanel currentRun={currentRun} />}
                <div className={classes.startRunBtnContainer}>
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
                        <TableCell>Kp</TableCell>
                        <TableCell>Ki</TableCell>
                        <TableCell>Kd</TableCell>
                        <TableCell>Baseline Temperature (°C)</TableCell>
                        <TableCell>Setpoint Temperature (°C)</TableCell>
                        <TableCell>Equilibration Time (Minutes)</TableCell>
                        <TableCell>Setpoint Hold Time (Minutes)</TableCell>
                        <TableCell>Delete</TableCell>
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
