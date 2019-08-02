import { Action, ActionCreator } from 'redux';

export interface ToggleDataCollection extends Action {
    type: 'TOGGLE_DATA_COLLECTION';
}

export const toggleDataCollection: ActionCreator<ToggleDataCollection> = () => ({
    type: 'TOGGLE_DATA_COLLECTION'
});

export type DataCollectionAction = ToggleDataCollection;
