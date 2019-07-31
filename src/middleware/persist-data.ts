import { Dispatch, Store } from 'redux';
import { RootState, RootAction } from '../renderer/reducers/index';

const persistData = (store: Store<RootState>) => (next: Dispatch<RootAction>) => (
    action: RootAction
) => {
    const result = next(action);
    // const shouldPersist; // Some Action

    // if (!shouldPersist) return result;
    // window.requestIdleCallback(() => {
    //     const appState = store.getState();
    //     shouldPersist.forEach(reducerName => {
    //         const stateToPersist = appState[reducerName];
    //         cacheLibrary.set(reducerName, stateToPersist);
    //     });
    // });

    return result;
};

export default persistData;
