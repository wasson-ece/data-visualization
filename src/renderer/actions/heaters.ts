import { Action } from 'redux';
import Heater from '../../interfaces/Heater';

export interface SetHeaters extends Action {
    type: 'SET_HEATERS';
    heaters: Heater[];
}

export type HeatersAction = SetHeaters;
