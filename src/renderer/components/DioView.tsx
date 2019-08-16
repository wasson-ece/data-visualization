import * as React from 'react';
import { Theme, createStyles, makeStyles, Switch, FormControlLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers';

interface DioProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'grid',
            gridAutoFlow: 'column',
            gridTemplateRows: 'repeat(8, 1fr)',
            gridGap: `${theme.spacing(2)}px ${theme.spacing(6)}px`,
            justifyContent: 'center',
            paddingTop: `${theme.spacing(3)}px`
        },
        readingLabel: {
            ...theme.typography.button,
            letterSpacing: '0.05em',
            color: '#989595'
        }
    })
);

function DioView(props: DioProps) {
    const classes = useStyles();
    const readings = useSelector((state: RootState) => state.dio.readings);

    return (
        <div className={classes.root}>
            {readings.map((reading, i) => (
                <FormControlLabel
                    className={classes.readingLabel}
                    key={i}
                    control={<Switch checked={reading} />}
                    label={`DIO ${i}`}
                    labelPlacement="top"
                />
            ))}
        </div>
    );
}

export default DioView;
