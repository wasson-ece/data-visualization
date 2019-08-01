import { Reducer } from 'redux';

import { ControllersAction } from '../actions/heaters';
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
        case 'CLEAR_HEATER_DATA':
            return {
                ...state,
                heater: {
                    ...state.heaters,
                    [action.id]: []
                }
            };
        default:
            return state;
    }
};
