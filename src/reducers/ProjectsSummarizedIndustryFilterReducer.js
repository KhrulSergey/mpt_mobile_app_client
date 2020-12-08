import each from 'lodash-es/each';
import find from 'lodash-es/find';
import cloneDeep from 'lodash-es/cloneDeep';
import {
    REFS_FETCHING,
    REFS_FETCHING_SUCCESS,
    REFS_FETCHING_FAIL,
    FILTER_PROJECTS_SUMMARIZED_INDUSTRY_POPULATE,
    FILTER_PROJECTS_SUMMARIZED_INDUSTRY_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_SUMMARIZED_INDUSTRY_TOGGLE,
    FILTER_PROJECTS_SUMMARIZED_INDUSTRY_RESET,
    FILTER_PROJECTS_SUMMARIZED_INDUSTRY_FILTER
} from '../constants/ActionTypes';
import { divideArray, toggleItemSelection, resetFilter, applyTextFilter } from './FilterHelpers';

const INITIAL_STATE = {
    fetching: false,
    fetchingError: null,
    selected: [],
    updated_at: null
};

const getInitialState = (state, payload) => {
    const industries = cloneDeep(payload.data.industries);
    return { ...state, fetching: false, fetchingError: null, plain: industries, divided: divideArray(industries), selected: [], industries: cloneDeep(payload.data.industries), updated_at: Date.now() };
};

const populateFilter = (state, payload) => {
    state.selected = [];
    const newState = cloneDeep(state);
    newState.plain = cloneDeep(newState.industries);
    each(payload, (industry) => {
        const selectedIndustry = find(newState.plain, { id: industry.id });
        selectedIndustry.selected = true;
        newState.selected.push(selectedIndustry);
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
        case FILTER_PROJECTS_SUMMARIZED_INDUSTRY_POPULATE:
            return populateFilter(state, payload);
        case FILTER_PROJECTS_SUMMARIZED_INDUSTRY_VISIBILITY_TOGGLE:
            return { ...state, ...payload, updated_at: Date.now() };
        case FILTER_PROJECTS_SUMMARIZED_INDUSTRY_TOGGLE:
            return toggleItemSelection(state, payload);
        case FILTER_PROJECTS_SUMMARIZED_INDUSTRY_RESET:
            return resetFilter(state);
        case FILTER_PROJECTS_SUMMARIZED_INDUSTRY_FILTER:
            return applyTextFilter(state, payload);
        default:
            return state;
    }
};
