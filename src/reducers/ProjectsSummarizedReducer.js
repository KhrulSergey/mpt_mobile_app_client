import map from 'lodash-es/map';
import each from 'lodash-es/each';
import sortBy from 'lodash-es/sortBy';
import values from 'lodash-es/values';
import cloneDeep from 'lodash-es/cloneDeep';
import { colors } from './ChartColors';
import { store } from '../configureStore';
import {
    PROJECTS_SUMMARIZED_FETCHING,
    PROJECTS_SUMMARIZED_FETCHING_SUCCESS,
    PROJECTS_SUMMARIZED_FETCHING_FAIL
} from '../constants/ActionTypes';
import { placeSpecificItemAtTheBeginning } from '../constants/util';

const INITIAL_STATE = {
    data: {
        sections: []
    },
    fetching: false,
    fetchingError: null
};

const getData = (state, payload) => {
    const { data } = payload.response;
    const { project_group_id, industry_id } = payload.params;
    const { industriesDict, projectGroupsDict } = store.getState().refs.data;
    const projectGroupCodeIsImport = projectGroupsDict[project_group_id] && projectGroupsDict[project_group_id].code === 'import';
    data.projectGroupCodeIsImport = !!projectGroupCodeIsImport;
    data.value = data.projects_num;
    if (projectGroupCodeIsImport) data.import_fact_avg = 0;
    data.sections = [];
    const props = ['projects_num_ok', 'projects_num_warning', 'projects_num_danger', 'projects_num_planning'];
    const texts = ['Реализуется по графику', 'Столкнулись с проблемами при реализации', 'Реализация приостановлена', 'Планируется к реализации'];
    each(props, (prop, index) => {
        let _section = {
            text: texts[index],
            value: data[prop] || 0,
            svg: { fill: colors[index] },
            key: `segment-${index}`
        };
        _section.valuePercent = data.projects_num ? _section.value / data.projects_num * 100 : 0;
        _section.label = _section.valuePercent > 0 ? `${+_section.valuePercent.toFixed(2)}%` : '';
        data.sections.push(_section);
    });
    let industriesData = {};
    if (!industry_id) { // Выбраны все отрасли
        industriesData = cloneDeep(industriesDict);
        each(industriesData, industryData => {
            industryData.projects_num_danger = 0;
            industryData.projects_num_ok = 0;
            industryData.projects_num_warning = 0;
            industryData.projects_num_planning = 0;
        });
    } else {
        const industryIds = map(industry_id.split(','), id => +id);
        each(industryIds, id => industriesData[id] = {
            ...cloneDeep(industriesDict[id]),
            projects_num_danger: 0,
            projects_num_ok: 0,
            projects_num_warning: 0,
            projects_num_planning: 0
        });
    }
    each(data.industries, (industryData) => {
        // industryData.industry = find(industries, { id: industryData.industry_id });
        if (projectGroupCodeIsImport) {
            data.import_fact_avg += +industryData.import_fact;
            industryData.import_fact = +(+industryData.import_fact).toFixed(2);
            industryData.import_plan = +(+industryData.import_plan).toFixed(2);
        }
        industriesData[industryData.industry_id] = { ...industriesData[industryData.industry_id], ...industryData };
    });
    if (projectGroupCodeIsImport) {
        if (data.industries.length > 0) data.import_fact_avg /= data.industries.length;
        data.legendLabel = `Средняя доля импорта (ЦМАКП): ${data.import_fact_avg.toFixed(2)}%`;
    }
    data.industries = placeSpecificItemAtTheBeginning(sortBy(values(industriesData), 'name'), 'gisp_id', 0);
    return { data, fetching: false, fetchingError: null };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case PROJECTS_SUMMARIZED_FETCHING:
            return { ...state, fetching: true };
        case PROJECTS_SUMMARIZED_FETCHING_SUCCESS:
            return getData(state, payload);
        case PROJECTS_SUMMARIZED_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        default:
            return state;
    }
};
