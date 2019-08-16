import * as React from 'react';
import SidebarMenu from './SidebarMenu';
import { decodeGCStatus } from 'node-ti/build/lib/parse/parse-ti-response';
import { withStyles } from '@material-ui/core';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { setHeaters } from '../actions/heaters';
import { RootState, RootAction } from '../reducers';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import HeaterView from './HeaterView';
import { ControllerSidebarItem } from '../../enums/SidebarItems';
import DioView from './DioView';
import EpcView from './EpcView';
import MfcView from './MfcView';
import { tiClient } from '../../ti-communication/ti';
import { toggleDataCollection, DataCollectionAction } from '../actions/dataCollection';
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
import HeaterController from 'node-ti/build/ti-components/heater-controller';
import TIComponent from 'node-ti/build/ti-components/ti-component';
import { setMfcs } from '../actions/mfcs';
import MfcController from 'node-ti/build/ti-components/mfc-controller';
import EpcController from 'node-ti/build/ti-components/epc-controller';
import { setEpcs } from '../actions/epcs';
import { setDioReadings } from '../actions/dio';
import { setAnalogReadings } from '../actions/analog';
import { separateTiComponents } from '../../util/ti';
import mockData from '../../../mocks/ti-response';
import AnalogView from './AnalogView';

interface RootProps extends RouteComponentProps {
    classes: any;
    setHeaterBoards: (detectors: HeaterController[]) => void;
    setMfcs: (mfcs: MfcController[]) => void;
    setEpcs: (epcs: EpcController[]) => void;
    setDioReadings: (readings: boolean[]) => void;
    setAnalogReadings: (readings: number[]) => void;
    addDatum: (id: number, datum: HeaterDatum) => void;
    updateHeater: (
        id: number,
        kp: number,
        ki: number,
        kd: number,
        setpoint: number,
        actual: number,
        powerOutputPercent: number
    ) => void;
    toggleDataCollection: () => void;
    startOvenEquilibration: (ovenId: number) => void;
    startOvenSetpointHold: (ovenId: number) => void;
    finishOvenRun: (ovenId: number) => void;
    startNextOvenRun: (id: number) => void;
    clearRunData: (heaterId: number, runId: string) => void;
    setHeaterBoardRuns: (id: number, runs: Run[]) => void;
    updateHeaterLabel: (id: number, label: string) => void;
    heaters: HeaterState[];
    epcs: EpcController[];
    mfcs: MfcController[];
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
                    startOvenEquilibration(Number(heater.id));
                } else if (isDoneEquilibrating(activeRun)) {
                    startOvenSetpointHold(Number(heater.id));
                } else if (isDoneHoldingSetpoint(activeRun)) {
                    finishOvenRun(Number(heater.id));
                    startNextOvenRun(Number(heater.id));
                    // Wait before clearing out previous run's data
                    setTimeout(() => clearRunData(Number(heater.id), activeRun!.uuid), 5000);
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
        /* Fetch data */
        // await tiClient.connect();
        // let components = await this.getData();
        let [components, gcStatus] = decodeGCStatus(mockData);

        /* Parse result into the constituent Ti components */
        const { heaters, epcs, mfcs, analog, dio } = separateTiComponents(components);

        /* Update state with this information */
        this.props.setHeaterBoards(heaters);
        this.props.setEpcs(epcs);
        this.props.setMfcs(mfcs);
        analog && this.props.setAnalogReadings(analog.readings);
        dio && this.props.setDioReadings(dio.readings);

        /* If we set heater board meta data, retrieve that from local storage */
        this.hydrateHeaterBoardRuns();
        this.hydrateHeaterLabels();
    };

    refreshData = async () => {
        let components = await this.getData();
        const { heaters, epcs, mfcs, analog, dio } = separateTiComponents(components);
        heaters.forEach(h => {
            let heater = this.props.heaters.find(cur => String(cur.id) === String(h.id));

            if (!heater) return;
            let datum: HeaterDatum = {
                x: Date.now(),
                y: Number(h.actual),
                powerOutputPercent: h.powerOutputPercent,
                runId: (heater && heater.currentRun) || ''
            };
            this.props.updateHeater(
                Number(heater.id),
                Number(h.kp),
                Number(h.ki),
                Number(h.kd),
                Number(h.setpoint),
                Number(h.actual),
                Number(h.powerOutputPercent)
            );
            this.props.addDatum(Number(heater.id), datum);
        });
    };

    getData = async (): Promise<TIComponent[]> => {
        let res = await tiClient.getGCStatus();
        const [tiComponents, methodStatus] = decodeGCStatus(res);
        return tiComponents;
    };

    hydrateHeaterBoardRuns = () => {
        let unfinishedRunsString = localStorage.getItem('unfinishedRuns');
        if (!unfinishedRunsString) return;

        let unfinishedRuns: UnfinishedRuns = JSON.parse(unfinishedRunsString);
        Object.keys(unfinishedRuns).forEach((heaterId: string) => {
            this.props.setHeaterBoardRuns(Number(heaterId), unfinishedRuns[heaterId]);
        });
    };

    hydrateHeaterLabels = () => {
        let ovenLabelsString = localStorage.getItem('ovenLabels');
        if (!ovenLabelsString) return;
        let ovenLabels: OvenLabels = JSON.parse(ovenLabelsString);
        Object.keys(ovenLabels).forEach((heaterId: string) => {
            this.props.updateHeaterLabel(Number(heaterId), ovenLabels[heaterId]);
        });
    };

    render = () => {
        const { toggleDataCollection, heaters, mfcs, epcs } = this.props;
        return (
            <div className={this.props.classes.root}>
                <SidebarMenu
                    isCollectingData={this.props.isCollectingData}
                    onToggleDataCollection={toggleDataCollection}
                    heaters={heaters}
                    mfcs={mfcs}
                    epcs={epcs}
                />
                <main>
                    <Route
                        path={`/controllers/${ControllerSidebarItem.Oven}/:id`}
                        component={HeaterView}
                    />
                    <Route
                        path={`/components/${ControllerSidebarItem.Analog}`}
                        component={AnalogView}
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

const mapDispatch = (dispatch: Dispatch<RootAction | DataCollectionAction>) => ({
    setHeaterBoards: (heaters: HeaterController[]) => dispatch(setHeaters(heaters)),
    setHeaterBoardRuns: (id: number, runs: Run[]) => dispatch(setHeaterRuns(id, runs)),
    setMfcs: (mfcs: MfcController[]) => dispatch(setMfcs(mfcs)),
    setEpcs: (epcs: EpcController[]) => dispatch(setEpcs(epcs)),
    setDioReadings: (readings: boolean[]) => dispatch(setDioReadings(readings)),
    setAnalogReadings: (readings: number[]) => dispatch(setAnalogReadings(readings)),
    addDatum: (id: number, datum: HeaterDatum) => dispatch(addHeaterDatum(id, datum)),
    updateHeater: (
        id: number,
        kp: number,
        ki: number,
        kd: number,
        setpoint: number,
        actual: number,
        powerOutputPercent: number
    ) => dispatch(updateHeaterAttributes(id, { kp, ki, kd, setpoint, actual, powerOutputPercent })),
    updateHeaterLabel: (id: number, label: string) =>
        dispatch(updateHeaterAttributes(id, { label })),
    toggleDataCollection: () => dispatch(toggleDataCollection()),
    startOvenEquilibration: (id: number) => dispatch(startEquilibration(id)),
    startOvenSetpointHold: (id: number) => dispatch(startSetpointHold(id)),
    finishOvenRun: (id: number) => dispatch(finishCurrentRun(id)),
    startNextOvenRun: (id: number) => dispatch(startNextRun(id)),
    clearRunData: (ovenId: number, runId: string) => {
        /* Clear unlabelled data and finished run data */
        dispatch(clearHeaterData(ovenId, ''));
        dispatch(clearHeaterData(ovenId, runId));
    }
});

const mapState = (state: RootState) => ({
    heaters: state.heaters,
    epcs: state.epcs,
    mfcs: state.mfcs,
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
