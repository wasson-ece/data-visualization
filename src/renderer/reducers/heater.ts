import { Reducer } from 'redux';

import { HeatersAction } from '../actions/heaters';
import HeaterState from '../../interfaces/HeaterState';

const defaultHeaterState: HeaterState = {
    runs: [],
    kp: NaN,
    ki: NaN,
    kd: NaN,
    output: NaN,
    data: [],
    id: '',
    actual: NaN,
    setpoint: NaN
};

export const heater: Reducer<HeaterState, HeatersAction> = (
    state = defaultHeaterState,
    action: HeatersAction
) => {
    switch (action.type) {
        case 'ADD_HEATER_DATUM':
            if (action.id != state.id) return state;
            return { ...state, data: [...state.data, action.datum] };
        case 'CLEAR_HEATER_DATA':
            if (action.id != state.id) return state;
            return { ...state, data: [] };
        case 'UPDATE_HEATER_ATTRIBUTES':
            if (action.id != state.id) return state;
            return { ...state, ...action.values };
        default:
            return state;
    }
};
