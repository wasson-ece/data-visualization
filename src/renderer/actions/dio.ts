import { Action, ActionCreator } from 'redux';
import DioController from 'node-ti/build/ti-components/dio-controler';

export interface SetDioReadings extends Action {
    type: 'SET_DIO_READINGS';
    readings: boolean[];
}

export const setDioReadings: ActionCreator<SetDioReadings> = (readings: boolean[]) => ({
    type: 'SET_DIO_READINGS',
    readings
});

export type DioAction = SetDioReadings;
