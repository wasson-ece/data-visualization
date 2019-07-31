import { combineReducers } from 'redux';

import { ControllersState, controllersReducer } from './controllersReducer';
import { Point } from 'electron';
import { ControllerDataState, controllerDataReducer } from './controllerDataReducer';
import Run from '../../interfaces/Run';
import { runsReducer } from './runsReducer';

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
}

export const rootReducer = combineReducers<RootState | undefined>({
    controllers: controllersReducer,
    controllerData: controllerDataReducer,
    heaterRuns: runsReducer
});
