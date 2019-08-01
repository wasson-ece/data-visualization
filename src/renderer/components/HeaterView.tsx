import * as React from 'react';
import TabMenu from './TabMenu';
import Heater from '../../ti-components/controllers/Heater';
import { RootState } from '../reducers/root';
import { connect } from 'react-redux';
import HeaterDetails from './HeaterDetails';
import { Point } from 'electron';
import Run from '../../interfaces/Run';
import RunTable from './RunTable';
import { Theme, withStyles } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import { number } from 'prop-types';
const uuidv1 = require('uuid/v1');

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

interface HeaterViewState {}

class HeaterView extends React.Component<HeaterViewProps, HeaterViewState> {
    heaterRunsLoop: NodeJS.Timeout | null;

    constructor(props: HeaterViewProps) {
        super(props);
        this.state = {};
        this.heaterRunsLoop = null;
    }

    handleCurrentRunStatus = () => {};

    handleAbortCurrentRun = () => {};

    handleStartNextRun = (run: Run) => {
        sendRunPIDParameters(Number());
    };

    handleEndCurrentRun = (run: Run) => {};

    handleStartRuns = () => {
        this.heaterRunsLoop = setInterval(this.handleCurrentRunStatus, 100);
    };

    handleStopRuns = () => {
        this.handleAbortCurrentRun();
    };

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
                    {heater && (
                        <RunTable
                            id={id}
                            runs={heaterRuns[id] || [{ uuid: uuidv1(), isFinished: false }]}
                            currentRun={{
                                uuid: 'abdc',
                                baseline: '20',
                                setpoint: '-3',
                                equilibrationTime: '4.5',
                                setpointHoldTime: '15',
                                kp: '10',
                                ki: '10',
                                kd: '20',
                                isFinished: false
                            }}
                            currentRunStatus={{
                                runId: 'abdc',
                                ovenId: '3',
                                equilibrationStartTime: Date.now(),
                                setpointStartTime: null,
                                finishTime: null
                            }}
                            onStartRuns={this.handleStartRuns}
                            onStopRuns={this.handleStopRuns}
                        />
                    )}
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
