import * as React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: theme.spacing(3),
            overflowX: 'auto'
        },
        table: {
            minWidth: 650
        },
        runFinished: {
            backgroundColor: '#443939'
        }
    })
);

export default function RunTable() {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Kp</TableCell>
                        <TableCell>Ki</TableCell>
                        <TableCell>Kd</TableCell>
                        <TableCell>Baseline Temperature (°C)</TableCell>
                        <TableCell>Setpoint Temperature (°C)</TableCell>
                        <TableCell>Equilibration Time (Minutes)</TableCell>
                        <TableCell>Setpoint Hold Time (Minutes)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>6</TableCell>
                        <TableCell>7</TableCell>
                    </TableRow>
                    <TableRow className={classes.runFinished}>
                        <TableCell>1</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>6</TableCell>
                        <TableCell>7</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <TextField />
                        </TableCell>
                        <TableCell>
                            <TextField />
                        </TableCell>
                        <TableCell>
                            <TextField />
                        </TableCell>
                        <TableCell>
                            <TextField />
                        </TableCell>
                        <TableCell>
                            <TextField />
                        </TableCell>
                        <TableCell>
                            <TextField />
                        </TableCell>
                        <TableCell>
                            <TextField />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>
    );
}
