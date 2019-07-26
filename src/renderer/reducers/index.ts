import { combineReducers } from 'redux';

import { ControllersState, controllersReducer } from './controllersReducer';
import { Point } from 'electron';
import { ControllerDataState, controllerDataReducer } from './controllerDataReducer';

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
    // };
}

export const rootReducer = combineReducers<RootState | undefined>({
    controllers: controllersReducer,
    controllerData: controllerDataReducer
});
