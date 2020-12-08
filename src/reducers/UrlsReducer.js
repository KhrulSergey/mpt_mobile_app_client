import { AsyncStorage } from 'react-native';
import Config from 'react-native-config';
import {
    STORE_URLS,
    RESET_URLS
} from '../constants/ActionTypes';

const INITIAL_STATE = {
    serverUrl: Config.SERVER_URL,
    apiUrl: Config.API_URL
};

const storeUrls = (state, payload) => {
    const apiUrl = payload.apiUrl || (payload.serverUrl.endsWith('/') ? `${payload.serverUrl}api/v1` : `${payload.serverUrl}/api/v1`);
    const serverUrl = payload.serverUrl || state.serverUrl;
    if (payload.save) AsyncStorage.setItem('gispServerUrl', serverUrl);
    return {
        serverUrl: payload.serverUrl || state.serverUrl,
        apiUrl
    };
};

const resetUrls = () => {
    AsyncStorage.removeItem('gispServerUrl');
    return INITIAL_STATE;
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case STORE_URLS:
            return storeUrls(state, payload);
        case RESET_URLS:
            return resetUrls();
        default:
            return state;
    }
};
