import each from 'lodash-es/each';
import unionBy from 'lodash-es/unionBy';
import {
    VOTING_COMPANIES_FETCHING,
    VOTING_COMPANIES_FETCHING_SUCCESS,
    VOTING_COMPANIES_FETCHING_FAIL,
    FILTER_VOTING_COMPANY_VISIBILITY_TOGGLE,
    FILTER_VOTING_COMPANY_TOGGLE,
    FILTER_VOTING_COMPANY_RESET,
    VOTING_EDIT_FETCHING_SUCCESS
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
    const { targetedCompanies } = payload.response.data;
    each(targetedCompanies, (company) => {
        company.selected = true;
        state.plain.push(company);
        state.selected.push(company);
    });
    state.divided = divideArray(state.plain);
    return state;
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case VOTING_COMPANIES_FETCHING:
            return { ...state, fetching: true };
        case VOTING_COMPANIES_FETCHING_SUCCESS:
            return populateState(state, payload);
        case VOTING_COMPANIES_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        case FILTER_VOTING_COMPANY_VISIBILITY_TOGGLE:
            return { ...state, ...payload, updated_at: Date.now() };
        case FILTER_VOTING_COMPANY_TOGGLE:
            return toggleItemSelection(state, payload);
        case FILTER_VOTING_COMPANY_RESET:
            return resetFilter(state);
        case VOTING_EDIT_FETCHING_SUCCESS:
            return initiateFilterSelection(payload);
        default:
            return state;
    }
};
