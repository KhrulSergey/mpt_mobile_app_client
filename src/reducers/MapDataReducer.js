import each from 'lodash-es/each';
import keyBy from 'lodash-es/keyBy';
import cloneDeep from 'lodash-es/cloneDeep';
import getYear from 'date-fns/get_year';
import getQuarter from 'date-fns/get_quarter';
import {
    QUARTERS_FETCHING,
    QUARTERS_FETCHING_SUCCESS,
    QUARTERS_FETCHING_FAIL,
    REGIONS_STATIC_FETCHING,
    REGIONS_STATIC_FETCHING_SUCCESS,
    REGIONS_STATIC_FETCHING_FAIL,
    REGIONS_FETCHING,
    REGIONS_FETCHING_SUCCESS,
    REGIONS_FETCHING_FAIL,
    REGIONS_PERIOD_ARCHIVED_UPDATE,
    // REGIONS_ARCHIVED_FETCHING,
    // REGIONS_ARCHIVED_FETCHING_SUCCESS,
    // REGIONS_ARCHIVED_FETCHING_FAIL,
    REGIONS_SELECT
} from '../constants/ActionTypes';
import { store } from '../configureStore';

const date = Date.now();
const currentYear = getYear(date);
const currentQuarter = getQuarter(date);
let year, quarter;
if (currentQuarter === 1) {
    quarter = 4;
    year = currentYear - 1;
} else {
    quarter = currentQuarter - 1;
    year = currentYear;
}

const INITIAL_STATE = {
    data: {},
    dataArchived: null,
    periodArchivedUpdatedAt: null,
    periods: null,
    fetchingQuarters: false,
    fetchingQuartersError: null,
    fetchingStaticData: false,
    fetchingStaticDataError: null,
    fetchingInit: false,
    fetching: false,
    fetchingArchived: false,
    fetchingInitError: null,
    fetchingError: null,
    fetchingArchivedError: null,
    selectedData: {
        regions: [],
        projects_num: 0,
        projects_num_ok: 0,
        projects_num_problem: 0,
        projects_num_planning: 0,
        state_funds: 0,
        production_index: 0,
        companies_num: 0,
        unprofitable_companies_num: 0,
        unprofitable_companies_percent: 0,
        workers_num: 0,
        debt: 0
    },
    periodArchived: {
        quarter,
        year
    }
};

const getDataOnInit = (state, payload) => {
    const periodArchived = { ...INITIAL_STATE.periodArchived };
    if (!payload.response.data.pastPeriod || !payload.response.data.pastPeriod.length) {
        if (periodArchived.quarter === 4) {
            periodArchived.year += 1;
            periodArchived.quarter = 1;
        } else {
            periodArchived.quarter += 1;
        }
    }
    // let periods = payload.response.data.quarters;
    // if (!periods || !periods.length) {
    //     periods = [{ year: periodArchived.year.toString(), quarter: [periodArchived.quarter.toString()] }];
    // }
    if (!payload.response.data.currentPeriod || !payload.response.data.currentPeriod.length) {
        return { ...state, fetchingInit: false, fetchingInitError: null, /*periods, */periodArchived };
    }
    return selectRegions({ ...state, fetchingInit: false, fetchingInitError: null, /*periods, */periodArchived }, payload);
};

const getQuarters = (state, payload) => {
    // const periodArchived = { ...INITIAL_STATE.periodArchived };
    // if (periodArchived.quarter === 4) {
    //     periodArchived.year += 1;
    //     periodArchived.quarter = 1;
    // } else {
    //     periodArchived.quarter += 1;
    // }
    let periods = payload.data;
    if (!periods || !periods.length || periods.length === 1 && periods[0].year === currentYear && periods[0].quarter && periods[0].quarter.length === 1 && periods[0].quarter[0] === currentQuarter) {
        // periods = [{ year: periodArchived.year.toString(), quarter: [periodArchived.quarter.toString()] }];
        periods = null;
    } else {
        periods = periods.map(period => ({
            year: period.year.toString(),
            quarter: period.quarter.map(quarter => quarter.toString())
        }));
    }
    return { ...state, fetchingQuarters: false, fetchingQuartersError: null, periods };
};

const getRegionsStatic = (state, payload) => {
    const data = keyBy(payload.data, 'ref');
    return { ...state, fetchingStaticData: false, fetchingStaticDataError: null, data, dataArchived: data };
};

const getRegions = (state, payload) => {
    const { currentPeriod, pastPeriod } = payload.response.data;
    const data = cloneDeep(state.data);
    const dataArchived = cloneDeep(state.dataArchived);
    if (currentPeriod) {
        each(currentPeriod, region => {
            data[region.ref].own_funds = region.own_funds;
            data[region.ref].production_index = region.production_index;
            data[region.ref].project_num_ok = region.project_num_ok;
            data[region.ref].project_num_planning = region.project_num_planning;
            data[region.ref].project_num_problem = region.project_num_problem;
            data[region.ref].state_funds = region.state_funds;
        });
    }
    if (pastPeriod) {
        each(pastPeriod, region => {
            dataArchived[region.ref].own_funds = region.own_funds;
            dataArchived[region.ref].production_index = region.production_index;
            dataArchived[region.ref].project_num_ok = region.project_num_ok;
            dataArchived[region.ref].project_num_planning = region.project_num_planning;
            dataArchived[region.ref].project_num_problem = region.project_num_problem;
            dataArchived[region.ref].state_funds = region.state_funds;
        });
    }
    return selectRegions({ ...state, data, dataArchived, fetching: false, fetchingError: null }, payload);
};

// const getRegions = (state, payload) => {
//     const periodArchived = { ...INITIAL_STATE.periodArchived };
//     if (!payload.response.data.pastPeriod || !payload.response.data.pastPeriod.length) {
//         if (periodArchived.quarter === 4) {
//             periodArchived.year += 1;
//             periodArchived.quarter = 1;
//         } else {
//             periodArchived.quarter += 1;
//         }
//     }
//     // let periods = payload.response.data.quarters;
//     // if (!periods || !periods.length) {
//     //     periods = [{ year: periodArchived.year.toString(), quarter: [periodArchived.quarter.toString()] }];
//     // }
//     if (!payload.response.data.currentPeriod || !payload.response.data.currentPeriod.length) {
//         return { ...state, fetchingInit: false, fetchingInitError: null, /*periods, */periodArchived };
//     }
//     return selectRegions({ ...state, fetchingInit: false, fetchingInitError: null, /*periods, */periodArchived }, payload);
// };

const selectRegions = (state, payload) => {
    const { selectedRegions: selectedRegionsRaw } = payload;
    const regions = cloneDeep(store.getState().refs.data.regions);
    const regionsRefDict = store.getState().refs.data.regionsRefDict;
    const selectedRegions = selectedRegionsRaw && selectedRegionsRaw.length ? selectedRegionsRaw : regions;
    const newState = { ...state };
    const mergedRegionData = {
        regions: [],
        projects_num: 0,
        projects_num_ok: 0,
        projects_num_problem: 0,
        projects_num_planning: 0,
        state_funds: 0,
        production_index: 0,
        companies_num: 0,
        unprofitable_companies_num: 0,
        unprofitable_companies_percent: 0,
        workers_num: 0,
        debt: 0
    };
    const mergedArchivedRegionData = {
        projects_num: 0,
        projects_num_ok: 0,
        projects_num_problem: 0,
        projects_num_planning: 0,
        state_funds: 0,
        production_index: 0
    };
    if (selectedRegions.length > 1) {
        mergedRegionData.name = 'Несколько регионов';
        mergedRegionData.ref = 'RU';
    } else {
        mergedRegionData.name = selectedRegions[0].name;
        mergedRegionData.ref = selectedRegions[0].ref;
    }
    each(selectedRegions, (selectedRegion) => {
        if (newState.data) {
            const region = newState.data[selectedRegion.ref];
            if (region) {
                const projects_num_ok = region.project_num_ok || 0;
                const projects_num_problem = region.project_num_problem || 0;
                const projects_num_planning = region.project_num_planning || 0;
                mergedRegionData.regions.push(region);
                mergedRegionData.projects_num_ok += projects_num_ok;
                mergedRegionData.projects_num_problem += projects_num_problem;
                mergedRegionData.projects_num_planning += projects_num_planning;
                mergedRegionData.projects_num += projects_num_ok + projects_num_problem + projects_num_planning;
                mergedRegionData.state_funds += region.state_funds;
                mergedRegionData.production_index += region.production_index;
                mergedRegionData.companies_num += region.companies_num;
                mergedRegionData.unprofitable_companies_num += region.unprofitable_companies_num;
                mergedRegionData.workers_num += region.workers_num;
                mergedRegionData.debt += region.debt;
            } else {
                const refRegion = cloneDeep(regionsRefDict[selectedRegion.ref]);
                if (refRegion) mergedRegionData.regions.push(refRegion);
            }
            if (newState.dataArchived) {
                const archivedRegion = newState.dataArchived[selectedRegion.ref];
                if (archivedRegion) {
                    const projects_num_ok = archivedRegion.project_num_ok || 0;
                    const projects_num_problem = archivedRegion.project_num_problem || 0;
                    const projects_num_planning = archivedRegion.project_num_planning || 0;
                    mergedArchivedRegionData.projects_num_ok += projects_num_ok;
                    mergedArchivedRegionData.projects_num_problem += projects_num_problem;
                    mergedArchivedRegionData.projects_num_planning += projects_num_planning;
                    mergedArchivedRegionData.projects_num += projects_num_ok + projects_num_problem + projects_num_planning;
                    mergedArchivedRegionData.state_funds += archivedRegion.state_funds;
                    mergedArchivedRegionData.production_index += archivedRegion.production_index;
                }
            }
        } else {
            const region = cloneDeep(regionsRefDict[selectedRegion.ref]);
            mergedRegionData.regions.push(region);
        }
    });

    if (newState.data) {
        mergedRegionData.production_index /= selectedRegions.length;

        if (newState.dataArchived) {
            mergedArchivedRegionData.production_index /= selectedRegions.length;

            mergedRegionData.projects_num_ok_dynamic = mergedRegionData.projects_num_ok - mergedArchivedRegionData.projects_num_ok;
            mergedRegionData.projects_num_problem_dynamic = mergedRegionData.projects_num_problem - mergedArchivedRegionData.projects_num_problem;
            mergedRegionData.projects_num_planning_dynamic = mergedRegionData.projects_num_planning - mergedArchivedRegionData.projects_num_planning;
            mergedRegionData.projects_num_dynamic = mergedRegionData.projects_num - mergedArchivedRegionData.projects_num;
            mergedRegionData.state_funds_dynamic = mergedRegionData.state_funds - mergedArchivedRegionData.state_funds;
            mergedRegionData.production_index_dynamic_percent = +(mergedRegionData.production_index - mergedArchivedRegionData.production_index).toFixed(2);
            mergedRegionData.projects_num_ok_dynamic_percent = mergedRegionData.projects_num_ok ? +(mergedRegionData.projects_num_ok_dynamic / mergedRegionData.projects_num_ok * 100).toFixed(2) : 0;
            mergedRegionData.projects_num_problem_dynamic_percent = mergedRegionData.projects_num_problem ? +(mergedRegionData.projects_num_problem_dynamic / mergedRegionData.projects_num_problem * 100).toFixed(2) : 0;
            mergedRegionData.projects_num_planning_dynamic_percent = mergedRegionData.projects_num_planning ? +(mergedRegionData.projects_num_planning_dynamic / mergedRegionData.projects_num_planning * 100).toFixed(2) : 0;
            mergedRegionData.projects_num_dynamic_percent = mergedRegionData.projects_num ? +(mergedRegionData.projects_num_dynamic / mergedRegionData.projects_num * 100).toFixed(2) : 0;
            mergedRegionData.state_funds_dynamic_percent = mergedRegionData.state_funds ? +(mergedRegionData.state_funds_dynamic / mergedRegionData.state_funds * 100).toFixed(2) : 0;
            mergedRegionData.state_funds_dynamic = +(mergedRegionData.state_funds_dynamic / 1000000).toFixed(2);
        }

        mergedRegionData.state_funds = +(mergedRegionData.state_funds / 1000000).toFixed(2);
        mergedRegionData.production_index = +mergedRegionData.production_index.toFixed(2);
        mergedRegionData.unprofitable_companies_percent = mergedRegionData.companies_num ? +(mergedRegionData.unprofitable_companies_num / mergedRegionData.companies_num * 100).toFixed(2) : 0;
        mergedRegionData.workers_num = +(mergedRegionData.workers_num / 1000).toFixed(2);
        mergedRegionData.debt = +(mergedRegionData.debt / 1000000).toFixed(2);
    }

    mergedRegionData.updated_at = Date.now();
    newState.selectedData = mergedRegionData;
    return newState;
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        // case REGIONS_INIT_FETCHING:
        //     return { ...state, fetchingInit: true };
        // case REGIONS_INIT_FETCHING_SUCCESS:
        //     return getDataOnInit(state, payload);
        // case REGIONS_INIT_FETCHING_FAIL:
        //     return { ...state, fetchingInit: false, fetchingInitError: payload };
        case QUARTERS_FETCHING:
            return { ...state, fetchingQuarters: true, fetchingQuartersError: null };
        case QUARTERS_FETCHING_SUCCESS:
            return getQuarters(state, payload);
        case QUARTERS_FETCHING_FAIL:
            return { ...state, fetchingQuarters: false, fetchingQuartersError: payload };
        case REGIONS_STATIC_FETCHING:
            return { ...state, fetchingStaticData: true, fetchingStaticDataError: null };
        case REGIONS_STATIC_FETCHING_SUCCESS:
            return getRegionsStatic(state, payload);
        case REGIONS_STATIC_FETCHING_FAIL:
            return { ...state, fetchingStaticData: false, fetchingStaticDataError: payload };
        case REGIONS_FETCHING:
            return { ...state, fetching: true, fetchingError: null };
        case REGIONS_FETCHING_SUCCESS:
            return getRegions(state, payload);
        case REGIONS_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        case REGIONS_PERIOD_ARCHIVED_UPDATE:
            return { ...state, periodArchived: payload, periodArchivedUpdatedAt: Date.now() };
        // case REGIONS_ARCHIVED_FETCHING:
        //     return { ...state, fetchingArchived: true };
        // case REGIONS_ARCHIVED_FETCHING_SUCCESS:
        //     if (payload.response.data.pastPeriod.length === 0) return { ...state, fetchingArchived: false, fetchingArchivedError: null }; // TODO add handler
        //     return selectRegions({ ...state, fetchingArchived: false, fetchingArchivedError: null }, payload); // { response, selectedRegions }
        // case REGIONS_ARCHIVED_FETCHING_FAIL:
        //     return { ...state, fetchingArchived: false, fetchingArchivedError: payload };
        case REGIONS_SELECT:
            return selectRegions(state, payload);
        default:
            return state;
    }
};
