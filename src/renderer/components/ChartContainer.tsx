import * as React from 'react';
import LineChart from './LineChart';
import SetpointControl from './SetpointControl';
import TICommunicationClient from 'node-ti/build/lib/ti-communication-client';
import HeaterComponent from 'node-ti/build/ti-components/heater-component';
import { Point } from 'electron';

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
