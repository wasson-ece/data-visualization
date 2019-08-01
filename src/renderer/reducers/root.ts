import { combineReducers } from 'redux';

import { DataCollectionState } from './dataCollectionReducer';
import { DataCollectionAction } from '../actions/dataCollectionActions';
import HeaterState from '../../interfaces/HeaterState';
import { heaters } from './heaters';

export interface RootState {
    heaters: HeaterState[];
    dataCollection: DataCollectionState;
}

export const rootReducer = combineReducers<RootState | undefined>({
    heaters,
    dataCollection
});

export type RootAction = ControllersAction | DataCollectionAction;
