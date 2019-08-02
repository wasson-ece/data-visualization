import { Action } from 'redux';
import Heater from '../../interfaces/Heater';
import { HeaterAction } from './heater';

export interface SetHeaters extends Action {
    type: 'SET_HEATERS';
    heaters: Heater[];
}

export type HeatersAction = SetHeaters | HeaterAction;
