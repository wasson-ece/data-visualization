import Heater from '../../interfaces/Heater';
import { Action, ActionCreator } from 'redux';
import { Point } from 'electron';

export type HeaterAttribute = keyof Heater;

export interface UpdateHeaterAttributes extends Action {
    type: 'UPDATE_HEATER_ATTRIBUTES';
    id: string;
    values: {
        [key in HeaterAttribute]: any;
    };
}

export interface AddHeaterDatum extends Action {
    type: 'ADD_HEATER_DATUM';
    id: string;
    datum: Point;
}

export interface ClearHeaterData extends Action {
    type: 'CLEAR_HEATER_DATA';
    id: string;
}

export type HeaterAction = UpdateHeaterAttributes | AddHeaterDatum | ClearHeaterData;

export const addHeaterDatum: ActionCreator<AddHeaterDatum> = (id: string, datum: Point) => ({
    type: 'ADD_HEATER_DATUM',
    id,
    datum
});

export const clearHeaterData: ActionCreator<ClearHeaterData> = (ovenId: string) => ({
    type: 'CLEAR_HEATER_DATA',
    id: ovenId
});

export const updateHeaterAttributes: ActionCreator<UpdateHeaterAttributes> = (
    id: string,
    values: {
        [key in HeaterAttribute]: any;
    }
) => ({
    type: 'UPDATE_HEATER_ATTRIBUTES',
    id,
    values
});
