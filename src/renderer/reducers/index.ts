import { combineReducers } from 'redux';

import { ControllersState, controllersReducer } from './controllersReducer';
import { ControllerDataState, controllerDataReducer } from './controllerDataReducer';
import Run from '../../interfaces/Run';
import { runsReducer } from './runsReducer';
import { DataCollectionState, dataCollectionReducer } from './dataCollectionReducer';
import { ControllersAction } from '../actions/controllersActions';
import { DataCollectionAction } from '../actions/dataCollectionActions';
import { RunsAction } from '../actions/runsActions';

export interface RootState {
    controllers: ControllersState;
    // controllers: {
    //     fids: FID[];
    //     msds: MSD[];
    //     tcds: TCD[];
    // };
    // detectorData: {
    //     fids: {
    //         [id: string]: TimeSeriesDatum[];
    //     };
    //     msds: {
    //         [id: string]: TimeSeriesDatum[];
    //     };
    //     tcds: {
    //         [id: string]: TimeSeriesDatum[];
    //     };
    // };
    controllerData: ControllerDataState;
    heaterRuns: {
        [heaterId: string]: Run[];
    };
    dataCollection: DataCollectionState;
}

export const rootReducer = combineReducers<RootState | undefined>({
    controllers: controllersReducer,
    controllerData: controllerDataReducer,
    heaterRuns: runsReducer,
    dataCollection: dataCollectionReducer
});

export type RootAction = ControllersAction | DataCollectionAction | RunsAction;
