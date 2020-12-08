import map from 'lodash-es/map';
import each from 'lodash-es/each';
import keyBy from 'lodash-es/keyBy';
import values from 'lodash-es/values';
import cloneDeep from 'lodash-es/cloneDeep';
import {
    REGION_SELECTED,
    PROJECTS_COUNT_FETCHING,
    PROJECTS_COUNT_FETCHING_SUCCESS,
    PROJECTS_COUNT_FETCHING_FAIL
} from '../constants/ActionTypes';
import { store } from '../configureStore';

const INITIAL_STATE = {
    projectGroupData: []
};

const extendRegionData = (regionData) => [{
    name: 'Индекс промышленного производства',
    value: regionData.production_index ? +regionData.production_index.toFixed(2) : null,
    unit: '%'
}, {
    name: 'Убыточных предприятий',
    value: regionData.unprofitable_companies_num && regionData.companies_num ? +(regionData.unprofitable_companies_num / regionData.companies_num * 100).toFixed(2) : null,
    unit: '%'
}, {
    name: 'Число работников промышленности',
    value: regionData.workers_num ? +(regionData.workers_num / 1e3).toFixed(2) : null,
    unit: 'тыс. чел.'
}, {
    name: 'Задолженность по зарплате',
    value: regionData.debt ? +(regionData.debt / 1e6).toFixed(2) : null,
    unit: 'млн. руб.'
}];

const onRegionSelected = (state, payload) => {
    const { state_funds, own_funds } = payload;
    const data = {
        state_funds: +(state_funds / 1e6).toFixed(2),
        own_funds: +(own_funds / 1e6).toFixed(2)
    };
    return { ...state, ...payload, ...data, info: extendRegionData(payload)};
};

const onProjectsCountFetchingSuccess = (state, payload) => {
    const projectGroups = cloneDeep(store.getState().refs.data.projectGroupsDict);
    const projectGroupData = map(projectGroups, projectGroup => ({
        projectGroupId: projectGroup.id,
        projectsCount: 0,
        projectGroup
    }));
    const projectGroupDataKeyedByProjectGroupId = keyBy(projectGroupData, 'projectGroupId');
    each(payload.response.data, ({ project_num, project_group_id }) => {
        projectGroupDataKeyedByProjectGroupId[project_group_id].projectsCount = project_num;
    });
    return { ...state, projectGroupData: values(projectGroupDataKeyedByProjectGroupId), fetching: false, fetchingError: null };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case REGION_SELECTED:
            return onRegionSelected(state, payload);
        case PROJECTS_COUNT_FETCHING:
            return { ...state, fetching: true, fetchingError: null };
        case PROJECTS_COUNT_FETCHING_SUCCESS:
            return onProjectsCountFetchingSuccess(state, payload);
        case PROJECTS_COUNT_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        default:
            return state;
    }
};
