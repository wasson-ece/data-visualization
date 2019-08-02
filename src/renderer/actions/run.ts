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

export type RunAction = EditHeaterRun | DeleteRun;

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
