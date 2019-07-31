import { Action, ActionCreator } from 'redux';

export interface ToggleDataCollection extends Action {
    type: 'TOGGLE_DATA_COLLECTION';
}

export interface StartRun extends Action {
    type: 'START_RUN';
    runId: string;
    ovenId: string;
}

export interface StartEquilibration extends Action {
    type: 'START_EQUILIBRATION';
    runId: string;
}

export interface StartSetpointHold extends Action {
    type: 'START_SETPOINT_HOLD';
    runId: string;
}

export interface EndRun extends Action {
    type: 'END_RUN';
    runId: string;
}

export const toggleDataCollection: ActionCreator<ToggleDataCollection> = () => ({
    type: 'TOGGLE_DATA_COLLECTION'
});

export const startRun: ActionCreator<StartRun> = (runId: string, ovenId: string) => ({
    type: 'START_RUN',
    runId,
    ovenId
});

export const startEquilibration: ActionCreator<StartEquilibration> = (runId: string) => ({
    type: 'START_EQUILIBRATION',
    runId
});

export const startSetpointHold: ActionCreator<StartSetpointHold> = (runId: string) => ({
    type: 'START_SETPOINT_HOLD',
    runId
});

export const endRun: ActionCreator<EndRun> = (runId: string) => ({
    type: 'END_RUN',
    runId
});

export type DataCollectionAction =
    | StartRun
    | ToggleDataCollection
    | StartEquilibration
    | StartSetpointHold
    | EndRun;
