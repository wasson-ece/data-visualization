export interface UpdateHeaterAttributes extends Action {
    type: 'UPDATE_HEATER_ATTRIBUTES';
    id: string;
    values: {
        [key in HeaterAttributes]: any;
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
