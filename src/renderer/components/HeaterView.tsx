import * as React from 'react';
import TabMenu from './TabMenu';
import Heater from '../../ti-components/controllers/Heater';
import { RootState } from '../reducers';
import { connect } from 'react-redux';
import HeaterDetails from './HeaterDetails';
import { Point } from 'electron';

interface HeaterViewProps {
    heaters: Heater[];
    heaterData: {
        [heaterId: string]: Point[];
    };
}

interface HeaterViewState {
    selectedHeater?: number;
}

class HeaterView extends React.Component<HeaterViewProps, HeaterViewState> {
    constructor(props: HeaterViewProps) {
        super(props);
        this.state = {};
    }

    handleSelectHeater = (event: React.ChangeEvent<{}>, newValue: number) =>
        this.setState({ selectedHeater: newValue });

    render = () => {
        const { heaters, heaterData } = this.props;
        const { selectedHeater } = this.state;
        const heater = selectedHeater != undefined && heaters[selectedHeater];
        return (
            <div>
                <TabMenu
                    options={heaters.map(heater => ({
                        id: heater.id,
                        label: `Heater ${heater.id}`
                    }))}
                    value={this.state.selectedHeater}
                    onChange={this.handleSelectHeater}
                />
                {heater && (
                    <HeaterDetails heater={heater} key={heater.id} data={heaterData[heater.id]} />
                )}
            </div>
        );
    };
}

const mapState = (state: RootState) => ({
    heaters: state.controllers.heaters,
    heaterData: state.controllerData.heaters
});

export default connect(mapState)(HeaterView);
