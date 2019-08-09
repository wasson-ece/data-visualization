import * as React from 'react';
import { createStyles, Theme, makeStyles, lighten } from '@material-ui/core/styles';
import Run from '../../interfaces/Run';
import { TextField, FormLabel } from '@material-ui/core';
import { remainingMinutes, minutesToString } from '../../util/heater-timing';

export interface RunStatusProps {
    currentRun: Run;
}

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

export default function(props: RunStatusProps) {
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
}
