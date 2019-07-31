import { Action, ActionCreator } from 'redux';

export interface EditRun extends Action {
    type: 'EDIT_RUN';
    heaterId: string;
    runIndex: number;
    attribute: string;
    value: string | number;
}

export interface DeleteRun extends Action {
    type: 'DELETE_RUN';
    heaterId: string;
    runIndex: number;
}

export const editRun: ActionCreator<EditRun> = (
    heaterId: string,
    runIndex: number,
    attribute: string,
    value: string | number
) => ({
    type: 'EDIT_RUN',
    heaterId,
    runIndex,
    attribute,
    value
});

export const deleteRun: ActionCreator<DeleteRun> = (heaterId: string, runIndex: number) => ({
    heaterId,
    type: 'DELETE_RUN',
    runIndex
});

export type RunsAction = EditRun | DeleteRun;
