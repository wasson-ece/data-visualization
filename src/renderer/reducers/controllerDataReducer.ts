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
import { Point } from 'electron';

export interface ControllerDataState {
    epcs: {
        [id: string]: Point[];
    };
    dios: {
        [id: string]: Point[];
    };
    heaters: {
        [id: string]: Point[];
    };
    mfcs: {
        [id: string]: Point[];
    };
}

const defaultState: ControllerDataState = {
    epcs: {},
    dios: {},
    heaters: {},
    mfcs: {}
};

export const controllerDataReducer: Reducer<ControllerDataState, ControllersAction> = (
    state = defaultState,
    action: ControllersAction
) => {
    switch (action.type) {
        case 'ADD_HEATER_DATUM':
            if (!state.heaters[action.id])
                return { ...state, heaters: { ...state.heaters, [action.id]: [action.datum] } };
            else
                return {
                    ...state,
                    heaters: {
                        ...state.heaters,
                        [action.id]: [...state.heaters[action.id], action.datum]
                    }
                };
        default:
            return state;
    }
};
