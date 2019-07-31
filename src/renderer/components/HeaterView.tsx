import * as React from 'react';
import TabMenu from './TabMenu';
import Heater from '../../ti-components/controllers/Heater';
import { RootState } from '../reducers';
import { connect } from 'react-redux';
import HeaterDetails from './HeaterDetails';
import { Point } from 'electron';
import Run from '../../interfaces/Run';
import RunTable from './RunTable';
import { Theme, withStyles } from '@material-ui/core';

interface HeaterViewProps {
    heaters: Heater[];
    heaterData: {
        [heaterId: string]: Point[];
    };
    heaterRuns: {
        [heaterIndex: string]: Run[];
    };
    classes: any;
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
        const { heaters, heaterData, heaterRuns, classes } = this.props;
        const { selectedHeater } = this.state;
        const heater = selectedHeater != undefined && heaters[selectedHeater];
        return (
            <div className={classes.root}>
                <TabMenu
                    options={heaters.map(heater => ({
                        id: heater.id,
                        label: `Heater ${heater.id}`
                    }))}
                    value={this.state.selectedHeater}
                    onChange={this.handleSelectHeater}
                />
                <div className={classes.details}>
                    {heater && (
                        <HeaterDetails
                            heater={heater}
                            key={heater.id}
                            data={heaterData[heater.id]}
                        />
                    )}
                    {heater && <RunTable id={heater.id} runs={heaterRuns[heater.id] || [{}]} />}
                </div>
            </div>
        );
    };
}

const mapState = (state: RootState) => ({
    heaters: state.controllers.heaters,
    heaterData: state.controllerData.heaters,
    heaterRuns: state.heaterRuns
});

const styles = (theme: Theme) => ({
    root: {
        boxSizing: 'border-box'
    },
    details: {
        padding: theme.spacing(3)
    }
});

export default connect(mapState)(withStyles(styles)(HeaterView));
