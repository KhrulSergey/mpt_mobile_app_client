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
    COUNTERS_FETCHING_FAIL,
    REFS_FETCHING,
    REFS_FETCHING_SUCCESS,
    REFS_FETCHING_FAIL,
    STORE_DIMENSIONS,
    STORE_URLS,
    RESET_URLS
} from '../constants/ActionTypes';

export const emailChanged = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const passwordChanged = (text) => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    };
};

export const storeDimensions = (payload) => {
    return {
        type: STORE_DIMENSIONS,
        payload
    };
};

export const storeUrls = (payload) => {
    return {
        type: STORE_URLS,
        payload
    };
};

export const resetUrls = () => {
    return {
        type: RESET_URLS
    };
};

export const initUser = (userData) => {
    return {
        type: INIT_USER,
        payload: userData
    };
};

export const initUserSuccess = ({ code }) => {
    return {
        type: INIT_USER_SUCCESS,
        payload: code
    };
};

export const initUserFail = (error) => {
    return {
        type: INIT_USER_FAIL,
        payload: error
    };
};

export const loginUser = (userData) => {
    return {
        type: LOGIN_USER,
        payload: userData
    };
};

export const loginUserSuccess = (userData) => {
    return {
        type: LOGIN_USER_SUCCESS,
        payload: userData
    };
};

export const loginUserFail = (error) => {
    return {
        type: LOGIN_USER_FAIL,
        payload: error
    };
};

export const updateToken = (token) => {
    return {
        type: TOKEN_UPDATE,
        payload: token
    };
};

export const fetchCounters = () => {
    return {
        type: COUNTERS_FETCHING
    };
};

export const fetchCountersSuccess = (response) => {
    return {
        type: COUNTERS_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchCountersFail = (response) => {
    return {
        type: COUNTERS_FETCHING_FAIL,
        payload: response
    };
};

export const fetchRefs = () => {
    return {
        type: REFS_FETCHING
    };
};

export const fetchRefsSuccess = (response) => {
    return {
        type: REFS_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchRefsFail = (response) => {
    return {
        type: REFS_FETCHING_FAIL,
        payload: response
    };
};
