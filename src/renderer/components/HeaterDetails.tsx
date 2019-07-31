import * as React from 'react';
import Heater from '../../ti-components/controllers/Heater';
import ParameterControl from './ParameterControl';
import { TextField, InputAdornment, withStyles, Theme } from '@material-ui/core';
import LineChart from './LineChart';
import { tiClient } from '../../ti-communication/ti';
import Command from 'node-ti/build/enums/command';
import { Point } from 'electron';

interface HeaterDetailsProps {
    heater: Heater;
    classes: any;
    data: Point[];
}

interface HeaterDetailsState {
    // selectedHeater?: string;
}

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
        const { heater, classes, data } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.readings}>
                    <TextField
                        label="Temperature"
                        className={classes.actual}
                        InputLabelProps={{
                            shrink: true
                        }}
                        disabled
                        type="number"
                        value={heater.actual}
                        InputProps={{
                            inputProps: {
                                min: -273.15,
                                max: 500,
                                step: 0.01,
                                style: { fontSize: 48 }
                            },
                            endAdornment: (
                                <InputAdornment position="start" className={classes.adornment}>
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
                </div>
                <div className={classes.pidTune}>
                    <ParameterControl
                        title="Kp"
                        current={heater.kP}
                        units=""
                        onChangeSetpoint={this.handleSendKpParameter}
                    />
                    <ParameterControl
                        title="Ki"
                        current={heater.kI}
                        units=""
                        onChangeSetpoint={this.handleSendKiParameter}
                    />
                    <ParameterControl
                        title="Kd"
                        current={heater.kD}
                        units=""
                        onChangeSetpoint={this.handleSendKdParameter}
                    />
                </div>
                <div>
                    <LineChart height={500} data={data} setpoint={heater.setpoint} />
                </div>
            </div>
        );
    };
}

const styles = (theme: Theme) => ({
    readings: {
        width: 'fit-content',
        margin: '0 auto',
        marginBottom: theme.spacing(3),
        display: 'grid',
        gridTemplateColumns: '200px 200px',
        gridGap: `${theme.spacing(3)}px`
    },
    pidTune: {
        width: 'fit-content',
        margin: '0 auto',
        marginBottom: theme.spacing(3),
        display: 'grid',
        gridTemplateColumns: '200px 200px 200px',
        gridGap: `200px`
    }
});

export default withStyles(styles)(HeaterDetails);
