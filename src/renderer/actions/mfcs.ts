import { Action, ActionCreator } from 'redux';
import MfcController from 'node-ti/build/ti-components/mfc-controller';

export interface SetMfcs extends Action {
    type: 'SET_MFCS';
    mfcs: MfcController[];
}

export const setMfcs: ActionCreator<SetMfcs> = (mfcs: MfcController[]) => ({
    type: 'SET_MFCS',
    mfcs
});

export type MfcsAction = SetMfcs;
