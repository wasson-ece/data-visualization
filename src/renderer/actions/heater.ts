import { Action, ActionCreator } from 'redux';
import HeaterDatum from '../../interfaces/HeaterDatum';
import HeaterState from '../../interfaces/HeaterState';
import { RunAction } from './run';

export type HeaterStateAttribute = keyof HeaterState;

export interface UpdateHeaterAttributes extends Action {
    type: 'UPDATE_HEATER_ATTRIBUTES';
    id: string;
    values: {
        [key in HeaterStateAttribute]: any;
    };
}

export interface AddHeaterDatum extends Action {
    type: 'ADD_HEATER_DATUM';
    id: string;
    datum: HeaterDatum;
}

export interface ClearHeaterData extends Action {
    type: 'CLEAR_HEATER_DATA';
    id: string;
    runId: string;
}

export type HeaterAction = UpdateHeaterAttributes | AddHeaterDatum | ClearHeaterData | RunAction;

export const addHeaterDatum: ActionCreator<AddHeaterDatum> = (id: string, datum: HeaterDatum) => ({
    type: 'ADD_HEATER_DATUM',
    id,
    datum
});

export const clearHeaterData: ActionCreator<ClearHeaterData> = (ovenId: string, runId = '') => ({
    type: 'CLEAR_HEATER_DATA',
    id: ovenId,
    runId
});

export const updateHeaterAttributes: ActionCreator<UpdateHeaterAttributes> = (
    id: string,
    values: {
        [key in HeaterStateAttribute]: any;
    }
) => ({
    type: 'UPDATE_HEATER_ATTRIBUTES',
    id,
    values
});
