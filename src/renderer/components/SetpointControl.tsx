import * as React from 'react';
import { withStyles, Theme, TextField, Button, InputAdornment } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

interface SetpointControlProps {
    classes: any;
    title: string;
    actual: number;
    isDirty: boolean;
    units: string;
    onChangeSetpoint: (setpoint: number) => void;
}

interface SetpointControlState {
    isDirty: boolean;
    newSetpointValue: string;
}

class SetpointControl extends React.Component<SetpointControlProps, SetpointControlState> {
    constructor(props: SetpointControlProps) {
        super(props);
        this.state = { isDirty: false, newSetpointValue: '' };
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ isDirty: true, newSetpointValue: e.target.value });
    };

    handleChangeSetpoint = () => {
        const { newSetpointValue } = this.state;
        const { onChangeSetpoint } = this.props;

        onChangeSetpoint(Number(newSetpointValue));

        this.setState({ isDirty: false });
    };

    render() {
        const { classes, title, actual, units, onChangeSetpoint } = this.props;
        const { isDirty, newSetpointValue } = this.state;

        return (
            <div className={classes.root}>
                <TextField
                    label={title}
                    InputLabelProps={{
                        shrink: true
                    }}
                    inputProps={{ style: { fontSize: 32 } }}
                    type="number"
                    value={isDirty ? newSetpointValue : actual}
                    InputProps={{
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
                            onClick={this.handleChangeSetpoint}
                        >
                            <span className={classes.buttonText}>Send Setpoint</span>
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
        gridTemplateColumns: '120px auto',
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

export default withStyles(styles)(SetpointControl);
