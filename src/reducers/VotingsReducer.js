import each from 'lodash-es/each';
import find from 'lodash-es/find';
import cloneDeep from 'lodash-es/cloneDeep';
import format from 'date-fns/format';
import { DATE } from '../constants/DateTime';
import {
    VOTINGS_FETCHING,
    VOTINGS_FETCHING_SUCCESS,
    VOTINGS_FETCHING_FAIL,
    VOTINGS_VIEW_COUNT_UPDATE
} from '../constants/ActionTypes';

const INITIAL_STATE = {
    data: {
        past: {},
        present: {},
        future: {}
    },
    fetching: false,
    fetchingError: null,
    fetchingPage: false,
    fetchingPageError: null
};

const getInitialVotingsData = (state, payload) => {
    const votings = { ...state, fetching: false, fetchingError: null };
    const { data } = payload;
    const { past, present, future } = data;
    each(past.data, (voting) => {
        voting.date_from = format(voting.date_from, DATE);
        voting.date_to = format(voting.date_to, DATE);
    });
    each(present.data, (voting) => {
        voting.date_from = format(voting.date_from, DATE);
        voting.date_to = format(voting.date_to, DATE);
    });
    each(future.data, (voting) => {
        voting.date_from = format(voting.date_from, DATE);
        voting.date_to = format(voting.date_to, DATE);
    });
    return { ...votings, data };
};

const getVotingsData = (state, payload) => { // payload: { response, params: { page, period } }
    console.log('getVotingsData', payload);
    const votings = { ...state, fetchingPage: false, fetchingPageError: null };
    const { response, params } = payload;
    const { page, period } = params;
    const data = response.data;
    each(data.data, (voting) => {
        voting.date_from = format(voting.date_from, DATE);
        voting.date_to = format(voting.date_to, DATE);
    });
    if (page === data.current_page && state.data[period].data && page !== 1) {
        data.data = state.data[period].data.concat(data.data);
    }
    console.log('getVotingsData state', { ...votings, data });
    return { ...votings, data: { ...state.data, [period]: data } };
};

const updateViewCount = (state, { id, period }) => {
    const newState = cloneDeep(state);
    const voting = find(newState.data[period].data, { id });
    if (voting) voting.view_count = true;
    return newState;
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case VOTINGS_FETCHING:
            if (payload) {
                return { ...state, fetchingPage: true };
            }
            return { ...state, fetching: true };
        case VOTINGS_FETCHING_SUCCESS:
            if (payload.params) {
                return getVotingsData(state, payload);
            }
            return getInitialVotingsData(state, payload.response);
        case VOTINGS_FETCHING_FAIL:
            if (payload.params) {
                return { ...state, fetchingPage: false, fetchingPageError: payload.response };
            }
            return { ...state, fetching: false, fetchingError: payload.response };
        case VOTINGS_VIEW_COUNT_UPDATE:
            return updateViewCount(state, payload);
        default:
            return state;
    }
};
