import { Action, ActionCreator } from 'redux';
import Heater from '../../interfaces/Heater';
import { HeaterAction } from './heater';

export interface SetHeaters extends Action {
    type: 'SET_HEATERS';
    heaters: Heater[];
}

export const setHeaters: ActionCreator<SetHeaters> = (heaters: Heater[]) => ({
    type: 'SET_HEATERS',
    heaters
});

export type HeatersAction = SetHeaters | HeaterAction;
