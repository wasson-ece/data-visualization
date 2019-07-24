import { combineReducers } from 'redux';

import { ControllersState, controllersReducer } from './controllersReducer';

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
    // controllerData: {
    //     epcs: {
    //         [id: string]: ControllerDatum<null>[];
    //     };
    //     dios: {
    //         [id: string]: ControllerDatum<null>[];
    //     };
    //     mcos: {
    //         [id: string]: ControllerDatum<null>[];
    //     };
    //     mfcs: {
    //         [id: string]: ControllerDatum<null>[];
    //     };
    // };
}

export const rootReducer = combineReducers<RootState | undefined>({
    controllers: controllersReducer
});
