import map from 'lodash-es/map';
import each from 'lodash-es/each';
import {
    PROJECTS_FETCHING,
    PROJECTS_FETCHING_SUCCESS,
    PROJECTS_FETCHING_FAIL
} from '../constants/ActionTypes';
import { store } from '../configureStore';

const INITIAL_STATE = {
    data: [],
    fetching: false,
    fetchingError: null,
    sortOrder: {
        status_id: null
    }
};

const fillStatusObject = (state, payload) => {
    let data = payload.response.data.data;
    const { current_page, last_page } = payload.response.data;
    each(data, (project) => {
        project.status = store.getState().refs.data.projectStatusesDict[project.status_id];
        project.technologicalDirections = project.technological_directions.length > 0 ? map(project.technological_directions, o => o.name).join('\n') : 'Не задано';
    });
    const { page, sort, sort_direction } = payload.params;
    if (page === current_page && state.data && page !== 1) {
        data = state.data.concat(data);
    }
    return { ...state, fetching: false, fetchingError: null, data, current_page, last_page, sortOrder: { status_id: sort === 'status_id' ? sort_direction : null } };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case PROJECTS_FETCHING:
            return { ...state, fetching: !payload.page || payload.page === 1 };
        case PROJECTS_FETCHING_SUCCESS:
            return fillStatusObject(state, payload);
        case PROJECTS_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        default:
            return state;
    }
};
