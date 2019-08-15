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
import clsx from 'clsx';
import Run from '../../interfaces/Run';
import { deleteRun, editRunAttributes } from '../actions/run';
import { isRunValid } from '../reducers/run';
import { brown, red, grey, yellow } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        adornment: {
            color: '#3a3737'
        },
        running: {
            backgroundColor: 'rgb(89, 89, 89)'
        },
        tableCell: {
            padding: '8px 8px 8px 8px'
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

const areHeaterRunPropsEqual = (props: RunRowProps, nextProps: RunRowProps) =>
    props.run === nextProps.run &&
    props.heaterId === nextProps.heaterId &&
    props.runIndex === nextProps.runIndex;

const HeaterRunRow = React.memo(function HeaterRunRow(props: RunRowProps) {
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

    return (
        <TableRow className={className}>
            <TableCell className={classes.tableCell}>
                <TextField
                    margin="dense"
                    hiddenLabel
                    variant="outlined"
                    value={run.kp || ''}
                    onChange={handleChangeKpValue}
                    placeholder="Kp"
                    disabled={run.isRunning}
                />
            </TableCell>
            <TableCell className={classes.tableCell}>
                <TextField
                    margin="dense"
                    hiddenLabel
                    value={run.ki || ''}
                    variant="outlined"
                    onChange={handleChangeKiValue}
                    placeholder="Ki"
                    disabled={run.isRunning}
                />
            </TableCell>
            <TableCell className={classes.tableCell}>
                <TextField
                    margin="dense"
                    hiddenLabel
                    value={run.kd || ''}
                    variant="outlined"
                    onChange={handleChangeKdValue}
                    placeholder="Kd"
                    disabled={run.isRunning}
                />
            </TableCell>
            <TableCell className={classes.tableCell}>
                <TextField
                    value={run.baseline || ''}
                    variant="outlined"
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
            <TableCell className={classes.tableCell}>
                <TextField
                    margin="dense"
                    hiddenLabel
                    value={run.setpoint || ''}
                    onChange={handleChangeSetpointValue}
                    variant="outlined"
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
            <TableCell className={classes.tableCell}>
                <TextField
                    margin="dense"
                    value={run.equilibrationTime || ''}
                    onChange={handleChangeEquilibrationValue}
                    variant="outlined"
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
            <TableCell className={classes.tableCell}>
                <TextField
                    margin="dense"
                    value={run.setpointHoldTime || ''}
                    onChange={handleChangeHoldTimeValue}
                    variant="outlined"
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
            <TableCell className={classes.tableCell}>
                <IconButton onClick={handleDeleteRow} disabled={run.isRunning}>
                    <DeleteForeverIcon />
                </IconButton>
            </TableCell>
            <TableCell className={classes.tableCell}>
                <RunStatusTag run={run} />
            </TableCell>
        </TableRow>
    );
}, areHeaterRunPropsEqual);

const useRunStatusStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        statusCommon: {
            ...theme.typography.button,
            border: `solid 1px`,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(1),
            width: 'fit-content'
        },
        isEquilibrating: {
            color: brown[300],
            borderColor: brown[300]
        },
        isHoldingSetpoint: {
            color: yellow[300],
            borderColor: yellow[300]
        },
        isFinished: {
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main
        },
        isInvalid: { color: red[500], borderColor: red[500] },
        isWaiting: { color: grey[500], borderColor: grey[500] }
    })
);

interface RunStatusProps {
    run: Run;
}

const RunStatusTag = (props: RunStatusProps) => {
    let classes = useRunStatusStyles();
    let content = null;
    if (!props.run.isRunning)
        content = <div className={clsx(classes.statusCommon, classes.isWaiting)}>Waiting</div>;
    if (props.run.isEquilibrating)
        content = (
            <div className={clsx(classes.statusCommon, classes.isEquilibrating)}>Equilibrating</div>
        );
    if (props.run.isHoldingSetpoint)
        content = (
            <div className={clsx(classes.statusCommon, classes.isHoldingSetpoint)}>
                Holding Setpoint
            </div>
        );
    if (props.run.isFinished)
        content = <div className={clsx(classes.statusCommon, classes.isFinished)}>Finished</div>;
    if (props.run.isDirty && !isRunValid(props.run))
        content = <div className={clsx(classes.statusCommon, classes.isInvalid)}>Invalid Run</div>;

    return <div className={classes.root}>{content}</div>;
};

const mapDispatch = (dispatch: Dispatch) => ({
    deleteHeaterRunRow: (heaterId: string, index: number) => dispatch(deleteRun(heaterId, index)),
    editHeaterRunRow: (heaterId: string, index: number, attribute: string, value: string) =>
        dispatch(editRunAttributes(heaterId, index, { [attribute]: value }))
});

export default connect(
    null,
    mapDispatch
)(HeaterRunRow);
