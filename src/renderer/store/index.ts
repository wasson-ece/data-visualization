import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { rootReducer, RootState } from '../reducers/root';
import persistData from '../../middleware/persist-data';
import influxDataPersistence from '../../db/influx-data-persistence';

const configureStore = (initialState?: RootState): Store<RootState | undefined> => {
    const middlewares: any[] = [persistData(influxDataPersistence)];
    const enhancer = composeWithDevTools(applyMiddleware(...middlewares));
    return createStore(rootReducer, initialState, enhancer);
};

const store = configureStore();

if (typeof module.hot !== 'undefined') {
    module.hot.accept('../reducers', () =>
        store.replaceReducer(require('../reducers').rootReducer)
    );
}

export default store;
