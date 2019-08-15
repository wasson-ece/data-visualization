import { Action, ActionCreator } from 'redux';
import EpcController from 'node-ti/build/ti-components/epc-controller';

export interface SetEpcs extends Action {
    type: 'SET_EPCS';
    epcs: EpcController[];
}

export const setEpcs: ActionCreator<SetEpcs> = (epcs: EpcController[]) => ({
    type: 'SET_EPCS',
    epcs
});

export type EpcsAction = SetEpcs;
