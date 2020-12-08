import cloneDeep from 'lodash-es/cloneDeep';
import {
    REFS_FETCHING,
    REFS_FETCHING_SUCCESS,
    REFS_FETCHING_FAIL,
    FILTER_PROJECTS_SUMMARIZED_PROJECT_GROUP_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_SUMMARIZED_PROJECT_GROUP_TOGGLE
} from '../constants/ActionTypes';
import { toggleRadioItemSelection } from './FilterHelpers';

const INITIAL_STATE = {
    fetching: false,
    fetchingError: null,
    list: [],
    selected: null,
    updated_at: null
};

const getInitialState = (state, { projectGroups }) => {
    const projectGroupsClone = cloneDeep(projectGroups);
    const projectGroupsCount = projectGroupsClone.length;
    if (projectGroupsCount > 0) {
        projectGroupsClone[0].selected = true;
        for (let i = 1; i < projectGroupsCount; i++) {
            projectGroupsClone[i].selected = false;
        }
    }
    return { ...state, fetching: false, fetchingError: null, list: projectGroupsClone, selected: projectGroupsClone[0], updated_at: Date.now() };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case REFS_FETCHING:
            return { ...state, fetching: true };
        case REFS_FETCHING_SUCCESS:
            return getInitialState(state, payload.data);
        case REFS_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        case FILTER_PROJECTS_SUMMARIZED_PROJECT_GROUP_VISIBILITY_TOGGLE:
            return { ...state, ...payload, updated_at: Date.now() };
        case FILTER_PROJECTS_SUMMARIZED_PROJECT_GROUP_TOGGLE:
            return toggleRadioItemSelection(state, payload);
        default:
            return state;
    }
};
