import { Reducer } from 'redux';

import { HeatersAction } from '../actions/heaters';
import HeaterState from '../../interfaces/HeaterState';

const defaultState: HeaterState[] = [];

export const heaters: Reducer<HeaterState[], HeatersAction> = (
    state = defaultState,
    action: HeatersAction
) => {
    switch (action.type) {
        case 'SET_HEATERS':
            return state;
        default:
            return state;
    }
};
