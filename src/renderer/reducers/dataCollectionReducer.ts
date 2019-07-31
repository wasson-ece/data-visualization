import { Reducer } from 'redux';
import { DataCollectionAction } from '../actions/dataCollectionActions';
import RunStatus from '../../interfaces/RunStatus';

export interface DataCollectionState {
    isCollectingData: boolean;
    activeRuns: RunStatus[];
    finishedRuns: RunStatus[];
}

const defaultState: DataCollectionState = {
    isCollectingData: false,
    activeRuns: [],
    finishedRuns: []
};

export const dataCollectionReducer: Reducer<DataCollectionState, DataCollectionAction> = (
    state = defaultState,
    action: DataCollectionAction
): DataCollectionState => {
    let runIndex: number;
    switch (action.type) {
        case 'TOGGLE_DATA_COLLECTION':
            return { ...state, isCollectingData: !state.isCollectingData };
        case 'START_RUN':
            return {
                ...state,
                isCollectingData: true,
                activeRuns: [
                    ...state.activeRuns,
                    {
                        runId: action.runId,
                        ovenId: action.ovenId,
                        equilibrationStartTime: null,
                        setpointStartTime: null,
                        finishTime: null
                    }
                ]
            };
        case 'START_EQUILIBRATION':
            runIndex = state.activeRuns.findIndex(r => r.runId === action.runId);
            return {
                ...state,
                isCollectingData: true,
                activeRuns: [
                    ...state.activeRuns.slice(0, runIndex),
                    {
                        ...state.activeRuns[runIndex],
                        equilibrationStartTime: Date.now()
                    },
                    ...state.activeRuns.slice(runIndex + 1)
                ]
            };
        case 'START_SETPOINT_HOLD':
            runIndex = state.activeRuns.findIndex(r => r.runId === action.runId);
            return {
                ...state,
                isCollectingData: true,
                activeRuns: [
                    ...state.activeRuns.slice(0, runIndex),
                    {
                        ...state.activeRuns[runIndex],
                        setpointStartTime: Date.now()
                    },
                    ...state.activeRuns.slice(runIndex + 1)
                ]
            };
        case 'END_RUN':
            runIndex = state.activeRuns.findIndex(r => r.runId === action.runId);
            let finishedRun = state.activeRuns[runIndex];
            finishedRun.finishTime = Date.now();
            return {
                ...state,
                activeRuns: state.activeRuns.filter(r => r.runId != action.runId),
                finishedRuns: [...state.finishedRuns, finishedRun]
            };
        default:
            return state;
    }
};
