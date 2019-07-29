import * as React from 'react';
import SidebarMenu from './SidebarMenu';
import { decodeGCStatus } from 'node-ti/build/lib/parse/parse-ti-response';
import HeaterComponent from 'node-ti/build/ti-components/heater-component';
import { withStyles } from '@material-ui/core';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
    ControllersAction,
    updateControllers,
    addHeaterDatum
} from '../actions/controllersActions';
import ControllerType from '../../enums/ControllerType';
import Heater from '../../ti-components/controllers/Heater';
import { RootState } from '../reducers';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import HeaterView from './HeaterView';
import { ControllerSidebarItem } from '../../enums/SidebarItems';
import DioView from './DioView';
import EpcView from './EpcView';
import MfcView from './MfcView';
import { tiClient } from '../../ti-communication/ti';
import { Point } from 'electron';

interface RootProps extends RouteComponentProps {
    classes: any;
    setHeaterBoards: (detectors: Heater[]) => void;
    updateHeaterBoards: (detectors: Heater[]) => void;
    addHeaterDatum: (id: string, datum: Point) => void;
    heaters: Heater[];
}

class Root extends React.Component<RootProps> {
    readData?: NodeJS.Timeout;

    constructor(props: RootProps) {
        super(props);
        this.fetchComponents();
    }

    fetchComponents = async () => {
        await tiClient.connect();
        this.readData = setInterval(this.refreshData, 200);
        let heaters = await this.getData();

        this.props.setHeaterBoards(heaters);
    };

    refreshData = async () => {
        let heaters = await this.getData();
        this.props.setHeaterBoards(heaters);
        heaters.forEach(heater =>
            this.props.addHeaterDatum(heater.id, { x: Date.now(), y: heater.actual })
        );
    };

    getData = async (): Promise<Heater[]> => {
        let res = await tiClient.getGCStatus();
        const [tiComponents, methodStatus] = decodeGCStatus(res);
        let heaters: Heater[] = [];
        (tiComponents as HeaterComponent[]).forEach((component: HeaterComponent) => {
            heaters.push(
                new Heater(
                    String(component.id),
                    Number(component.setpoint.toFixed(2)),
                    component.temperature,
                    Number(component.pidTune.kp.toFixed(0)),
                    Number(component.pidTune.ki.toFixed(0)),
                    Number(component.pidTune.kd.toFixed(0))
                )
            );
        });

        return heaters;
    };

    render = () => {
        return (
            <div className={this.props.classes.root}>
                <SidebarMenu />
                <main>
                    <Route
                        path={`/controllers/${ControllerSidebarItem.Oven}`}
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
                    {/* <TabMenu
                        options={heaters.map(heater => ({
                            id: heater.id,
                            label: `Heater ${heater.id}`
                        }))}
                    /> */}
                    {/* <DataVisualizationContainer /> */}
                </main>
            </div>
        );
    };
}

const mapDispatch = (dispatch: Dispatch<ControllersAction>) => ({
    setHeaterBoards: (controllers: Heater[]) =>
        dispatch({ type: 'SET_CONTROLLERS', controllerType: ControllerType.Heater, controllers }),
    updateHeaterBoards: (controllers: Heater[]) =>
        dispatch(updateControllers(ControllerType.Heater, controllers)),
    addHeaterDatum: (id: string, point: Point) => dispatch(addHeaterDatum(id, point))
});

const mapState = (state: RootState) => ({
    heaters: state.controllers.heaters
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
    //@ts-ignore
)(withStyles(styles)(withRouter(Root)));
