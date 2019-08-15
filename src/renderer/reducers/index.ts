import { combineReducers } from 'redux';

import { DataCollectionState } from './dataCollection';
import { DataCollectionAction } from '../actions/dataCollection';
import { dataCollection } from './dataCollection';
import HeaterState from '../../interfaces/HeaterState';
import { heaters } from './heaters';
import { epcs } from './epcs';
import { dio } from './dio';
import { mfcs } from './mfcs';
import { analog } from './analog';
import { HeatersAction } from '../actions/heaters';
import { HeaterAction } from '../actions/heater';
import EpcController from 'node-ti/build/ti-components/epc-controller';
import MfcController from 'node-ti/build/ti-components/mfc-controller';
import AnalogComponent from 'node-ti/build/ti-components/analog-component';
import DioController from 'node-ti/build/ti-components/dio-controler';
import { AnalogAction } from '../actions/analog';
import { DioAction } from '../actions/dio';
import { MfcsAction } from '../actions/mfcs';
import { EpcsAction } from '../actions/epcs';

export interface RootState {
    heaters: HeaterState[];
    epcs: EpcController[];
    mfcs: MfcController[];
    analog: AnalogComponent;
    dio: DioController;
    dataCollection: DataCollectionState;
}

export const rootReducer = combineReducers<RootState | undefined>({
    heaters,
    epcs,
    mfcs,
    analog,
    dio,
    dataCollection
});

export type RootAction =
    | HeatersAction
    | DataCollectionAction
    | HeaterAction
    | DioAction
    | EpcsAction
    | MfcsAction
    | AnalogAction;
