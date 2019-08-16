import * as React from 'react';
import { Theme, createStyles, makeStyles, TextField } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers';

interface AnalogProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'grid',
            gridAutoFlow: 'column',
            gridTemplateRows: 'repeat(4, 1fr)',
            gridGap: `${theme.spacing(2)}px ${theme.spacing(6)}px`,
            justifyContent: 'center',
            paddingTop: `${theme.spacing(3)}px`
        }
    })
);

function AnalogView(props: AnalogProps) {
    const classes = useStyles();
    const readings = useSelector((state: RootState) => state.analog.readings);

    return (
        <div className={classes.root}>
            {readings.map((reading, i) => (
                <TextField
                    label={`Analog ${i}`}
                    disabled
                    value={reading}
                    key={i}
                    InputProps={{
                        inputProps: {
                            style: {
                                fontSize: 28
                            }
                        }
                    }}
                />
            ))}
        </div>
    );
}

export default AnalogView;
