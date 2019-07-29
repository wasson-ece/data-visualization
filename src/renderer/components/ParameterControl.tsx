import * as React from 'react';
import { withStyles, Theme, TextField, Button, InputAdornment } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

interface ParameterControlProps {
    classes: any;
    title: string;
    current: number;
    units: string;
    onChangeSetpoint: (setpoint: number) => void;
}

interface ParameterControlState {
    isDirty: boolean;
    newSetpointValue: string;
}

class ParameterControl extends React.Component<ParameterControlProps, ParameterControlState> {
    constructor(props: ParameterControlProps) {
        super(props);
        this.state = { isDirty: false, newSetpointValue: '' };
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ isDirty: true, newSetpointValue: e.target.value });
    };

    handleChangeValue = () => {
        const { newSetpointValue } = this.state;
        const { onChangeSetpoint } = this.props;

        onChangeSetpoint(Number(newSetpointValue));

        this.setState({ isDirty: false });
    };

    render() {
        const { classes, title, current, units, onChangeSetpoint } = this.props;
        const { isDirty, newSetpointValue } = this.state;

        return (
            <div className={classes.root}>
                <TextField
                    label={title}
                    InputLabelProps={{
                        shrink: true
                    }}
                    type="number"
                    value={isDirty ? newSetpointValue : current}
                    InputProps={{
                        inputProps: {
                            min: -273.15,
                            max: 500,
                            step: 0.01,
                            style: {
                                fontSize: 48
                            }
                        },
                        endAdornment: (
                            <InputAdornment position="start" className={classes.adornment}>
                                <div>{units}</div>
                            </InputAdornment>
                        )
                    }}
                    onChange={this.handleChange}
                />
                <div className={classes.sendButtonContainer}>
                    {isDirty && (
                        <Button
                            className={classes.sendSetpointButton}
                            onClick={this.handleChangeValue}
                        >
                            <span className={classes.buttonText}>Send Value</span>
                            <SendIcon />
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}

const styles = (theme: Theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '200px auto',
        width: 'fit-content'
    },
    sendButtonContainer: {
        marginLeft: theme.spacing(2)
    },
    sendSetpointButton: {
        position: 'relative',
        top: '25%'
    },
    input: {
        fontSize: '50px'
    },
    adornment: {
        color: '#666'
    },
    buttonText: {
        marginRight: theme.spacing(1)
    }
});

export default withStyles(styles as any)(ParameterControl);
