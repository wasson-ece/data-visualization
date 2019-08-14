import { Action, ActionCreator } from 'redux';
import { HeaterAction } from './heater';
import HeaterController from 'node-ti/build/ti-components/heater-controller';

export interface SetHeaters extends Action {
    type: 'SET_HEATERS';
    heaters: HeaterController[];
}

export const setHeaters: ActionCreator<SetHeaters> = (heaters: HeaterController[]) => ({
    type: 'SET_HEATERS',
    heaters
});

export type HeatersAction = SetHeaters | HeaterAction;
