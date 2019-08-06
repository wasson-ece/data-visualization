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
            color: '#666'
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
                <TextField value={run.kp || ''} onChange={handleChangeKpValue} placeholder="Kp" />
            </TableCell>
            <TableCell>
                <TextField value={run.ki || ''} onChange={handleChangeKiValue} placeholder="Ki" />
            </TableCell>
            <TableCell>
                <TextField value={run.kd || ''} onChange={handleChangeKdValue} placeholder="Kd" />
            </TableCell>
            <TableCell>
                <TextField
                    value={run.baseline || ''}
                    placeholder="Baseline"
                    onChange={handleChangeBaselineValue}
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
                    value={run.setpoint || ''}
                    onChange={handleChangeSetpointValue}
                    placeholder="Setpoint"
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
                    value={run.equilibrationTime || ''}
                    onChange={handleChangeEquilibrationValue}
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
                    value={run.setpointHoldTime || ''}
                    onChange={handleChangeHoldTimeValue}
                    placeholder="Setpoint Hold Time"
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
                <IconButton onClick={handleDeleteRow}>
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
