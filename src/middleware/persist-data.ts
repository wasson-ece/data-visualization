import { Dispatch, Store } from 'redux';
import { RootState, RootAction } from '../renderer/reducers';
import HeaterDatum from '../interfaces/HeaterDatum';
import Run from '../interfaces/Run';

/**
 * Takes all run state information and opaquely persists it somewhere
 */
export interface PersistenceFunction {
    (id: string, run: Run, data: HeaterDatum[]): Promise<void>;
}

export const shouldActionTriggerPersistence = (action: RootAction): boolean => {
    switch (action.type) {
        case 'FINISH_CURRENT_RUN':
            return true;
        default:
            return false;
    }
};

/**
 * Find the 3-tuple of run state information
 * @param state Entire application state tree
 * @param runId UUID of the run
 */
export const findRunData = (state: RootState, heaterId: string): [string, Run, HeaterDatum[]] => {
    let heater = state.heaters.find(h => (h.id = heaterId));
    let run = heater!.runs.find(r => r.isRunning);
    let id = heater!.label;
    if (run) return [id, run, heater!.data.filter(datum => datum.runId === run!.uuid)];
    else throw new Error(`Unable to find current run data on heater ${heaterId}`);
};

/**
 * Creates a middleware which persists data according to `persistenceFn`'s implementation,
 * e.g. `someMiddleware = persistDataMiddlewareCreator(shoveDataAsJsonIntoS3Bucket)`. This
 * middleware can then be injected into Redux like any other middleware
 */
const persistDataMiddlewareCreator = (persistenceFn: PersistenceFunction) => (
    store: Store<RootState>
) => (next: Dispatch<RootAction>) => (action: RootAction) => {
    if (!shouldActionTriggerPersistence(action)) return next(action);

    if (action.type === 'FINISH_CURRENT_RUN') {
        let state = store.getState();
        const [id, heater, data] = findRunData(state, action.id);
        persistenceFn(id || 'unlabelled', heater, data);
    }

    return next(action);
};

export default persistDataMiddlewareCreator;
