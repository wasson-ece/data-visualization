import * as React from 'react';
import ParameterControl from './ParameterControl';
import {
    TextField,
    InputAdornment,
    withStyles,
    Theme,
    FormLabel,
    FormGroup,
    FormControl
} from '@material-ui/core';
import LineChart from './LineChart';
import { tiClient } from '../../ti-communication/ti';
import Command from 'node-ti/build/enums/command';
import HeaterState from '../../interfaces/HeaterState';
import Run from '../../interfaces/Run';

interface HeaterDetailsProps {
    heater: HeaterState;
    isCollectingData: boolean;
    classes: any;
    currentRun?: Run;
    onChangeLabel: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface HeaterDetailsState {}

class HeaterDetails extends React.Component<HeaterDetailsProps, HeaterDetailsState> {
    constructor(props: HeaterDetailsProps) {
        super(props);
    }

    handleSendKpParameter = async (value: number) => {
        await tiClient.sendPIDParameter(Number(this.props.heater.id), Command.SetPVal, value);
    };

    handleSendKiParameter = async (value: number) => {
        await tiClient.sendPIDParameter(Number(this.props.heater.id), Command.SetIVal, value);
    };

    handleSendKdParameter = async (value: number) => {
        await tiClient.sendPIDParameter(Number(this.props.heater.id), Command.SetDVal, value);
    };

    handleSendSetpoint = async (value: number) => {
        await tiClient.sendSetpoint(Number(this.props.heater.id), value);
    };

    render = () => {
        const { heater, classes, onChangeLabel, isCollectingData, currentRun } = this.props;
        let setpoint: number | undefined = undefined;
        if (currentRun && currentRun.isEquilibrating) setpoint = Number(currentRun.baseline);
        else if (currentRun && currentRun.isHoldingSetpoint) setpoint = Number(currentRun.setpoint);

        return (
            <div>
                <div className={classes.readingsAndControlContainer}>
                    <div className={classes.readingsAndControl}>
                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormLabel className={classes.formLabel}>Temperature</FormLabel>
                            <FormGroup className={classes.formGroup}>
                                <TextField
                                    label="Actual"
                                    className={classes.truncatedTextField}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    disabled
                                    type="number"
                                    value={heater.actual && heater.actual.toFixed(3)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment
                                                position="start"
                                                className={classes.adornment}
                                            >
                                                <div>°C</div>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <ParameterControl
                                    title="Setpoint"
                                    current={heater.setpoint}
                                    units="°C"
                                    onChangeSetpoint={this.handleSendSetpoint}
                                />
                            </FormGroup>
                        </FormControl>
                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormLabel className={classes.formLabel}>PID Values</FormLabel>
                            <FormGroup className={classes.formGroup}>
                                <ParameterControl
                                    title="Kp"
                                    current={heater.kp}
                                    units=""
                                    onChangeSetpoint={this.handleSendKpParameter}
                                />
                                <ParameterControl
                                    title="Ki"
                                    current={heater.ki}
                                    units=""
                                    onChangeSetpoint={this.handleSendKiParameter}
                                />
                                <ParameterControl
                                    title="Kd"
                                    current={heater.kd}
                                    units=""
                                    onChangeSetpoint={this.handleSendKdParameter}
                                />
                            </FormGroup>
                        </FormControl>
                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormLabel className={classes.formLabel}>Metadata</FormLabel>
                            <FormGroup className={classes.formGroup}>
                                <TextField
                                    label="Heater Identifier"
                                    value={heater.label}
                                    onChange={onChangeLabel}
                                    className={classes.truncatedTextField}
                                    InputProps={{
                                        inputProps: {
                                            style: { fontSize: 28 }
                                        }
                                    }}
                                />
                            </FormGroup>
                        </FormControl>
                    </div>
                </div>
                <div className={classes.chart}>
                    <LineChart height={500} data={heater.data || []} setpoint={setpoint} />
                </div>
            </div>
        );
    };
}

const styles = (theme: Theme) => ({
    readingsAndControlContainer: {
        display: 'grid',
        justifyContent: 'center',
        marginBottom: theme.spacing(2)
    },
    readingsAndControl: {
        display: 'grid',
        gridTemplateColumns: 'min-content min-content min-content',
        gridGap: `0px ${theme.spacing(3)}px`,
        justifyItems: 'center'
    },
    formControl: {
        backgroundColor: '#424242',
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2)
    },
    formLabel: { paddingLeft: theme.spacing(1), marginBottom: theme.spacing(1) },
    formGroup: {
        paddingLeft: theme.spacing(2),
        display: 'grid',
        gridGap: `${theme.spacing(3)}px 0px`
    },
    truncatedTextField: {
        width: 200
    },
    hidden: {
        display: 'none'
    },
    chart: {
        padding: theme.spacing(3)
    }
});

export default withStyles(styles)(HeaterDetails);
