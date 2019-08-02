import { Reducer, bindActionCreators } from 'redux';

import { HeatersAction } from '../actions/heaters';
import HeaterState from '../../interfaces/HeaterState';
import { heater } from './heater';

const defaultState: HeaterState[] = [];

export const heaters: Reducer<HeaterState[], HeatersAction> = (
    state = defaultState,
    action: HeatersAction
) => {
    switch (action.type) {
        case 'ADD_HEATER_DATUM':
        case 'CLEAR_HEATER_DATA':
        case 'UPDATE_HEATER_ATTRIBUTES':
            return state.map(h => heater(h, action));
        case 'SET_HEATERS':
            return action.heaters.map(h => ({ ...h, runs: [] }));
        default:
            return state;
    }
};
