import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger';
import Config from 'react-native-config';
import reducers from '../reducers';
import Saga from './saga';

const sagaMiddleware = createSagaMiddleware();

export const store = Config.ENV === 'production' ?
    createStore(reducers, applyMiddleware(sagaMiddleware))
    :
    createStore(reducers, applyMiddleware(sagaMiddleware, logger));

export default function configureStore() {
    sagaMiddleware.run(Saga);
    return store;
}
