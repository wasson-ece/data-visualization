import * as React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {
    TextField,
    IconButton,
    InputAdornment,
    Theme,
    makeStyles,
    createStyles
} from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Run from '../../interfaces/Run';
import { deleteRun, editRunAttributes } from '../actions/run';
import { isRunValid } from '../reducers/run';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        adornment: {
            color: '#3a3737'
        },
        running: {
            backgroundColor: 'rgb(89, 89, 89)'
        },
        finished: {
            backgroundColor: '#3a443a'
        },
        invalid: {
            backgroundColor: '#914a4a'
        }
    })
);

export interface RunRowProps {
    run: Run;
    heaterId: string;
    runIndex: number;
    deleteHeaterRunRow: (heaterId: string, index: number) => void;
    editHeaterRunRow: (heaterId: string, index: number, attribute: string, value: string) => void;
}

function HeaterRunRow(props: RunRowProps) {
    const classes = useStyles();
    const { run, heaterId, runIndex, deleteHeaterRunRow, editHeaterRunRow } = props;

    const handleChangeKpValue = (e: React.ChangeEvent<HTMLInputElement>) =>
        editHeaterRunRow(heaterId, runIndex, 'kp', e.target.value);

    const handleChangeKiValue = (e: React.ChangeEvent<HTMLInputElement>) =>
        editHeaterRunRow(heaterId, runIndex, 'ki', e.target.value);

    const handleChangeKdValue = (e: React.ChangeEvent<HTMLInputElement>) =>
        editHeaterRunRow(heaterId, runIndex, 'kd', e.target.value);

    const handleChangeBaselineValue = (e: React.ChangeEvent<HTMLInputElement>) =>
        editHeaterRunRow(heaterId, runIndex, 'baseline', e.target.value);

    const handleChangeSetpointValue = (e: React.ChangeEvent<HTMLInputElement>) =>
        editHeaterRunRow(heaterId, runIndex, 'setpoint', e.target.value);

    const handleChangeEquilibrationValue = (e: React.ChangeEvent<HTMLInputElement>) =>
        editHeaterRunRow(heaterId, runIndex, 'equilibrationTime', e.target.value);

    const handleChangeHoldTimeValue = (e: React.ChangeEvent<HTMLInputElement>) =>
        editHeaterRunRow(heaterId, runIndex, 'setpointHoldTime', e.target.value);

    const handleDeleteRow = () => deleteHeaterRunRow(heaterId, runIndex);

    let className = undefined;
    if (run.isRunning) className = classes.running;
    if (run.isFinished) className = classes.finished;
    if (run.isDirty && !isRunValid(run)) className = classes.invalid;

    return (
        <TableRow className={className}>
            <TableCell>
                <TextField
                    margin="dense"
                    hiddenLabel
                    variant="filled"
                    value={run.kp || ''}
                    onChange={handleChangeKpValue}
                    placeholder="Kp"
                    disabled={run.isRunning}
                />
            </TableCell>
            <TableCell>
                <TextField
                    margin="dense"
                    hiddenLabel
                    value={run.ki || ''}
                    variant="filled"
                    onChange={handleChangeKiValue}
                    placeholder="Ki"
                    disabled={run.isRunning}
                />
            </TableCell>
            <TableCell>
                <TextField
                    margin="dense"
                    hiddenLabel
                    value={run.kd || ''}
                    variant="filled"
                    onChange={handleChangeKdValue}
                    placeholder="Kd"
                    disabled={run.isRunning}
                />
            </TableCell>
            <TableCell>
                <TextField
                    value={run.baseline || ''}
                    variant="filled"
                    margin="dense"
                    hiddenLabel
                    placeholder="Baseline"
                    onChange={handleChangeBaselineValue}
                    disabled={run.isRunning}
                    InputProps={{
                        inputProps: {
                            min: -273.15,
                            max: 500,
                            step: 0.01,
                            'aria-label': 'dense hidden label'
                        },
                        endAdornment: (
                            <InputAdornment className={classes.adornment} position="start">
                                <div>°C</div>
                            </InputAdornment>
                        )
                    }}
                />
            </TableCell>
            <TableCell>
                <TextField
                    margin="dense"
                    hiddenLabel
                    value={run.setpoint || ''}
                    onChange={handleChangeSetpointValue}
                    variant="filled"
                    placeholder="Setpoint"
                    disabled={run.isRunning}
                    InputProps={{
                        inputProps: {
                            min: -273.15,
                            max: 500,
                            step: 0.01
                        },
                        endAdornment: (
                            <InputAdornment className={classes.adornment} position="start">
                                <div>°C</div>
                            </InputAdornment>
                        )
                    }}
                />
            </TableCell>
            <TableCell>
                <TextField
                    margin="dense"
                    value={run.equilibrationTime || ''}
                    onChange={handleChangeEquilibrationValue}
                    variant="filled"
                    hiddenLabel
                    disabled={run.isRunning}
                    placeholder="Equilibration Time"
                    InputProps={{
                        inputProps: {
                            min: -273.15,
                            max: 500,
                            step: 0.01
                        },
                        endAdornment: (
                            <InputAdornment className={classes.adornment} position="start">
                                <div>Min</div>
                            </InputAdornment>
                        )
                    }}
                />
            </TableCell>
            <TableCell>
                <TextField
                    margin="dense"
                    value={run.setpointHoldTime || ''}
                    onChange={handleChangeHoldTimeValue}
                    variant="filled"
                    hiddenLabel
                    placeholder="Setpoint Hold Time"
                    disabled={run.isRunning}
                    InputProps={{
                        inputProps: {
                            min: -273.15,
                            max: 500,
                            step: 0.01
                        },
                        endAdornment: (
                            <InputAdornment className={classes.adornment} position="start">
                                <div>Min</div>
                            </InputAdornment>
                        )
                    }}
                />
            </TableCell>
            <TableCell>
                <IconButton onClick={handleDeleteRow} disabled={run.isRunning}>
                    <DeleteForeverIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

const mapDispatch = (dispatch: Dispatch) => ({
    deleteHeaterRunRow: (heaterId: string, index: number) => dispatch(deleteRun(heaterId, index)),
    editHeaterRunRow: (heaterId: string, index: number, attribute: string, value: string) =>
        dispatch(editRunAttributes(heaterId, index, { [attribute]: value }))
});

export default connect(
    null,
    mapDispatch
)(HeaterRunRow);
