import { Dispatch, Store } from 'redux';
import { RootState, RootAction } from '../renderer/reducers/root';
import Run from '../interfaces/Run';
import RunStatus from '../interfaces/RunStatus';
import { Point } from 'electron';

/**
 * Takes all run state information and opaquely persists it somewhere
 */
export interface PersistenceFunction {
    (run: Run, runStatus: RunStatus, data: Point[]): Promise<void>;
}

export const shouldActionTriggerPersistence = (action: RootAction): boolean => {
    switch (action.type) {
        case 'END_RUN':
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
export const findAllRunData = (state: RootState, runId: string): [Run, RunStatus, Point[]] => {
    let runStatus: RunStatus;
    let run: Run;
    let data: Point[];
    for (let currentRunStatus of [
        ...state.dataCollection.activeRuns,
        ...state.dataCollection.finishedRuns
    ]) {
        if (currentRunStatus.runId === runId) {
            runStatus = currentRunStatus;
            let runIndex = state.heaterRuns[runStatus.ovenId].findIndex(r => r.uuid === runId);
            run = state.heaterRuns[runStatus.ovenId][runIndex];
            data = state.controllerData.heaters[runStatus.ovenId];
            return [run, runStatus, data];
        }
    }

    throw new Error(`Unable to find run with id ${runId}`);
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

    if (action.type === 'END_RUN') {
        const [run, runStatus, data] = findAllRunData(store.getState(), action.runId);
        persistenceFn(run, runStatus, data);
    }

    return next(action);
};

export default persistDataMiddlewareCreator;
