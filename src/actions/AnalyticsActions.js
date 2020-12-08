import map from 'lodash-es/map';
import { store } from '../configureStore';
import {
    PROJECTS_SHOWCASE_FETCHING,
    PROJECTS_SHOWCASE_FETCHING_SUCCESS,
    PROJECTS_SHOWCASE_FETCHING_FAIL,
    PROJECTS_COUNT_FETCHING,
    PROJECTS_COUNT_FETCHING_SUCCESS,
    PROJECTS_COUNT_FETCHING_FAIL,
    PROJECTS_SUMMARIZED_FETCHING,
    PROJECTS_SUMMARIZED_FETCHING_SUCCESS,
    PROJECTS_SUMMARIZED_FETCHING_FAIL,
    QUARTERS_FETCHING,
    QUARTERS_FETCHING_SUCCESS,
    QUARTERS_FETCHING_FAIL,
    REGIONS_FETCHING,
    REGIONS_FETCHING_SUCCESS,
    REGIONS_FETCHING_FAIL,
    REGIONS_STATIC_FETCHING,
    REGIONS_STATIC_FETCHING_SUCCESS,
    REGIONS_STATIC_FETCHING_FAIL,
    REGIONS_PERIOD_ARCHIVED_UPDATE,
    // REGIONS_ARCHIVED_FETCHING,
    // REGIONS_ARCHIVED_FETCHING_SUCCESS,
    // REGIONS_ARCHIVED_FETCHING_FAIL,
    REGIONS_SELECT,
    REGION_SELECTED,
    PROJECTS_FETCHING,
    PROJECTS_FETCHING_SUCCESS,
    PROJECTS_FETCHING_FAIL,
    PROJECT_FETCHING,
    PROJECT_FETCHING_SUCCESS,
    PROJECT_FETCHING_FAIL,
    COMPANIES_FETCHING,
    COMPANIES_FETCHING_SUCCESS,
    COMPANIES_FETCHING_FAIL,
    COMPANY_FETCHING,
    COMPANY_FETCHING_SUCCESS,
    COMPANY_FETCHING_FAIL
} from '../constants/ActionTypes';

export const fetchQuarters = (params) => {
    const repeated = params ? params.repeated : false;
    return {
        type: QUARTERS_FETCHING,
        payload: { repeated }
    };
};

export const fetchQuartersSuccess = (response) => {
    return {
        type: QUARTERS_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchQuartersFail = (error) => {
    return {
        type: QUARTERS_FETCHING_FAIL,
        payload: error
    };
};

export const fetchRegionsStaticData = (params) => {
    const repeated = params ? params.repeated : false;
    return {
        type: REGIONS_STATIC_FETCHING,
        payload: { repeated }
    };
};

export const fetchRegionsStaticDataSuccess = (response) => {
    return {
        type: REGIONS_STATIC_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchRegionsStaticDataFail = (error) => {
    return {
        type: REGIONS_STATIC_FETCHING_FAIL,
        payload: error
    };
};

export const fetchRegionsDynamicData = (params) => {
    const { quarter, year, selectedRegions, projectGroup, repeated } = params;
    let { industry_id } = params;
    if (!industry_id) {
        const industriesArray = map(params.industries, o => o.id);
        industry_id = industriesArray.join();
    }
    return {
        type: REGIONS_FETCHING,
        payload: { quarter, year, industry_id, selectedRegions, project_group_id: projectGroup && projectGroup.id, repeated }
    };
};

export const updatePeriodArchived = (params) => { // { quarter, year }
    return {
        type: REGIONS_PERIOD_ARCHIVED_UPDATE,
        payload: params
    };
};

export const fetchRegionsDynamicDataSuccess = (response) => {
    return {
        type: REGIONS_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchRegionsDynamicDataFail = (error) => {
    return {
        type: REGIONS_FETCHING_FAIL,
        payload: error
    };
};

// export const fetchArchivedRegions = (params) => { // { quarter, year, industries }
//     const { quarter, year, selectedRegions, repeated } = params;
//     const industriesArray = map(params.industries, o => o.id);
//     const industries = industriesArray.join();
//     return {
//         type: REGIONS_ARCHIVED_FETCHING,
//         payload: { quarter, year, industries, selectedRegions, repeated }
//     };
// };
//
// export const fetchArchivedRegionsSuccess = (response) => {
//     return {
//         type: REGIONS_ARCHIVED_FETCHING_SUCCESS,
//         payload: response
//     };
// };
//
// export const fetchArchivedRegionsFail = (error) => {
//     return {
//         type: REGIONS_ARCHIVED_FETCHING_FAIL,
//         payload: error
//     };
// };

export const selectRegions = ({ selectedRegions }) => {
    return {
        type: REGIONS_SELECT,
        payload: { selectedRegions, regions: store.getState().refs.data.regions }
    };
};

export const selectRegion = (region) => {
    return {
        type: REGION_SELECTED,
        payload: region
    };
};

export const fetchProjectsShowcase = (params) => {
  let { industry_id, region_code, repeated } = params;
  if (!industry_id) {
    const industriesArray = map(params.industries, o => o.id);
    industry_id = industriesArray.join();
  }
  if (!region_code) {
    const regionsArray = map(params.regions, o => o.region_code || o.code);
    region_code = regionsArray.join();
  }
  return {
    type: PROJECTS_SHOWCASE_FETCHING,
    payload: { industry_id, region_code, repeated }
  };
};

export const fetchProjectsShowcaseSuccess = (response) => {
    return {
        type: PROJECTS_SHOWCASE_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchProjectsShowcaseFail = (error) => {
    return {
        type: PROJECTS_SHOWCASE_FETCHING_FAIL,
        payload: error
    };
};

export const fetchProjectsCount = (params) => {
    let { region_code, repeated } = params;
    return {
        type: PROJECTS_COUNT_FETCHING,
        payload: { region_code, repeated }
    };
};

export const fetchProjectsCountSuccess = (response) => {
    return {
        type: PROJECTS_COUNT_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchProjectsCountFail = (error) => {
    return {
        type: PROJECTS_COUNT_FETCHING_FAIL,
        payload: error
    };
};

export const fetchProjectsSummarized = (params) => {
    let { industry_id, region_code, projectGroup, repeated } = params;
    if (!industry_id) {
        const industriesArray = map(params.industries, o => o.id);
        industry_id = industriesArray.join();
    }
    if (!region_code) {
        const regionsArray = map(params.regions, o => o.region_code || o.code);
        region_code = regionsArray.join();
    }
    return {
        type: PROJECTS_SUMMARIZED_FETCHING,
        payload: { industry_id, region_code, project_group_id: projectGroup && projectGroup.id, repeated }
    };
};

export const fetchProjectsSummarizedSuccess = (response) => {
    return {
        type: PROJECTS_SUMMARIZED_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchProjectsSummarizedFail = (error) => {
    return {
        type: PROJECTS_SUMMARIZED_FETCHING_FAIL,
        payload: error
    };
};

export const fetchProjects = (params) => {
    let { page, company_id, industry_id, status_id, region_code, sort, sort_direction, projectGroup, repeated } = params;
    if (!industry_id) {
        const industriesArray = map(params.industries, o => o.id);
        industry_id = industriesArray.join();
    }
    if (!region_code) {
        const regionsArray = map(params.regions, o => o.region_code || o.code);
        region_code = regionsArray.join();
    }
    if (!status_id) {
        const statusesArray = map(params.statuses, o => o.id);
        status_id = statusesArray.join();
    }
    return {
        type: PROJECTS_FETCHING,
        payload: { page, industry_id, region_code, company_id, status_id, sort, sort_direction, project_group_id: projectGroup && projectGroup.id, repeated }
    };
};

export const fetchProjectsSuccess = (response) => { // { response, projectStatuses }
    return {
        type: PROJECTS_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchProjectsFail = (error) => {
    return {
        type: PROJECTS_FETCHING_FAIL,
        payload: error
    };
};

export const fetchProject = (project) => { // { id }
    return {
        type: PROJECT_FETCHING,
        payload: project
    };
};

export const fetchProjectSuccess = (response) => {
    return {
        type: PROJECT_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchProjectFail = (error) => {
    return {
        type: PROJECT_FETCHING_FAIL,
        payload: error
    };
};

export const fetchCompanies = (params) => {
    let { page, industry_id, region_code, repeated } = params;
    if (!industry_id) {
        const industriesArray = map(params.industries, o => o.id);
        industry_id = industriesArray.join();
    }
    if (!region_code) {
        const regionsArray = map(params.regions, o => o.region_code || o.code);
        region_code = regionsArray.join();
    }
    return {
        type: COMPANIES_FETCHING,
        payload: { page, industry_id, region_code, repeated }
    };
};

export const fetchCompaniesSuccess = (response) => { // { response, projectStatuses }
    return {
        type: COMPANIES_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchCompaniesFail = (error) => {
    return {
        type: COMPANIES_FETCHING_FAIL,
        payload: error
    };
};

export const fetchCompany = (company) => { // { id }
    return {
        type: COMPANY_FETCHING,
        payload: company
    };
};

export const fetchCompanySuccess = (response) => {
    return {
        type: COMPANY_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchCompanyFail = (error) => {
    return {
        type: COMPANY_FETCHING_FAIL,
        payload: error
    };
};
