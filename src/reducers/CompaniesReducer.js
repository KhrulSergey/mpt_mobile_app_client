import map from 'lodash-es/map';
import each from 'lodash-es/each';
import {
    COMPANIES_FETCHING,
    COMPANIES_FETCHING_SUCCESS,
    COMPANIES_FETCHING_FAIL
} from '../constants/ActionTypes';
import { store } from '../configureStore';

const INITIAL_STATE = {
    data: [],
    fetching: false,
    fetchingError: null
};

const fillStatusObject = (state, payload) => {
    let data = payload.response.data.data;
    const { current_page, last_page } = payload.response.data;
    each(data, (company) => {
        const region = store.getState().refs.data.regionsDict[company.region_code];
        // company.industry_name = industry && industry.name;
        company.industries = map(company.industries, o => o.name).join('\n');
        company.region_name = region && region.name;
    });
    if (payload.params.page === current_page && state.data && payload.params.page !== 1) {
        data = state.data.concat(data);
    }
    return { ...state, fetching: false, fetchingError: null, data, current_page, last_page };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case COMPANIES_FETCHING:
            return { ...state, fetching: !payload.page || payload.page === 1 };
        case COMPANIES_FETCHING_SUCCESS:
            return fillStatusObject(state, payload);
        case COMPANIES_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        default:
            return state;
    }
};
