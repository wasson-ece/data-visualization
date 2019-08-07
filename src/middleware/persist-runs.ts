import { RootState, RootAction } from '../renderer/reducers';
import { Store, Dispatch } from 'redux';
import Run from '../interfaces/Run';
import { isRunValid } from '../renderer/reducers/run';
import HeaterState from '../interfaces/HeaterState';

const shouldActionTriggerPersistence = (action: RootAction): boolean =>
    action.type === 'START_NEXT_RUN';

export const isUnfinishedRun = (run: Run) => !run.isFinished && !run.isRunning && isRunValid(run);

export interface UnfinishedRuns {
    [heaterId: string]: Run[];
}

export const persistUnfinishedRuns = (heaters: HeaterState[]) => {
    let unfinishedRuns: UnfinishedRuns = {};
    heaters.forEach(h => {
        unfinishedRuns[h.id] = h.runs.filter(isUnfinishedRun);
    });

    try {
        localStorage.setItem('unfinishedRuns', JSON.stringify(unfinishedRuns));
    } catch (e) {
        console.log(e);
    }
};

/**
 * Store unfinished runs locally
 * @param {Store<RootState>} store
 */
const persistUnfinishedRunsMiddlware = (store: Store<RootState>) => (
    next: Dispatch<RootAction>
) => (action: RootAction) => {
    if (!shouldActionTriggerPersistence(action)) return next(action);
    let state = store.getState();
    persistUnfinishedRuns(state.heaters);

    return next(action);
};

export default persistUnfinishedRunsMiddlware;
