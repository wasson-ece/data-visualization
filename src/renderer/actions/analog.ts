import { Action, ActionCreator } from 'redux';
import AnalogComponent from 'node-ti/build/ti-components/analog-component';

export interface SetAnalogReadings extends Action {
    type: 'SET_ANALOG_READINGS';
    readings: number[];
}

export const setAnalogReadings: ActionCreator<SetAnalogReadings> = (readings: number[]) => ({
    type: 'SET_ANALOG_READINGS',
    readings
});

export type AnalogAction = SetAnalogReadings;
