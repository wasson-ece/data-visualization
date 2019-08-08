import { Reducer } from 'redux';

import { HeatersAction } from '../actions/heaters';
import HeaterState from '../../interfaces/HeaterState';
import { heater } from './heater';
import { defaultRunState } from './run';

const defaultState: HeaterState[] = [];

export const heaters: Reducer<HeaterState[], HeatersAction> = (
    state = defaultState,
    action: HeatersAction
) => {
    switch (action.type) {
        case 'ADD_HEATER_DATUM':
        case 'CLEAR_HEATER_DATA':
            if (action.type === 'CLEAR_HEATER_DATA') console.log('clear heaterS');
        case 'SET_HEATER_RUNS':
        case 'UPDATE_HEATER_ATTRIBUTES':
            return state.map(h => heater(h, action));
        case 'SET_HEATERS':
            return action.heaters.map(h => ({ ...h, runs: [defaultRunState()], label: '' }));
        case 'ABORT_CURRENT_RUN':
        case 'FINISH_CURRENT_RUN':
        case 'START_NEXT_RUN':
        case 'START_EQUILIBRATION':
        case 'ABORT_CURRENT_RUN':
        case 'START_SETPOINT_HOLD':
        case 'EDIT_HEATER_RUN':
        case 'DELETE_RUN':
            return state.map(h => (h.id !== action.id ? h : heater(h, action)));
        default:
            return state;
    }
};
