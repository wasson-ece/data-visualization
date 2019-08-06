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
import { updateHeaterAttributes } from '../actions/heater';

interface HeaterRouteProps {
    id: string;
}

interface HeaterViewProps extends RouteComponentProps<HeaterRouteProps> {
    heaters: HeaterState[];
    classes: any;
    startNextRun: (heaterId: string) => void;
    abortCurrentRun: (heaterId: string) => void;
    onChangeHeaterLabel: (heaterId: string, label: string) => void;
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
        const { heaters, classes, onChangeHeaterLabel } = this.props;
        const id = this.props.match.params.id;
        const heater = heaters.find(h => h.id == id);
        return (
            <div className={classes.root}>
                <div className={classes.details}>
                    {heater && (
                        <HeaterDetails
                            heater={heater}
                            key={heater.id}
                            onChangeLabel={this.handleChangeHeaterLabel}
                        />
                    )}
                    {heater && (
                        <RunTable
                            id={id}
                            runs={heater.runs}
                            currentRun={heater.runs.find(r => r.isRunning)}
                            onStartRuns={() => this.props.startNextRun(heater.id)}
                            onStopRuns={() => this.props.abortCurrentRun(heater.id)}
                        />
                    )}
                </div>
            </div>
        );
    };
}

const mapState = (state: RootState) => ({
    heaters: state.heaters
});

const mapDispatch = (dispatch: Dispatch) => ({
    startNextRun: (heaterId: string) => dispatch(startNextRun(heaterId)),
    abortCurrentRun: (heaterId: string) => dispatch(abourtRun(heaterId)),
    onChangeHeaterLabel: (heaterId: string, label: string) =>
        dispatch(updateHeaterAttributes(heaterId, { label }))
});

const styles = (theme: Theme) => ({
    root: {},
    details: {
        padding: theme.spacing(3)
    }
});

export default connect(
    mapState,
    mapDispatch
)(withStyles(styles)(HeaterView));
