import { RootState, RootAction } from '../renderer/reducers';
import { Store, Dispatch } from 'redux';
import HeaterState from '../interfaces/HeaterState';

export interface OvenLabels {
    [heaterId: string]: string;
}

const shouldActionTriggerPersistence = (action: RootAction): boolean =>
    action.type === 'START_NEXT_RUN';

export const persistOvenLabels = (heaters: HeaterState[]) => {
    let ovenLabels: OvenLabels = {};
    heaters.forEach(h => {
        ovenLabels[h.id] = h.label;
    });

    try {
        localStorage.setItem('ovenLabels', JSON.stringify(ovenLabels));
    } catch (e) {
        console.log(e);
    }
};

/**
 * Store unfinished runs locally
 * @param {Store<RootState>} store
 */
const persistOvenLabelsMiddlware = (store: Store<RootState>) => (next: Dispatch<RootAction>) => (
    action: RootAction
) => {
    if (!shouldActionTriggerPersistence(action)) return next(action);
    let state = store.getState();
    persistOvenLabels(state.heaters);

    return next(action);
};

export default persistOvenLabelsMiddlware;
