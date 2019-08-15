import { Reducer } from 'redux';
import DioController from 'node-ti/build/ti-components/dio-controler';
import { DioAction } from '../actions/dio';

const defaultState: DioController = {
    type: 'dio',
    readings: []
};

export const dio: Reducer<DioController, DioAction> = (state = defaultState, action: DioAction) => {
    switch (action.type) {
        case 'SET_DIO_READINGS':
            return { ...state, readings: action.readings };
        default:
            return state;
    }
};
