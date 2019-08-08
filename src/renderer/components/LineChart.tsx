import * as React from 'react';
// @ts-ignore
import {
    FlexibleWidthXYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    LineSeriesCanvas,
    Highlight,
    ChartLabel
    // @ts-ignore
} from 'react-vis';
import { withStyles, Theme } from '@material-ui/core';
import { Point } from 'electron';
import { theme } from '../../style/theme';
import has from '../../util/has';
require('react-vis/dist/style.css');

interface LineChartProps {
    data: Point[];
    classes: any;
    height?: number;
    setpoint?: number;
}

interface LineChartState {
    drawBounds?: DrawBounds;
    area?: number;
}

interface DrawBounds {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

class LineChart extends React.Component<LineChartProps, LineChartState> {
    constructor(props: LineChartProps) {
        super(props);
        this.state = {};
    }

    DEFAULT_HEIGHT = 300;

    tickFormat = (x: number) => {
        if (!this.props.data[0]) return '';
        return String(((x - this.props.data[0].x) / 60000).toFixed(3));
    };

    render() {
        const { data, classes, height, setpoint } = this.props;
        const { drawBounds, area } = this.state;
        const setpointLine =
            (has(setpoint) &&
                data &&
                data.length > 1 && [
                    { x: data[0].x, y: setpoint },
                    { x: data[data.length - 1].x, y: setpoint }
                ]) ||
            [];

        if (!data || !(data.length > 2)) return null;

        return (
            <div className={classes.root}>
                <FlexibleWidthXYPlot
                    xDomain={drawBounds && [drawBounds.left, drawBounds.right]}
                    yDomain={drawBounds && [drawBounds.bottom, drawBounds.top]}
                    height={height || this.DEFAULT_HEIGHT}
                    margin={{ left: 50 }}
                >
                    <HorizontalGridLines />
                    <YAxis title="Temperature °C" />
                    <XAxis tickFormat={this.tickFormat} title="Minutes" />
                    <LineSeriesCanvas data={data} color={theme.palette.primary.main} />
                    {(has(setpoint) && setpointLine && (
                        <LineSeriesCanvas
                            data={setpointLine}
                            color={theme.palette.secondary.main}
                        />
                    )) ||
                        undefined}
                    <Highlight
                        onBrushEnd={(nextDrawBounds: DrawBounds) => {
                            this.setState({ drawBounds: nextDrawBounds });
                        }}
                        onDrag={(nextDrawArea: DrawBounds) => {
                            let dy = nextDrawArea.top - nextDrawArea.bottom;
                            let dx = nextDrawArea.right - nextDrawArea.left;
                            this.setState({
                                drawBounds: {
                                    bottom:
                                        (drawBounds && drawBounds.bottom + dy) ||
                                        nextDrawArea.bottom,
                                    top: (drawBounds && drawBounds.top + dy) || nextDrawArea.top,
                                    left: (drawBounds && drawBounds.left - dx) || nextDrawArea.left,
                                    right:
                                        (drawBounds && drawBounds.right - dy) || nextDrawArea.right
                                }
                            });
                        }}
                    />
                </FlexibleWidthXYPlot>
            </div>
        );
    }
}

const styles = (theme: Theme) => ({
    root: {
        width: '100%'
    },
    title: {}
});

export default withStyles(styles)(LineChart);
