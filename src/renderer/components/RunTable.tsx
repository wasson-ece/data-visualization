import * as React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Run from '../../interfaces/Run';
import HeaterRunRow from './HeaterRunRow';

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

export interface RunTableProps {
    id: string;
    runs: Run[];
}

export default function RunTable(props: RunTableProps) {
    const classes = useStyles();

    const { runs, id } = props;

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
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {runs.map((run, index) => (
                        <HeaterRunRow
                            run={run}
                            key={`${id}-${index}`}
                            heaterId={id}
                            runIndex={index}
                        />
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
