import * as React from 'react';
// @ts-ignore
import {
    FlexibleWidthXYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    LineSeriesCanvas,
    LineSeries,
    Highlight
    // @ts-ignore
} from 'react-vis';
import { withStyles, Theme } from '@material-ui/core';
import { Point } from 'electron';
require('react-vis/dist/style.css');

interface LineChartProps {
    data: Point[];
    classes: any;
    height?: number;
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

    render() {
        const { data, classes, height } = this.props;
        const { drawBounds, area } = this.state;

        return (
            <div className={classes.root}>
                <FlexibleWidthXYPlot
                    animation
                    xDomain={drawBounds && [drawBounds.left, drawBounds.right]}
                    yDomain={drawBounds && [drawBounds.bottom, drawBounds.top]}
                    height={height || this.DEFAULT_HEIGHT}
                >
                    <HorizontalGridLines />
                    <YAxis />
                    <XAxis />
                    <LineSeriesCanvas data={data} />
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
