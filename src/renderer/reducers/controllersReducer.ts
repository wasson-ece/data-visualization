import { Reducer } from 'redux';

import {
    addController,
    removeController,
    setControllerAttribute,
    ControllersAction
} from '../actions/controllersActions';
import EPC from '../../ti-components/controllers/EPC';
import DIO from '../../ti-components/controllers/DIO';
import Heater from '../../ti-components/controllers/Heater';
import MFC from '../../ti-components/controllers/MFC';
import ControllerType from '../../enums/ControllerType';

export interface ControllersState {
    epcs: EPC[];
    dios: DIO[];
    heaters: Heater[];
    mfcs: MFC[];
}

const defaultState: ControllersState = {
    epcs: [] as EPC[],
    dios: [] as DIO[],
    heaters: [] as Heater[],
    mfcs: [] as MFC[]
};

//@ts-ignore
export const controllersReducer: Reducer<ControllersState, ControllersAction> = (
    state = defaultState,
    action: ControllersAction
) => {
    switch (action.type) {
        case 'ADD_CONTROLLER':
            return state;
        case 'SET_CONTROLLERS':
            switch (action.controllerType) {
                case ControllerType.Heater:
                    return { ...state, heaters: action.controllers };
                default:
                    return state;
            }
        case 'REMOVE_CONTROLLER':
            return state;
        case 'SET_CONTROLLER_ATTRIBUTE':
            return state;
        default:
            return state;
    }
};
