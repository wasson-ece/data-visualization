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
import { RouteComponentProps } from 'react-router-dom';

interface HeaterRouteProps {
    id: string;
}

interface HeaterViewProps extends RouteComponentProps<HeaterRouteProps> {
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
        const id = this.props.match.params.id;
        const heater = heaters.find(h => h.id == id);
        return (
            <div className={classes.root}>
                <div className={classes.details}>
                    {heater && (
                        <HeaterDetails
                            heater={heater}
                            key={heater.id}
                            data={heaterData[heater.id]}
                        />
                    )}
                    {heater && <RunTable id={id} runs={heaterRuns[id] || [{}]} />}
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
    root: {},
    details: {
        padding: theme.spacing(3)
    }
});

export default connect(mapState)(withStyles(styles)(HeaterView));
