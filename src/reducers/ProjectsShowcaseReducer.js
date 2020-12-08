import map from 'lodash-es/map';
import each from 'lodash-es/each';
import { colors } from './ChartColors';
import { store } from '../configureStore';
import {
    PROJECTS_SHOWCASE_FETCHING,
    PROJECTS_SHOWCASE_FETCHING_SUCCESS,
    PROJECTS_SHOWCASE_FETCHING_FAIL
} from '../constants/ActionTypes';

const INITIAL_STATE = {
    data: {
        sections: []
    },
    fetching: false,
    fetchingError: null
};

const getData = (state, payload) => {
    const data = { projects_num: 0, groups: [], sections: [] };
    const { data: groups } = payload.response;
    const { projectGroupsDict } = store.getState().refs.data;
    if (groups && groups.length) {
        each(groups, ({ project_group_id, project_num_ok, project_num_warning, project_num_danger, project_num_planning }) => {
            const projectsNumOk = project_num_ok || 0;
            const projectsNumWarning = project_num_warning || 0;
            const projectsNumDanger = project_num_danger || 0;
            const projectsNumPlanning = project_num_planning || 0;
            const projects_num = projectsNumOk + projectsNumWarning + projectsNumDanger + projectsNumPlanning;
            data.groups.push({
                id: project_group_id,
                name: projectGroupsDict[project_group_id] && projectGroupsDict[project_group_id].name,
                projects_num_ok: projectsNumOk,
                projects_num_warning: projectsNumWarning,
                projects_num_danger: projectsNumDanger,
                projects_num_planning: projectsNumPlanning,
                projects_num
            });
            data.projects_num += projects_num;
        });
    } else {
        data.groups = map(projectGroupsDict, ({ id, name }) => ({
            id,
            name,
            projects_num_ok: 0,
            projects_num_warning: 0,
            projects_num_danger: 0,
            projects_num_planning: 0,
            projects_num: 0
        }));
    }
    data.sections = map(data.groups, ({ id, name, projects_num }, index) => {
        const valuePercent = data.projects_num ? projects_num / data.projects_num * 100 : 0;
        return {
            id,
            text: name,
            value: projects_num,
            valuePercent,
            label: valuePercent > 0 ? `${+valuePercent.toFixed(2)}%` : '',
            svg: { fill: colors[index] },
            key: `segment-${index}`
        };
    });
    console.log('data.sections', data.sections);
    data.value = data.projects_num;
    return { data, fetching: false, fetchingError: null };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case PROJECTS_SHOWCASE_FETCHING:
            return { ...state, fetching: true };
        case PROJECTS_SHOWCASE_FETCHING_SUCCESS:
            return getData(state, payload);
        case PROJECTS_SHOWCASE_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        default:
            return state;
    }
};
