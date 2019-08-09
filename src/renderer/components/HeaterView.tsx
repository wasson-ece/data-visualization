import * as React from 'react';
import { RootState } from '../reducers';
import { connect } from 'react-redux';
import HeaterDetails from './HeaterDetails';
import RunTable from './RunTable';
import { Theme, withStyles } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import HeaterState from '../../interfaces/HeaterState';
import { Dispatch } from 'redux';
import { startNextRun, abourtRun } from '../actions/Run';
import { updateHeaterAttributes, clearFinishedRuns } from '../actions/heater';
import RunStatusPanel from './RunStatusPanel';

interface HeaterRouteProps {
    id: string;
}

interface HeaterViewProps extends RouteComponentProps<HeaterRouteProps> {
    heaters: HeaterState[];
    isCollectingData: boolean;
    classes: any;
    startNextRun: (heaterId: string) => void;
    abortCurrentRun: (heaterId: string) => void;
    onChangeHeaterLabel: (heaterId: string, label: string) => void;
    clearFinishedRuns: (heaterId: string) => void;
}

interface HeaterViewState {}

class HeaterView extends React.Component<HeaterViewProps, HeaterViewState> {
    constructor(props: HeaterViewProps) {
        super(props);
        this.state = {};
    }

    handleChangeHeaterLabel = (e: React.ChangeEvent<HTMLInputElement>) =>
        this.props.onChangeHeaterLabel(this.props.match.params.id, e.target.value);

    render = () => {
        const { heaters, classes, isCollectingData } = this.props;
        const id = this.props.match.params.id;
        const heater = heaters.find(h => h.id == id);
        if (!heater) return null;
        const currentRun = heater.runs.find(r => r.isRunning);
        return (
            <div className={classes.root}>
                <div className={classes.details}>
                    {heater && (
                        <HeaterDetails
                            heater={heater}
                            currentRun={currentRun}
                            key={heater.id}
                            onChangeLabel={this.handleChangeHeaterLabel}
                            isCollectingData={isCollectingData}
                        />
                    )}
                    <div className={classes.runStatusPanelContainer}>
                        {heater && currentRun && <RunStatusPanel currentRun={currentRun} />}
                    </div>
                    {heater && (
                        <RunTable
                            id={id}
                            runs={heater.runs}
                            currentRun={currentRun}
                            onStartRuns={() => this.props.startNextRun(heater.id)}
                            onStopRuns={() => this.props.abortCurrentRun(heater.id)}
                            onClearFinishedRuns={() => this.props.clearFinishedRuns(heater.id)}
                        />
                    )}
                </div>
            </div>
        );
    };
}

const mapState = (state: RootState) => ({
    heaters: state.heaters,
    isCollectingData: state.dataCollection.isCollectingData
});

const mapDispatch = (dispatch: Dispatch) => ({
    startNextRun: (heaterId: string) => dispatch(startNextRun(heaterId)),
    abortCurrentRun: (heaterId: string) => dispatch(abourtRun(heaterId)),
    onChangeHeaterLabel: (heaterId: string, label: string) =>
        dispatch(updateHeaterAttributes(heaterId, { label })),
    clearFinishedRuns: (heaterId: string) => dispatch(clearFinishedRuns(heaterId))
});

const styles = (theme: Theme) => ({
    root: {},
    details: {
        padding: theme.spacing(3)
    },
    runStatusPanelContainer: {
        display: 'grid',
        justifyContent: 'center'
    }
});

export default connect(
    mapState,
    mapDispatch
)(withStyles(styles)(HeaterView));
