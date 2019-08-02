import { Dispatch, Store } from 'redux';
import { RootState, RootAction } from '../renderer/reducers';
import HeaterDatum from '../interfaces/HeaterDatum';
import Run from '../interfaces/Run';

/**
 * Takes all run state information and opaquely persists it somewhere
 */
export interface PersistenceFunction {
    (run: Run, data: HeaterDatum[]): Promise<void>;
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
export const findRunData = (state: RootState, heaterId: string): [Run, HeaterDatum[]] => {
    let run = state.heaters[heaterId as any].runs.find(r => r.isRunning);
    if (run)
        //@ts-ignore HURP DERP I'M TYPESCRIPT AND I CAN'T PROPERLY REASON ABOUT NULL REFERENCES
        return [run, state.heaters[heaterId as any].data.filter(datum => datum.runId === run.uuid)];
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
        const [heater, data] = findRunData(store.getState(), action.id);
        persistenceFn(heater, data);
    }

    return next(action);
};

export default persistDataMiddlewareCreator;
