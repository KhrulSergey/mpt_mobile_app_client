import map from 'lodash-es/map';
import cloneDeep from 'lodash-es/cloneDeep';
import {
    REFS_FETCHING,
    REFS_FETCHING_SUCCESS,
    REFS_FETCHING_FAIL,
    FILTER_MAP_PROJECT_GROUP_VISIBILITY_TOGGLE,
    FILTER_MAP_PROJECT_GROUP_TOGGLE,
    FILTER_MAP_PROJECT_GROUP_POPULATE
} from '../constants/ActionTypes';
import {divideArray, toggleRadioItemSelection} from './FilterHelpers';
import each from "lodash-es/forEach";
import find from "lodash-es/find";

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

const toggleVisibility = (state, payload) => {
    if (payload) {
        return { ...state, ...payload.data, currentScene: payload.currentScene, updated_at: Date.now() }
    }
    return { ...state, updated_at: Date.now() }
};

const populateFilter = (state, payload) => {
    const newState = cloneDeep(state);
    newState.list = map(newState.list, projectGroup => {
        let selected = false;
        if (payload.id === projectGroup.id) {
            newState.selected = projectGroup;
            selected = true;
        }
        return { ...projectGroup, selected };
    });
    return newState;
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
        case FILTER_MAP_PROJECT_GROUP_VISIBILITY_TOGGLE:
            return toggleVisibility(state, payload);
        case FILTER_MAP_PROJECT_GROUP_TOGGLE:
            return toggleRadioItemSelection(state, payload);
        case FILTER_MAP_PROJECT_GROUP_POPULATE:
            return populateFilter(state, payload);
        default:
            return state;
    }
};
