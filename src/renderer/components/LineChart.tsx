import * as React from 'react';
// @ts-ignore
import { curveCatmullRom } from 'd3-shape';
import {
    FlexibleWidthXYPlot,
    XAxis,
    YAxis,
    ChartLabel,
    HorizontalGridLines,
    VerticalGridLines,
    LineSeries,
    LineSeriesCanvas,
    Highlight
    // @ts-ignore
} from 'react-vis';
import {
    withStyles,
    Theme,
    Button,
    Paper,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Typography
} from '@material-ui/core';
require('react-vis/dist/style.css');

function generateSeededRandom(baseSeed = 2): Function {
    let seed = baseSeed;
    return function seededRandom(max: number, min: number) {
        max = max || 1;
        min = min || 0;

        seed = (seed * 9301 + 49297) % 233280;
        const rnd = seed / 233280;

        return min + rnd * (max - min);
    };
}

const seededRandom = generateSeededRandom(9);
const totalValues = 30000;

/**
 * Get the array of x and y pairs.
 * The function tries to avoid too large changes of the chart.
 * @param {number} total Total number of values.
 * @returns {Array} Array of data.
 * @private
 */
function getRandomSeriesData(total: number) {
    const result = [];
    let lastY = seededRandom() * 40 - 20;
    let y;
    const firstY = lastY;
    for (let i = 0; i < total; i++) {
        y = seededRandom() * firstY - firstY / 2 + lastY;
        result.push({
            x: i,
            y
        });
        lastY = y;
    }
    return result;
}

class ZoomableChartExample extends React.Component {
    state = {
        lastDrawLocation: null,
        series: [
            {
                data: getRandomSeriesData(totalValues),
                disabled: false,
                title: 'Apples'
            }
        ]
    };

    render() {
        const { series, lastDrawLocation } = this.state;
        //@ts-ignore
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <FlexibleWidthXYPlot
                    animation
                    xDomain={
                        //@ts-ignore
                        lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]
                    }
                    yDomain={
                        //@ts-ignore
                        lastDrawLocation && [lastDrawLocation.bottom, lastDrawLocation.top]
                    }
                    height={300}
                >
                    <HorizontalGridLines />

                    <YAxis />
                    <XAxis />

                    {series.map(entry => (
                        <LineSeriesCanvas key={entry.title} data={entry.data} />
                    ))}

                    <Highlight
                        onBrushEnd={(area: number) => this.setState({ lastDrawLocation: area })}
                        onDrag={(area: number) => {
                            this.setState({
                                lastDrawLocation: {
                                    // @ts-ignore
                                    bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                                    // @ts-ignore
                                    left: lastDrawLocation.left - (area.right - area.left),
                                    // @ts-ignore
                                    right: lastDrawLocation.right - (area.right - area.left),
                                    // @ts-ignore
                                    top: lastDrawLocation.top + (area.top - area.bottom)
                                }
                            });
                        }}
                    />
                </FlexibleWidthXYPlot>
                <Button
                    className={classes.resetButton}
                    onClick={() => this.setState({ lastDrawLocation: null })}
                    color="secondary"
                    variant="contained"
                >
                    Reset Zoom
                </Button>
                <Paper className={classes.tableRoot}>
                    <Typography className={classes.title} variant="h5">
                        Last Zoom Attributes
                    </Typography>
                    <Table className={classes.table}>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Top
                                </TableCell>
                                <TableCell align="right">
                                    {//@ts-ignore
                                    lastDrawLocation && lastDrawLocation.top}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Right
                                </TableCell>
                                <TableCell align="right">
                                    {//@ts-ignore
                                    lastDrawLocation && lastDrawLocation.right}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Bottom
                                </TableCell>
                                <TableCell align="right">
                                    {//@ts-ignore
                                    lastDrawLocation && lastDrawLocation.bottom}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Left
                                </TableCell>
                                <TableCell align="right">
                                    {//@ts-ignore
                                    lastDrawLocation && lastDrawLocation.left}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

const styles = (theme: Theme) => ({
    root: {
        height: '100%',
        padding: 16,
        display: 'grid'
    },
    tableRoot: {
        marginTop: theme.spacing(3),
        overflowX: 'auto' as 'auto',
        width: 650,
        margin: '0 auto'
    },
    table: {},
    title: {
        margin: 16
    }
});

export default withStyles(styles)(ZoomableChartExample);
