import { Reducer } from 'redux';

import { RunsAction } from '../actions/runsActions';
import Run from '../../interfaces/Run';

export interface RunsState {
    [componentId: string]: Run[];
}

const defaultState: RunsState = {};

const ABSOLUTE_ZERO = -273.15;
const isRunValid = (run: Run): boolean =>
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

export const runsReducer: Reducer<RunsState, RunsAction> = (
    state = defaultState,
    action: RunsAction
) => {
    switch (action.type) {
        case 'EDIT_RUN':
            const heaterRuns = state[action.heaterId] || [];
            const editedRun: Run = {
                ...heaterRuns[action.runIndex],
                [action.attribute]: action.value
            };
            let freshLastRows: Run[] = [];
            if (isRunValid(editedRun) && action.runIndex === heaterRuns.length - 1)
                freshLastRows = [{ ...editedRun, kp: undefined, ki: undefined, kd: undefined }];
            return {
                ...heaterRuns,
                [action.heaterId]: [
                    ...heaterRuns.slice(0, action.runIndex),
                    editedRun,
                    ...heaterRuns.slice(action.runIndex + 1),
                    ...freshLastRows
                ]
            };
        case 'DELETE_RUN':
            const filteredRuns = state[action.heaterId].filter(
                (r, index) => index != action.runIndex
            );
            return {
                ...state.heaterRuns,
                [action.heaterId]: (filteredRuns.length && filteredRuns) || [{}]
            };
        default:
            return state;
    }
};
