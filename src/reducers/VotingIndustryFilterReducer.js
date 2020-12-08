import each from 'lodash-es/each';
import find from 'lodash-es/find';
import cloneDeep from 'lodash-es/cloneDeep';
import {
    REFS_FETCHING,
    REFS_FETCHING_SUCCESS,
    REFS_FETCHING_FAIL,
    FILTER_VOTING_INDUSTRY_VISIBILITY_TOGGLE,
    FILTER_VOTING_INDUSTRY_TOGGLE,
    FILTER_VOTING_INDUSTRY_RESET,
    VOTING_EDIT_FETCHING_SUCCESS,
    FILTER_VOTING_INDUSTRY_FILTER
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
    return { ...state, fetching: false, fetchingError: null, plain: industries, divided: divideArray(industries), selected: [], updated_at: Date.now() };
};

// const toggleVotingIndustryFilterSelection = (state, { id }) => {
//     const newState = cloneDeep(state);
//     each(newState.plain, (item) => {
//         if (item.id === id) {
//             item.selected = !item.selected;
//             if (item.selected) {
//                 let needSelect = true;
//                 each(newState.selected, (_item) => {
//                     if (_item.id === item.id) {
//                         needSelect = false;
//                         return false;
//                     }
//                 });
//                 if (needSelect) {
//                     newState.selected.push(item);
//                 }
//             } else {
//                 each(newState.selected, (_item, index) => {
//                     if (_item.id === item.id) {
//                         newState.selected.splice(index, 1);
//                         return false;
//                     }
//                 });
//             }
//             return false;
//         }
//     });
//     newState.divided = divideArray(newState.plain);
//     return newState;
// };

const toggleVisibility = (state, payload) => {
    if (payload) {
        return { ...state, ...payload.data, updated_at: Date.now() }
    }
    return { ...state, updated_at: Date.now() }
};

const initiateVotingIndustryFilterSelection = (state, payload) => {
    const { filters } = payload.response.data;
    const industries = filters && filters.industries ? { ...filters.industries } : [];
    const filter = { ...state };
    each(industries, (industryId) => {
        const item = find(filter.plain, { id: industryId });
        item.selected = true;
        filter.selected.push(item);
    });
    filter.divided = divideArray(filter.plain);
    return filter;
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
        case FILTER_VOTING_INDUSTRY_VISIBILITY_TOGGLE:
            return toggleVisibility(state, payload);
        case FILTER_VOTING_INDUSTRY_TOGGLE:
            return toggleItemSelection(state, payload);
        case FILTER_VOTING_INDUSTRY_RESET:
            return resetFilter(state);
        case VOTING_EDIT_FETCHING_SUCCESS:
            return initiateVotingIndustryFilterSelection(resetFilter(state), payload);
        case FILTER_VOTING_INDUSTRY_FILTER:
            return applyTextFilter(state, payload);
        default:
            return state;
    }
};
