import { Reducer } from 'redux';
import MfcController from 'node-ti/build/ti-components/mfc-controller';
import { MfcsAction } from '../actions/mfcs';

const defaultState: MfcController[] = [];

export const mfcs: Reducer<MfcController[], MfcsAction> = (
    state = defaultState,
    action: MfcsAction
) => {
    switch (action.type) {
        case 'SET_MFCS':
            return [...action.mfcs];
        default:
            return state;
    }
};
