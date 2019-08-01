import { Reducer } from 'redux';
import { DataCollectionAction } from '../actions/dataCollectionActions';

export interface DataCollectionState {
    isCollectingData: boolean;
}

const defaultState: DataCollectionState = {
    isCollectingData: false
};

export const dataCollectionReducer: Reducer<DataCollectionState, DataCollectionAction> = (
    state = defaultState,
    action: DataCollectionAction
): DataCollectionState => {
    switch (action.type) {
        case 'TOGGLE_DATA_COLLECTION':
            return { ...state, isCollectingData: !state.isCollectingData };
        default:
            return state;
    }
};
