import each from 'lodash-es/each';
import find from 'lodash-es/find';
import cloneDeep from 'lodash-es/cloneDeep';
import {
    REFS_FETCHING,
    REFS_FETCHING_SUCCESS,
    REFS_FETCHING_FAIL,
    FILTER_PROJECTS_STATUS_POPULATE,
    FILTER_PROJECTS_STATUS_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_STATUS_TOGGLE,
    FILTER_PROJECTS_STATUS_RESET,
    FILTER_PROJECTS_STATUS_FILTER
} from '../constants/ActionTypes';
import { divideArray, toggleItemSelection, resetFilter, applyTextFilter } from './FilterHelpers';

const INITIAL_STATE = {
    fetching: false,
    fetchingError: null,
    selected: [],
    updated_at: null
};

const getInitialState = (state, payload) => {
    const statuses = cloneDeep(payload.data.projectStatuses);
    return { ...state, fetching: false, fetchingError: null, plain: statuses, divided: divideArray(statuses), selected: [], statuses: cloneDeep(payload.data.projectStatuses), updated_at: Date.now() };
};

const toggleVisibility = (state, payload) => {
    if (payload) {
        return { ...state, ...payload.data, currentScene: payload.currentScene, updated_at: Date.now() }
    }
    return { ...state, updated_at: Date.now() }
};

const populateFilter = (state, payload) => {
    state.selected = [];
    const newState = cloneDeep(state);
    newState.plain = cloneDeep(newState.statuses);
    each(payload, (status) => {
        const selectedStatus = find(newState.plain, { id: status.id });
        selectedStatus.selected = true;
        newState.selected.push(selectedStatus);
    });
    newState.divided = divideArray(newState.plain);
    return newState;
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case REFS_FETCHING:
            return { ...state, fetching: true };
        case REFS_FETCHING_SUCCESS:
            return getInitialState(state, payload);
        case REFS_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        case FILTER_PROJECTS_STATUS_POPULATE:
            return populateFilter(state, payload);
        case FILTER_PROJECTS_STATUS_VISIBILITY_TOGGLE:
            return toggleVisibility(state, payload);
        case FILTER_PROJECTS_STATUS_TOGGLE:
            return toggleItemSelection(state, payload);
        case FILTER_PROJECTS_STATUS_RESET:
            return resetFilter(state);
        case FILTER_PROJECTS_STATUS_FILTER:
            return applyTextFilter(state, payload);
        default:
            return state;
    }
};
