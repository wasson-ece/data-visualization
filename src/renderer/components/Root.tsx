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
import { Point } from 'electron';
import { toggleDataCollection, DataCollectionAction } from '../actions/dataCollection';
import Heater from '../../interfaces/Heater';
import { addHeaterDatum, updateHeaterAttributes, HeaterStateAttribute } from '../actions/heater';

interface RootProps extends RouteComponentProps {
    classes: any;
    setHeaterBoards: (detectors: Heater[]) => void;
    updateHeaterBoards: (detectors: Heater[]) => void;
    addHeaterDatum: (id: string, datum: Point) => void;
    updateHeaterAttributes: (
        id: string,
        values: {
            [key in HeaterStateAttribute]?: any;
        }
    ) => void;
    toggleDataCollection: () => void;
    heaters: Heater[];
    isCollectingData: boolean;
}

class Root extends React.Component<RootProps> {
    readData?: NodeJS.Timeout;

    constructor(props: RootProps) {
        super(props);
        this.fetchComponents();
    }

    componentWillReceiveProps = (nextProps: RootProps) => {
        /* Turn on/off data collection based on store state */
        if (nextProps.isCollectingData && !this.readData)
            this.readData = setInterval(this.refreshData, 200);
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
        heaters.forEach(h =>
            this.props.updateHeaterAttributes(h.id, {
                kp: h.kp,
                ki: h.ki,
                kd: h.kd,
                setpoint: h.setpoint,
                actual: h.actual
            })
        );
        heaters.forEach(heater =>
            this.props.addHeaterDatum(heater.id, { x: Date.now(), y: heater.actual })
        );
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
    updateHeaterAttributes: (
        id: string,
        values: {
            [key in HeaterStateAttribute]: any;
        }
    ) => dispatch(updateHeaterAttributes(id, values)),
    addHeaterDatum: (id: string, point: Point) => dispatch(addHeaterDatum(id, point)),
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
