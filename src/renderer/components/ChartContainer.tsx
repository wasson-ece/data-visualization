import * as React from 'react';
import LineChart from './LineChart';
import SetpointControl from './SetpointControl';
import TICommunicationClient from 'node-ti/build/lib/ti-communication-client';
import HeaterComponent from 'node-ti/build/ti-components/heater-component';
import { Point } from 'electron';

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

interface ChartContainerProps {}

interface ChartContainerState {
    heater1Data: Point[];
}

class ChartContainer extends React.Component<ChartContainerProps, ChartContainerState> {
    client: TICommunicationClient;
    readData: NodeJS.Timeout;

    constructor(props: ChartContainerProps) {
        super(props);
        this.client = new TICommunicationClient('10.8.0.128', '1025');
        this.state = { heater1Data: [] };
        this.readData = setInterval(async () => {
            let heaters: HeaterComponent[] = await this.client.getGCStatus();
            let heater1: HeaterComponent = heaters.find(h => h.id === 0);
            console.log({ x: Date.now(), y: heater1.temperature });
            console.log('hi');

            this.setState({
                heater1Data: [...this.state.heater1Data, { x: Date.now(), y: heater1.temperature }]
            });
        }, 1000);
    }

    render() {
        return (
            <div>
                <LineChart data={this.state.heater1Data} height={800} />
                <SetpointControl
                    title="Cooling Oven"
                    actual={20}
                    units="°C"
                    onChangeSetpoint={(v: number) => console.log(v)}
                />
            </div>
        );
    }
}

export default ChartContainer;
