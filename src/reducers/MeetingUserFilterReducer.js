import each from 'lodash-es/each';
import unionBy from 'lodash-es/unionBy';
import {
    MEETING_USERS_FETCHING,
    MEETING_USERS_FETCHING_SUCCESS,
    MEETING_USERS_FETCHING_FAIL,
    FILTER_MEETING_USER_VISIBILITY_TOGGLE,
    FILTER_MEETING_USER_TOGGLE,
    FILTER_MEETING_USER_RESET,
    MEETING_EDIT_FETCHING_SUCCESS
} from '../constants/ActionTypes';
import { divideArray, toggleItemSelection, resetFilter } from './FilterHelpers';

const getInitialState = () => {
    return {
        fetching: false,
        fetchingError: null,
        plain: [],
        divided: { colLeft: [], colRight: [] },
        selected: [],
        updated_at: null
    };
};

const INITIAL_STATE = getInitialState();

const populateState = (state, payload) => {
    console.log('populateState payload', payload);
    const plain = unionBy(state.selected, payload.data, 'id');
    return { ...state, fetching: false, fetchingError: null, plain, divided: divideArray(plain), updated_at: Date.now() };
};

const initiateFilterSelection = (payload) => {
    const state = getInitialState();
    const { users } = payload.response.data;
    each(users, (user) => {
        user.selected = true;
        state.plain.push(user);
        state.selected.push(user);
    });
    state.divided = divideArray(state.plain);
    return state;
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case MEETING_USERS_FETCHING:
            return { ...state, fetching: true };
        case MEETING_USERS_FETCHING_SUCCESS:
            return populateState(state, payload);
        case MEETING_USERS_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        case FILTER_MEETING_USER_VISIBILITY_TOGGLE:
            return { ...state, ...payload, updated_at: Date.now() };
        case FILTER_MEETING_USER_TOGGLE:
            return toggleItemSelection(state, payload);
        case FILTER_MEETING_USER_RESET:
            return resetFilter(state);
        case MEETING_EDIT_FETCHING_SUCCESS:
            return initiateFilterSelection(payload);
        default:
            return state;
    }
};
