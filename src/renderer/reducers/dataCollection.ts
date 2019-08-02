import { Reducer } from 'redux';
import { DataCollectionAction } from '../actions/dataCollection';
import { StartNextRun } from '../actions/run';

export interface DataCollectionState {
    isCollectingData: boolean;
}

const defaultState: DataCollectionState = {
    isCollectingData: false
};

export const dataCollection: Reducer<DataCollectionState, DataCollectionAction | StartNextRun> = (
    state = defaultState,
    action: DataCollectionAction | StartNextRun
): DataCollectionState => {
    switch (action.type) {
        case 'TOGGLE_DATA_COLLECTION':
            return { ...state, isCollectingData: !state.isCollectingData };
        case 'START_NEXT_RUN':
            return { ...state, isCollectingData: true };
        default:
            return state;
    }
};
