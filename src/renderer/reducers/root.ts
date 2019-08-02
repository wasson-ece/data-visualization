import { combineReducers } from 'redux';

import { DataCollectionState } from './dataCollection';
import { DataCollectionAction } from '../actions/dataCollection';
import { dataCollection } from '../reducers/dataCollection';
import HeaterState from '../../interfaces/HeaterState';
import { heaters } from './heaters';
import { HeatersAction } from '../actions/heaters';
import { HeaterAction } from '../actions/heater';

export interface RootState {
    heaters: HeaterState[];
    dataCollection: DataCollectionState;
}

export const rootReducer = combineReducers<RootState | undefined>({
    heaters,
    dataCollection
});

export type RootAction = HeatersAction | DataCollectionAction | HeaterAction;
