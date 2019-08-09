import * as React from 'react';
import SidebarMenu from './SidebarMenu';
import { decodeGCStatus } from 'node-ti/build/lib/parse/parse-ti-response';
import HeaterComponent from 'node-ti/build/ti-components/heater-component';
import { withStyles } from '@material-ui/core';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { setHeaters, HeatersAction } from '../actions/heaters';
import { RootState } from '../reducers';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import HeaterView from './HeaterView';
import { ControllerSidebarItem } from '../../enums/SidebarItems';
import DioView from './DioView';
import EpcView from './EpcView';
import MfcView from './MfcView';
import { tiClient } from '../../ti-communication/ti';
import { toggleDataCollection, DataCollectionAction } from '../actions/dataCollection';
import Heater from '../../interfaces/Heater';
import {
    addHeaterDatum,
    updateHeaterAttributes,
    clearHeaterData,
    setHeaterRuns
} from '../actions/heater';
import HeaterState from '../../interfaces/HeaterState';
import Run from '../../interfaces/Run';
import HeaterDatum from '../../interfaces/HeaterDatum';
import {
    findActiveRun,
    areHeaterParamsWithinTolerance,
    reconcileHeaterRunParams
} from '../../util/heater-run';
import {
    isDoneEquilibrating,
    isDoneHoldingSetpoint,
    isReadyToStartRun
} from '../../util/heater-timing';
import {
    startEquilibration,
    startSetpointHold,
    finishCurrentRun,
    startNextRun
} from '../actions/run';
import {
    UnfinishedRuns,
    persistUnfinishedRuns,
    isUnfinishedRun
} from '../../middleware/persist-runs';
import { OvenLabels, persistOvenLabels } from '../../middleware/persist-oven-labels';

interface RootProps extends RouteComponentProps {
    classes: any;
    setHeaterBoards: (detectors: Heater[]) => void;
    addDatum: (id: string, datum: HeaterDatum) => void;
    updateHeater: (
        id: string,
        kp: number,
        ki: number,
        kd: number,
        setpoint: number,
        actual: number
    ) => void;
    toggleDataCollection: () => void;
    startOvenEquilibration: (ovenId: string) => void;
    startOvenSetpointHold: (ovenId: string) => void;
    finishOvenRun: (ovenId: string) => void;
    startNextOvenRun: (id: string) => void;
    clearRunData: (heaterId: string, runId: string) => void;
    setHeaterBoardRuns: (id: string, runs: Run[]) => void;
    updateHeaterLabel: (id: string, label: string) => void;
    heaters: HeaterState[];
    isCollectingData: boolean;
}

class Root extends React.Component<RootProps> {
    readData?: NodeJS.Timeout;
    reconcileHeaterParameters?: NodeJS.Timeout;
    persistUnfinishedRuns?: NodeJS.Timeout;
    persistOvenLabels?: NodeJS.Timeout;
    RECONCILIATION_CHECK_TIMEOUT = 2000;
    PERSIST_STATE_TIMEOUT = 10000;

    constructor(props: RootProps) {
        super(props);
        this.fetchComponents();
        this.reconcileHeaterParameters = setInterval(
            this.reconciliationLoop,
            this.RECONCILIATION_CHECK_TIMEOUT
        );

        this.persistUnfinishedRuns = setInterval(this.persistRunsLoop, this.PERSIST_STATE_TIMEOUT);
        this.persistOvenLabels = setInterval(
            this.persistOvenLabelsLoop,
            this.PERSIST_STATE_TIMEOUT
        );
    }

    reconciliationLoop = () => {
        const {
            startOvenEquilibration,
            startOvenSetpointHold,
            finishOvenRun,
            startNextOvenRun,
            clearRunData
        } = this.props;
        let heaters = this.props.heaters;
        heaters.forEach(heater => {
            let activeRun: Run | undefined = findActiveRun(heater);
            if (!activeRun) return;
            if (!areHeaterParamsWithinTolerance(heater, activeRun)) {
                reconcileHeaterRunParams(heater, activeRun);
            } else {
                if (isReadyToStartRun(activeRun)) {
                    startOvenEquilibration(heater.id);
                } else if (isDoneEquilibrating(activeRun)) {
                    startOvenSetpointHold(heater.id);
                } else if (isDoneHoldingSetpoint(activeRun)) {
                    finishOvenRun(heater.id);
                    startNextOvenRun(heater.id);
                    // Wait before clearing out previous run's data
                    setTimeout(() => clearRunData(heater.id, activeRun!.uuid), 5000);
                }
            }
        });
    };

    persistRunsLoop = () => {
        const validRunCount = this.props.heaters.reduce(
            (current: number, h: HeaterState) => current + h.runs.filter(isUnfinishedRun).length,
            0
        );
        if (validRunCount) persistUnfinishedRuns(this.props.heaters);
    };

    persistOvenLabelsLoop = () => {
        const validLabelsCount = this.props.heaters.reduce(
            (current: number, h: HeaterState) => current + h.label.length,
            0
        );
        if (validLabelsCount) persistOvenLabels(this.props.heaters);
    };

    componentWillReceiveProps = (nextProps: RootProps) => {
        /* Turn on/off data collection based on store state */
        if (nextProps.isCollectingData && !this.readData)
            this.readData = setInterval(this.refreshData, 400);
        if (!nextProps.isCollectingData && this.readData) {
            clearInterval(this.readData);
            this.readData = undefined;
        }
    };

    fetchComponents = async () => {
        await tiClient.connect();

        let heaters = await this.getData();

        this.props.setHeaterBoards(heaters);
        this.hydrateHeaterBoardRuns();
        this.hydrateHeaterLabels();
    };

    refreshData = async () => {
        let heaters = await this.getData();
        heaters.forEach(h => {
            let heater = this.props.heaters.find(cur => cur.id === h.id);

            if (!heater) return;
            let datum: HeaterDatum = {
                x: Date.now(),
                y: h.actual,
                runId: (heater && heater.currentRun) || ''
            };
            this.props.updateHeater(heater.id, h.kp, h.ki, h.kd, h.setpoint, h.actual);
            this.props.addDatum(heater.id, datum);
        });
    };

    getData = async (): Promise<Heater[]> => {
        let res = await tiClient.getGCStatus();
        const [tiComponents, methodStatus] = decodeGCStatus(res);
        let heaters: Heater[] = [];

        (tiComponents as HeaterComponent[]).forEach((component: HeaterComponent) => {
            heaters.push({
                id: String(component.id),
                setpoint: Number(component.setpoint.toFixed(2)),
                actual: component.temperature,
                kp: Number(component.pidTune.kp.toFixed(0)),
                ki: Number(component.pidTune.ki.toFixed(0)),
                kd: Number(component.pidTune.kd.toFixed(0)),
                output: component.output,
                data: []
            });
        });

        return heaters;
    };

    hydrateHeaterBoardRuns = () => {
        let unfinishedRunsString = localStorage.getItem('unfinishedRuns');
        if (!unfinishedRunsString) return;

        let unfinishedRuns: UnfinishedRuns = JSON.parse(unfinishedRunsString);
        Object.keys(unfinishedRuns).forEach((heaterId: string) => {
            this.props.setHeaterBoardRuns(heaterId, unfinishedRuns[heaterId]);
        });
    };

    hydrateHeaterLabels = () => {
        let ovenLabelsString = localStorage.getItem('ovenLabels');
        if (!ovenLabelsString) return;
        let ovenLabels: OvenLabels = JSON.parse(ovenLabelsString);
        Object.keys(ovenLabels).forEach((heaterId: string) => {
            this.props.updateHeaterLabel(heaterId, ovenLabels[heaterId]);
        });
    };

    render = () => {
        const { toggleDataCollection, heaters } = this.props;
        return (
            <div className={this.props.classes.root}>
                <SidebarMenu
                    isCollectingData={this.props.isCollectingData}
                    onToggleDataCollection={toggleDataCollection}
                    heaters={heaters}
                />
                <main>
                    <Route
                        path={`/controllers/${ControllerSidebarItem.Oven}/:id`}
                        component={HeaterView}
                    />
                    <Route
                        exact
                        path={`/controllers/${ControllerSidebarItem['Digital I/O (DIO)']}`}
                        component={DioView}
                    />
                    <Route
                        exact
                        path={`/controllers/${ControllerSidebarItem['Electronic Pressure (EPC)']}`}
                        component={EpcView}
                    />
                    <Route
                        exact
                        path={`/controllers/${ControllerSidebarItem['Mass Flow (MFC)']}`}
                        component={MfcView}
                    />
                </main>
            </div>
        );
    };
}

const mapDispatch = (dispatch: Dispatch<HeatersAction | DataCollectionAction>) => ({
    setHeaterBoards: (heaters: Heater[]) => dispatch(setHeaters(heaters)),
    setHeaterBoardRuns: (id: string, runs: Run[]) => dispatch(setHeaterRuns(id, runs)),
    addDatum: (id: string, datum: HeaterDatum) => dispatch(addHeaterDatum(id, datum)),
    updateHeater: (
        id: string,
        kp: number,
        ki: number,
        kd: number,
        setpoint: number,
        actual: number
    ) => dispatch(updateHeaterAttributes(id, { kp, ki, kd, setpoint, actual })),
    updateHeaterLabel: (id: string, label: string) =>
        dispatch(updateHeaterAttributes(id, { label })),
    toggleDataCollection: () => dispatch(toggleDataCollection()),
    startOvenEquilibration: (id: string) => dispatch(startEquilibration(id)),
    startOvenSetpointHold: (id: string) => dispatch(startSetpointHold(id)),
    finishOvenRun: (id: string) => dispatch(finishCurrentRun(id)),
    startNextOvenRun: (id: string) => dispatch(startNextRun(id)),
    clearRunData: (ovenId: string, runId: string) => {
        /* Clear unlabelled data and finished run data */
        dispatch(clearHeaterData(ovenId, ''));
        dispatch(clearHeaterData(ovenId, runId));
    }
});

const mapState = (state: RootState) => ({
    heaters: state.heaters,
    isCollectingData: state.dataCollection.isCollectingData
});

const styles = {
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        height: '100%',
        minHeight: '100vh'
    }
};

export default connect(
    mapState,
    mapDispatch
)(withStyles(styles)(withRouter(Root)));
