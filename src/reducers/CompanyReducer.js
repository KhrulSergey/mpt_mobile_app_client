import map from 'lodash-es/map';
import each from 'lodash-es/each';
import keyBy from 'lodash-es/keyBy';
import values from 'lodash-es/values';
import cloneDeep from 'lodash-es/cloneDeep';
import { isNumeric } from '../constants/util';
import {
    COMPANY_FETCHING,
    COMPANY_FETCHING_SUCCESS,
    COMPANY_FETCHING_FAIL
} from '../constants/ActionTypes';
import { store } from '../configureStore';

const INITIAL_STATE = {
    data: {
      projectGroupData: []
    },
    fetching: false,
    fetchingError: null
};

const getCompanyData = (state, payload) => {
    const { data } = payload.response;
    const { projects } = data;
    const projectGroups = cloneDeep(store.getState().refs.data.projectGroupsDict);
    const projectGroupData = map(projectGroups, projectGroup => ({
        projectGroupId: projectGroup.id,
        projectsCount: 0,
        projectGroup
    }));
    const projectGroupDataKeyedByProjectGroupId = keyBy(projectGroupData, 'projectGroupId');
    each(projects, ({ project_count, project_group_id }) => {
        projectGroupDataKeyedByProjectGroupId[project_group_id].projectsCount = project_count;
    });
    const companyData = { ...data, projectGroupData: values(projectGroupDataKeyedByProjectGroupId) };
    companyData.own_funds = +(data.own_funds / 1e6).toFixed(2);
    companyData.state_funds = +(data.state_funds / 1e6).toFixed(2);
    // if (!companyData.integration_rating) companyData.integration_rating = 'Нет данных';
    // if (!companyData.financial_status) companyData.financial_status = [{ year: 'N/A', value: 'N/A' }];
    if (companyData.region_code) {
        const region = store.getState().refs.data.regionsDict[companyData.region_code];
        companyData.region_name = region ? region.name : 'Неизвестный регион';
    } else {
        companyData.region_name = 'Не указан';
    }
    companyData.industries = data.industries ? map(data.industries, o => o.name).join('\n') : 'Не указан';
    // if (!isNumeric(companyData.projects_count)) {
    //     companyData.projects_count = 'нет данных';
    // }
    return { ...state, fetching: false, fetchingError: null, data: companyData };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case COMPANY_FETCHING:
            return { ...state, fetching: true };
        case COMPANY_FETCHING_SUCCESS:
            return getCompanyData(state, payload);
        case COMPANY_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        default:
            return state;
    }
};
