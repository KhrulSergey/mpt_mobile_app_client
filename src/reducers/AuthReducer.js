import each from 'lodash-es/each';
import format from 'date-fns/format';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import SplashScreen from 'react-native-smart-splash-screen';
import { DATE } from '../constants/DateTime';
import {
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    INIT_USER,
    INIT_USER_SUCCESS,
    INIT_USER_FAIL,
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    TOKEN_UPDATE,
    COUNTERS_FETCHING,
    COUNTERS_FETCHING_SUCCESS,
    COUNTERS_FETCHING_FAIL
} from '../constants/ActionTypes';

const INITIAL_STATE = {
    email: '',
    password: '',
    init: true,
    user: {},
    uid: null,
    code: null,
    token: null,
    error: null,
    loading: false,
    noInternet: false,
    noPermissions: false,
    serverError: false,
    synchronizedAt: null,
    counters: {},
    countersFetching: false,
    countersFetchingError: null
};

const closeSplashScreen = () => {
    SplashScreen.close({
        animationType: SplashScreen.animationType.scale,
        duration: 850,
        delay: 500,
    });
};

const loginUser = (state, payload) => {
    return { ...state, error: null, loading: true, uid: payload.uid };
};

const loginUserSuccess = (state, payload) => {
    AsyncStorage.setItem('gispUser', JSON.stringify(payload, (k, v) => v ? v : '')) // { user, roles, company, token, uid, deviceName }
        .then(() => {
            // TODO filter stored data
            if (state.init) {
                Actions.menu({ type: 'replace', leftButtonImage: null });
                closeSplashScreen();
            }
        })
        .catch(console.log);
    let userRole = 'manager';
    each(payload.roles, (role) => {
        if (role.code === 'gisp_admin') {
            userRole = 'admin';
            return false;
        }
    });
    const counters = payload.counters;
    const synchronizedAt = payload.dataBaseDateFrom ? format(payload.dataBaseDateFrom, DATE) : null;
    firebase.notifications().setBadge(counters.newVotings + counters.newMeetings);
    return { ...state, user: { ...payload.user, ...payload, role: userRole }, error: null, loading: false, counters, synchronizedAt, noInternet: false, noPermissions: false, init: false };
};

const updateCounters = (state, payload) => {
    const counters = payload.data;
    firebase.notifications().setBadge(counters.newVotings + counters.newMeetings);
    return { ...state, countersFetching: false, countersFetchingError: null, counters };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case EMAIL_CHANGED:
            return { ...state, email: payload };
        case PASSWORD_CHANGED:
            return { ...state, password: payload };
        case INIT_USER:
            return { ...state };
        case INIT_USER_SUCCESS:
            Actions.register();
            closeSplashScreen();
            return { ...state, code: payload, serverError: false, noInternet: false, noPermissions: false };
        case INIT_USER_FAIL:
            Actions.register();
            AsyncStorage.removeItem('gispUser')
                .then(() => {
                    // Actions.redirect();
                })
                .catch(console.log);
            return { ...state, error: payload, loading: false, serverError: true };
        case LOGIN_USER:
            return loginUser(state, payload);
        case LOGIN_USER_SUCCESS:
            return loginUserSuccess(state, payload);
        case LOGIN_USER_FAIL:
            let noInternet = false;
            let noPermissions = false;
            if (!payload || (payload.status !== 423 && payload.status !== 424 && payload.status !== 404 && payload.status !== 400)) {
                noInternet = true;
                closeSplashScreen();
            }
            if (payload && payload.status === 423) {
                noPermissions = true;
                closeSplashScreen();
            }
            return { ...state, error: payload, password: '', loading: false, noInternet, noPermissions };
        case TOKEN_UPDATE:
            return { ...state, token: payload };
        case COUNTERS_FETCHING:
            return { ...state, countersFetching: true };
        case COUNTERS_FETCHING_SUCCESS:
            return updateCounters(state, payload);
        case COUNTERS_FETCHING_FAIL:
            return { ...state, countersFetching: false, countersFetchingError: payload };
        default:
            return state;
    }
};
