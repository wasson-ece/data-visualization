import { Action, ActionCreator } from 'redux';
import Run from '../../interfaces/Run';

export type RunAttribute = keyof Run;

export interface EditHeaterRun extends Action {
    type: 'EDIT_HEATER_RUN';
    id: string;
    index: number;
    values: { [key in RunAttribute]?: any };
}

export interface DeleteRun extends Action {
    type: 'DELETE_RUN';
    id: string;
    index: number;
}

export interface StartNextRun extends Action {
    type: 'START_NEXT_RUN';
    id: string;
}

export interface StartEquilibration extends Action {
    type: 'START_EQUILIBRATION';
    id: string;
}

export interface StartSetpointHold extends Action {
    type: 'START_SETPOINT_HOLD';
    id: string;
}

export interface FinishCurrentRun extends Action {
    type: 'FINISH_CURRENT_RUN';
    id: string;
}

export interface AbortRun extends Action {
    type: 'ABORT_CURRENT_RUN';
    id: string;
}

export interface ClearFinishedRuns extends Action {
    type: 'CLEAR_FINISHED_RUNS';
    id: string;
}

export type RunAction =
    | EditHeaterRun
    | DeleteRun
    | StartNextRun
    | StartEquilibration
    | StartSetpointHold
    | FinishCurrentRun
    | AbortRun;

export const editRunAttributes: ActionCreator<EditHeaterRun> = (
    id: string,
    index: number,
    values: { [key in RunAttribute]: any }
) => ({
    type: 'EDIT_HEATER_RUN',
    id,
    index,
    values
});

export const deleteRun: ActionCreator<DeleteRun> = (id: string, index: number) => ({
    type: 'DELETE_RUN',
    id,
    index
});

export const startNextRun: ActionCreator<StartNextRun> = (id: string) => ({
    type: 'START_NEXT_RUN',
    id
});

export const startEquilibration: ActionCreator<StartEquilibration> = (id: string) => ({
    type: 'START_EQUILIBRATION',
    id
});

export const startSetpointHold: ActionCreator<StartSetpointHold> = (id: string) => ({
    type: 'START_SETPOINT_HOLD',
    id
});

export const finishCurrentRun: ActionCreator<FinishCurrentRun> = (id: string) => ({
    type: 'FINISH_CURRENT_RUN',
    id
});

export const abourtRun: ActionCreator<AbortRun> = (id: string) => ({
    type: 'ABORT_CURRENT_RUN',
    id
});
