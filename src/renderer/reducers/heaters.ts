import { Reducer } from 'redux';

import { HeatersAction } from '../actions/heaters';
import HeaterState from '../../interfaces/HeaterState';

export interface HeatersState {
    heaters: HeaterState[];
}

const defaultState: HeatersState = {
    heaters: [] as HeaterState[]
};

export const heaters: Reducer<HeatersState, HeatersAction> = (
    state = defaultState,
    action: HeatersAction
) => {
    switch (action.type) {
        case 'SET_HEATERS':
            return state;
        case 'UPDATE_HEATER':
        default:
            return state;
    }
};
