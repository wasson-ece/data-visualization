import { Reducer } from 'redux';
const uuidv1 = require('uuid/v1');
import Run from '../../interfaces/Run';
import { RunAction } from '../actions/run';

const ABSOLUTE_ZERO = -273.15;
export const isRunValid = (run: Run): boolean =>
    Boolean(
        run.kp !== undefined &&
            Number(run.kp) >= 0 &&
            run.ki !== undefined &&
            Number(run.ki) >= 0 &&
            run.kd !== undefined &&
            Number(run.kd) >= 0 &&
            run.baseline !== undefined &&
            Number(run.baseline) > ABSOLUTE_ZERO &&
            run.setpoint !== undefined &&
            Number(run.setpoint) > ABSOLUTE_ZERO &&
            run.equilibrationTime !== undefined &&
            Number(run.equilibrationTime) > 0 &&
            run.setpointHoldTime !== undefined &&
            Number(run.setpointHoldTime) > 0
    );

export const defaultRunState = (): Run => ({
    uuid: uuidv1(),
    isFinished: false,
    isRunning: false,
    isEquilibrating: false,
    isHoldingSetpoint: false,
    startTime: NaN,
    isDirty: false
});

export const run: Reducer<Run, RunAction> = (state = defaultRunState(), action: RunAction) => {
    switch (action.type) {
        case 'EDIT_HEATER_RUN':
            return { ...state, ...action.values, isDirty: true };
        case 'ABORT_CURRENT_RUN':
            return { ...state, isRunning: false, isEquilibrating: false, isHoldingSetpoint: false };
        case 'FINISH_CURRENT_RUN':
            return {
                ...state,
                isRunning: false,
                isFinished: true,
                isEquilibrating: false,
                isHoldingSetpoint: false
            };
        case 'START_NEXT_RUN':
            return { ...state, isRunning: true, startTime: Date.now() };
        case 'START_SETPOINT_HOLD':
            return { ...state, isHoldingSetpoint: true, isEquilibrating: false };
        case 'START_EQUILIBRATION':
            return { ...state, isEquilibrating: true, isHoldingSetpoint: false };
        default:
            return state;
    }
};
