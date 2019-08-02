import * as React from 'react';
import LineChart from './LineChart';
import ParameterControl from './ParameterControl';

interface ChartContainerProps {}

interface ChartContainerState {}

class ChartContainer extends React.Component<ChartContainerProps, ChartContainerState> {
    constructor(props: ChartContainerProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <LineChart data={[]} height={800} />
                <ParameterControl
                    title="Cooling Oven"
                    current={20}
                    units="°C"
                    onChangeSetpoint={(v: number) => console.log(v)}
                />
            </div>
        );
    }
}

export default ChartContainer;
