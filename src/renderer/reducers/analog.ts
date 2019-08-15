import { Reducer } from 'redux';
import AnalogComponent from 'node-ti/build/ti-components/analog-component';
import { AnalogAction } from '../actions/analog';

const defaultState: AnalogComponent = {
    type: 'analog',
    readings: []
};

export const analog: Reducer<AnalogComponent, AnalogAction> = (
    state = defaultState,
    action: AnalogAction
) => {
    switch (action.type) {
        case 'SET_ANALOG_READINGS':
            return { ...state, readings: action.readings };
        default:
            return state;
    }
};
