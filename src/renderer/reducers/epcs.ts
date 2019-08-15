import { Reducer } from 'redux';
import EpcController from 'node-ti/build/ti-components/epc-controller';
import { EpcsAction } from '../actions/epcs';

const defaultState: EpcController[] = [];

export const epcs: Reducer<EpcController[], EpcsAction> = (
    state = defaultState,
    action: EpcsAction
) => {
    switch (action.type) {
        case 'SET_EPCS':
            return { ...action.epcs };
        default:
            return state;
    }
};
