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
import { addHeaterDatum, updateHeaterAttributes, HeaterStateAttribute } from '../actions/heater';
import HeaterState from '../../interfaces/HeaterState';
import Run from '../../interfaces/Run';
import HeaterDatum from '../../interfaces/HeaterDatum';
import {
    findActiveRun,
    areHeaterParamsWithinTolerance,
    reconcileHeaterRunParams
} from '../../util/heater-run';
import influxDataPersistence from '../../db/influx-data-persistence';

interface RootProps extends RouteComponentProps {
    classes: any;
    setHeaterBoards: (detectors: Heater[]) => void;
    updateHeater: (
        id: string,
        kp: number,
        ki: number,
        kd: number,
        setpoint: number,
        actual: number,
        datum: HeaterDatum
    ) => void;
    toggleDataCollection: () => void;
    heaters: HeaterState[];
    isCollectingData: boolean;
}

class Root extends React.Component<RootProps> {
    readData?: NodeJS.Timeout;
    reconcileHeaterParameters?: NodeJS.Timeout;
    RECONCILIATION_CHECK_TIMEOUT = 2000;

    constructor(props: RootProps) {
        super(props);
        this.fetchComponents();
        this.reconcileHeaterParameters = setInterval(
            this.reconciliationLoop,
            this.RECONCILIATION_CHECK_TIMEOUT
        );

        influxDataPersistence(
            'foo_heater',
            {
                uuid: 'TEST',
                startTime: Date.now(),
                isFinished: true,
                isEquilibrating: false,
                isHoldingSetpoint: false,
                isRunning: false,
                ki: '10',
                kp: '10',
                kd: '10'
            },
            [{ x: Date.now(), y: 50.2, runId: 'TEST' }]
        );
    }

    reconciliationLoop = () => {
        console.log('in reconciliation loop');
        let heaters = this.props.heaters;
        heaters.forEach(heater => {
            let activeRun: Run | undefined = findActiveRun(heater);
            if (!activeRun) return;
            console.log(activeRun);
            if (!areHeaterParamsWithinTolerance(heater, activeRun))
                reconcileHeaterRunParams(heater, activeRun);
            else if (heater.currentRun !== activeRun.uuid)
                updateHeaterAttributes(heater.id, { currentRun: activeRun.uuid });
        });
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
    };

    refreshData = async () => {
        let heaters = await this.getData();
        heaters.forEach(h => {
            let heater = this.props.heaters.find(cur => cur.id === h.id);
            let datum: HeaterDatum = {
                x: Date.now(),
                y: h.actual,
                runId: (heater && heater.currentRun) || ''
            };
            this.props.updateHeater(h.id, h.kp, h.ki, h.kd, h.setpoint, h.actual, datum);
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
                output: 0,
                data: []
            });
        });

        return heaters;
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
    updateHeater: (
        id: string,
        kp: number,
        ki: number,
        kd: number,
        setpoint: number,
        actual: number,
        datum: HeaterDatum
    ) => {
        dispatch(updateHeaterAttributes(id, { kp, ki, kd, setpoint, actual }));
        dispatch(addHeaterDatum(id, datum));
    },
    toggleDataCollection: () => dispatch(toggleDataCollection())
});

const mapState = (state: RootState) => ({
    heaters: state.heaters,
    isCollectingData: state.dataCollection.isCollectingData
});

const styles = {
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        minHeight: '100%',
        height: '100%'
    }
};

export default connect(
    mapState,
    mapDispatch
)(withStyles(styles)(withRouter(Root)));
