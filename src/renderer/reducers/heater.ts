import { Reducer } from 'redux';

import HeaterState from '../../interfaces/HeaterState';
import { HeaterAction } from '../actions/heater';
import { run, defaultRunState } from './run';
import { isRunValid } from './run';
import deepCopy from '../../util/deep-copy';
import Run from '../../interfaces/Run';

const defaultHeaterState: HeaterState = {
    runs: [deepCopy(defaultRunState)],
    kp: NaN,
    ki: NaN,
    kd: NaN,
    output: NaN,
    data: [],
    id: '',
    actual: NaN,
    setpoint: NaN
};

export const heater: Reducer<HeaterState, HeaterAction> = (
    state = defaultHeaterState,
    action: HeaterAction
) => {
    switch (action.type) {
        case 'ADD_HEATER_DATUM':
            if (action.id != state.id) return state;
            return { ...state, data: [...state.data, action.datum] };
        case 'CLEAR_HEATER_DATA':
            if (action.id != state.id) return state;
            return { ...state, data: [] };
        case 'EDIT_HEATER_RUN': {
            if (action.id !== state.id) return state;
            let runs = [
                ...state.runs.slice(0, action.index),
                run(state.runs[action.index], action),
                ...state.runs.slice(action.index + 1)
            ];
            if (state.runs.length && isRunValid(runs[state.runs.length - 1]))
                runs.push(deepCopy(defaultRunState));
            return {
                ...state,
                runs
            };
        }
        case 'DELETE_RUN': {
            if (action.id !== state.id) return state;
            let runs = state.runs.filter((run, index) => index !== action.index);
            let appendedRows = !runs.length ? [deepCopy(defaultRunState)] : [];
            return {
                ...state,
                runs: [...runs, ...appendedRows]
            };
        }
        case 'UPDATE_HEATER_ATTRIBUTES':
            if (action.id != state.id) return state;
            return { ...state, ...action.values };
        default:
            return state;
    }
};
