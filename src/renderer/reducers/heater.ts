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
    setpoint: NaN,
    label: ''
};

export const heater: Reducer<HeaterState, HeaterAction> = (
    state = defaultHeaterState,
    action: HeaterAction
) => {
    if (action.id !== state.id) return state;
    switch (action.type) {
        case 'ADD_HEATER_DATUM':
            return { ...state, data: [...state.data, action.datum] };
        case 'CLEAR_HEATER_DATA':
            return { ...state, data: state.data.filter(datum => datum.runId !== action.runId) };
        case 'EDIT_HEATER_RUN': {
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
            let runs = state.runs.filter((run, index) => index !== action.index);
            let appendedRows =
                !runs.length || isRunValid(runs[runs.length - 1])
                    ? [deepCopy(defaultRunState)]
                    : [];
            return {
                ...state,
                runs: [...runs, ...appendedRows]
            };
        }
        case 'UPDATE_HEATER_ATTRIBUTES':
            return { ...state, ...action.values };
        case 'ABORT_CURRENT_RUN':
            return {
                ...state,
                currentRun: undefined,
                runs: state.runs.map(r => (r.isRunning ? run(r, action) : r))
            };
        case 'FINISH_CURRENT_RUN':
            return {
                ...state,
                currentRun: undefined,
                runs: state.runs.map(r => (r.isRunning ? run(r, action) : r))
            };
        case 'START_NEXT_RUN':
            return {
                ...state,
                runs: state.runs.map((r, index) =>
                    isRunValid(r) && !r.isFinished && !r.isRunning ? run(r, action) : r
                )
            };
        case 'ABORT_CURRENT_RUN':
            return {
                ...state,
                currentRun: undefined,
                runs: state.runs.map((r: Run, index) => (r.isRunning ? run(r, action) : r))
            };
        case 'START_SETPOINT_HOLD':
            let activeRun = state.runs.find(r => r.isRunning);
            return {
                ...state,
                runs: state.runs.map((r: Run, index) => (r.isRunning ? run(r, action) : r)),
                currentRun: (activeRun && activeRun.uuid) || ''
            };
        case 'START_EQUILIBRATION':
            return {
                ...state,
                runs: state.runs.map((r: Run, index) => (r.isRunning ? run(r, action) : r))
            };
        default:
            return state;
    }
};
