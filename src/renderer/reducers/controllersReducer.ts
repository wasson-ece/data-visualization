import { Reducer } from 'redux';

import {
    addController,
    removeController,
    setControllerAttribute,
    ControllersAction
} from '../actions/controllersActions';
import EPC from '../../ti-components/controllers/EPC';
import DIO from '../../ti-components/controllers/DIO';
import MCO from '../../ti-components/controllers/MCO';
import MFC from '../../ti-components/controllers/MFC';

export interface ControllersState {
    epcs: EPC[];
    dios: DIO[];
    mcos: MCO[];
    mfcs: MFC[];
}

const defaultState: ControllersState = {
    epcs: [],
    dios: [],
    mcos: [],
    mfcs: []
};

export const controllersReducer: Reducer<ControllersState, ControllersAction> = (
    state = defaultState,
    action: ControllersAction
) => {
    switch (action.type) {
        case 'ADD_CONTROLLER':
            return state;
        case 'REMOVE_CONTROLLER':
            return state;
        case 'SET_CONTROLLER_ATTRIBUTE':
            return state;
        default:
            return state;
    }
};
