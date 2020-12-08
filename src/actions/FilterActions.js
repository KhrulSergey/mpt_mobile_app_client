import {
    FILTER_MAP_REGION_FILTER,
    FILTER_VOTING_REGION_FILTER,
    FILTER_VOTING_INDUSTRY_FILTER,
    FILTER_MAP_REGION_VISIBILITY_TOGGLE,
    FILTER_VOTING_REGION_VISIBILITY_TOGGLE,
    FILTER_VOTING_INDUSTRY_VISIBILITY_TOGGLE,
    FILTER_MAP_REGION_RESET,
    FILTER_VOTING_REGION_RESET,
    FILTER_VOTING_INDUSTRY_RESET,
    FILTER_MAP_REGION_TOGGLE,
    FILTER_MAP_DISTRICT_TOGGLE,
    FILTER_VOTING_REGION_TOGGLE,
    FILTER_VOTING_DISTRICT_TOGGLE,
    FILTER_VOTING_INDUSTRY_TOGGLE,
    FILTER_MAP_INDUSTRY_FILTER,
    FILTER_MAP_INDUSTRY_VISIBILITY_TOGGLE,
    FILTER_MAP_INDUSTRY_RESET,
    FILTER_MAP_INDUSTRY_TOGGLE,
    FILTER_MAP_PROJECT_GROUP_TOGGLE,
    FILTER_MAP_PROJECT_GROUP_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_INDUSTRY_POPULATE,
    FILTER_PROJECTS_INDUSTRY_SET_DO_NOT_APPLY,
    FILTER_PROJECTS_INDUSTRY_FILTER,
    FILTER_PROJECTS_INDUSTRY_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_INDUSTRY_RESET,
    FILTER_PROJECTS_INDUSTRY_TOGGLE,
    FILTER_PROJECTS_REGION_POPULATE,
    FILTER_PROJECTS_REGION_FILTER,
    FILTER_PROJECTS_REGION_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_REGION_RESET,
    FILTER_PROJECTS_REGION_TOGGLE,
    FILTER_PROJECTS_DISTRICT_TOGGLE,
    FILTER_PROJECTS_STATUS_POPULATE,
    FILTER_PROJECTS_STATUS_FILTER,
    FILTER_PROJECTS_STATUS_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_STATUS_RESET,
    FILTER_PROJECTS_STATUS_TOGGLE,
    VOTING_COMPANIES_FETCHING,
    MEETING_USERS_FETCHING,
    FILTER_VOTING_COMPANY_VISIBILITY_TOGGLE,
    FILTER_VOTING_COMPANY_RESET,
    FILTER_VOTING_COMPANY_TOGGLE,
    FILTER_MEETING_USER_VISIBILITY_TOGGLE,
    FILTER_MEETING_USER_RESET,
    FILTER_MEETING_USER_TOGGLE,
    FILTER_COMPANIES_INDUSTRY_POPULATE,
    FILTER_COMPANIES_INDUSTRY_VISIBILITY_TOGGLE,
    FILTER_COMPANIES_INDUSTRY_TOGGLE,
    FILTER_COMPANIES_INDUSTRY_RESET,
    FILTER_COMPANIES_INDUSTRY_FILTER,
    FILTER_COMPANIES_REGION_POPULATE,
    FILTER_COMPANIES_REGION_VISIBILITY_TOGGLE,
    FILTER_COMPANIES_REGION_TOGGLE,
    FILTER_COMPANIES_DISTRICT_TOGGLE,
    FILTER_COMPANIES_REGION_RESET,
    FILTER_COMPANIES_REGION_FILTER,
    FILTER_PROJECTS_SUMMARIZED_INDUSTRY_POPULATE,
    FILTER_PROJECTS_SUMMARIZED_REGION_POPULATE,
    FILTER_PROJECTS_SUMMARIZED_REGION_FILTER,
    FILTER_PROJECTS_SUMMARIZED_INDUSTRY_FILTER,
    FILTER_PROJECTS_SUMMARIZED_REGION_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_SUMMARIZED_INDUSTRY_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_SUMMARIZED_REGION_RESET,
    FILTER_PROJECTS_SUMMARIZED_INDUSTRY_RESET,
    FILTER_PROJECTS_SUMMARIZED_REGION_TOGGLE,
    FILTER_PROJECTS_SUMMARIZED_DISTRICT_TOGGLE,
    FILTER_PROJECTS_SUMMARIZED_INDUSTRY_TOGGLE,
    FILTER_PROJECTS_SUMMARIZED_PROJECT_GROUP_TOGGLE,
    FILTER_PROJECTS_SUMMARIZED_PROJECT_GROUP_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_SHOWCASE_INDUSTRY_POPULATE,
    FILTER_PROJECTS_SHOWCASE_REGION_POPULATE,
    FILTER_PROJECTS_SHOWCASE_INDUSTRY_FILTER,
    FILTER_PROJECTS_SHOWCASE_REGION_FILTER,
    FILTER_PROJECTS_SHOWCASE_INDUSTRY_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_SHOWCASE_REGION_VISIBILITY_TOGGLE,
    FILTER_PROJECTS_SHOWCASE_INDUSTRY_RESET,
    FILTER_PROJECTS_SHOWCASE_REGION_RESET,
    FILTER_PROJECTS_SHOWCASE_INDUSTRY_TOGGLE,
    FILTER_PROJECTS_SHOWCASE_REGION_TOGGLE,
    FILTER_PROJECTS_SHOWCASE_DISTRICT_TOGGLE,
    FILTER_PROJECTS_PROJECT_GROUP_TOGGLE,
    FILTER_PROJECTS_PROJECT_GROUP_VISIBILITY_TOGGLE,
    FILTER_MAP_INDUSTRY_POPULATE,
    FILTER_MAP_REGION_POPULATE,
    FILTER_MAP_PROJECT_GROUP_POPULATE
} from '../constants/ActionTypes';

export const populateFilter = ({ filterType, data }) => {
    let type;
    switch (filterType) {
        case 'projects-summarized-industry':
            type = FILTER_PROJECTS_SUMMARIZED_INDUSTRY_POPULATE;
            break;
        case 'projects-summarized-region':
            type = FILTER_PROJECTS_SUMMARIZED_REGION_POPULATE;
            break;
        case 'projects-showcase-industry':
            type = FILTER_PROJECTS_SHOWCASE_INDUSTRY_POPULATE;
            break;
        case 'projects-showcase-region':
            type = FILTER_PROJECTS_SHOWCASE_REGION_POPULATE;
            break;
        case 'projects-industry':
            type = FILTER_PROJECTS_INDUSTRY_POPULATE;
            break;
        case 'projects-region':
            type = FILTER_PROJECTS_REGION_POPULATE;
            break;
        case 'projects-status':
            type = FILTER_PROJECTS_STATUS_POPULATE;
            break;
        case 'map-industry':
            type = FILTER_MAP_INDUSTRY_POPULATE;
            break;
        case 'map-region':
            type = FILTER_MAP_REGION_POPULATE;
            break;
        case 'map-project-group':
            type = FILTER_MAP_PROJECT_GROUP_POPULATE;
            break;
        case 'companies-industry':
            type = FILTER_COMPANIES_INDUSTRY_POPULATE;
            break;
        case 'companies-region':
            type = FILTER_COMPANIES_REGION_POPULATE;
            break;
    }
    return {
        type,
        payload: data
    };
};

export const setDoNotApply = ({ filterType, value }) => {
    let type;
    switch (filterType) {
        case 'projects-industry':
            type = FILTER_PROJECTS_INDUSTRY_SET_DO_NOT_APPLY;
            break;
    }
    return {
        type,
        payload: value
    };
};

export const applyTextFilter = ({ filterType, textFilter }) => {
    let type;
    switch (filterType) {
        // case 'map-region':
        //     type = FILTER_MAP_REGION_FILTER;
        //     break;
        // case 'map-industry':
        //     type = FILTER_MAP_INDUSTRY_FILTER;
        //     break;
        // case 'projects-summarized-region':
        //     type = FILTER_PROJECTS_SUMMARIZED_REGION_FILTER;
        //     break;
        // case 'projects-summarized-industry':
        //     type = FILTER_PROJECTS_SUMMARIZED_INDUSTRY_FILTER;
        //     break;
        // case 'projects-showcase-region':
        //     type = FILTER_PROJECTS_SHOWCASE_REGION_FILTER;
        //     break;
        // case 'projects-showcase-industry':
        //     type = FILTER_PROJECTS_SHOWCASE_INDUSTRY_FILTER;
        //     break;
        // case 'projects-region':
        //     type = FILTER_PROJECTS_REGION_FILTER;
        //     break;
        // case 'projects-industry':
        //     type = FILTER_PROJECTS_INDUSTRY_FILTER;
        //     break;
        // case 'projects-status':
        //     type = FILTER_PROJECTS_STATUS_FILTER;
        //     break;
        // case 'companies-region':
        //     type = FILTER_COMPANIES_REGION_FILTER;
        //     break;
        // case 'companies-industry':
        //     type = FILTER_COMPANIES_INDUSTRY_FILTER;
        //     break;
        // case 'voting-region':
        //     type = FILTER_VOTING_REGION_FILTER;
        //     break;
        // case 'voting-industry':
        //     type = FILTER_VOTING_INDUSTRY_FILTER;
        //     break;
        case 'voting-company':
            type = VOTING_COMPANIES_FETCHING;
            break;
        case 'meeting-user':
            type = MEETING_USERS_FETCHING;
            break;
    }
    return {
        type,
        payload: type === VOTING_COMPANIES_FETCHING || type === MEETING_USERS_FETCHING ? { pattern: textFilter } : textFilter
    };
};

export const toggleModalVisibility = (filterType, payload) => {
    let type;
    switch (filterType) {
        case 'map-region':
            type = FILTER_MAP_REGION_VISIBILITY_TOGGLE;
            break;
        case 'map-industry':
            type = FILTER_MAP_INDUSTRY_VISIBILITY_TOGGLE;
            break;
        case 'map-project-group':
            type = FILTER_MAP_PROJECT_GROUP_VISIBILITY_TOGGLE;
            break;
        // case 'projects-summarized-region':
        //     type = FILTER_PROJECTS_SUMMARIZED_REGION_VISIBILITY_TOGGLE;
        //     break;
        // case 'projects-summarized-industry':
        //     type = FILTER_PROJECTS_SUMMARIZED_INDUSTRY_VISIBILITY_TOGGLE;
        //     break;
        // case 'projects-summarized-project-group':
        //     type = FILTER_PROJECTS_SUMMARIZED_PROJECT_GROUP_VISIBILITY_TOGGLE;
        //     break;
        // case 'projects-showcase-region':
        //     type = FILTER_PROJECTS_SHOWCASE_REGION_VISIBILITY_TOGGLE;
        //     break;
        // case 'projects-showcase-industry':
        //     type = FILTER_PROJECTS_SHOWCASE_INDUSTRY_VISIBILITY_TOGGLE;
        //     break;
        case 'projects-region':
            type = FILTER_PROJECTS_REGION_VISIBILITY_TOGGLE;
            break;
        case 'projects-industry':
            type = FILTER_PROJECTS_INDUSTRY_VISIBILITY_TOGGLE;
            break;
        case 'projects-status':
            type = FILTER_PROJECTS_STATUS_VISIBILITY_TOGGLE;
            break;
        case 'projects-project-group':
            type = FILTER_PROJECTS_PROJECT_GROUP_VISIBILITY_TOGGLE;
            break;
        case 'companies-region':
            type = FILTER_COMPANIES_REGION_VISIBILITY_TOGGLE;
            break;
        case 'companies-industry':
            type = FILTER_COMPANIES_INDUSTRY_VISIBILITY_TOGGLE;
            break;
        case 'voting-region':
            type = FILTER_VOTING_REGION_VISIBILITY_TOGGLE;
            break;
        case 'voting-industry':
            type = FILTER_VOTING_INDUSTRY_VISIBILITY_TOGGLE;
            break;
        case 'voting-company':
            type = FILTER_VOTING_COMPANY_VISIBILITY_TOGGLE;
            break;
        case 'meeting-user':
            type = FILTER_MEETING_USER_VISIBILITY_TOGGLE;
            break;
    }
    return {
        type,
        payload
    };
};

export const resetFilter = (filterType) => {
    let type;
    switch (filterType) {
        // case 'map-region':
        //     type = FILTER_MAP_REGION_RESET;
        //     break;
        // case 'map-industry':
        //     type = FILTER_MAP_INDUSTRY_RESET;
        //     break;
        // case 'projects-summarized-region':
        //     type = FILTER_PROJECTS_SUMMARIZED_REGION_RESET;
        //     break;
        // case 'projects-summarized-industry':
        //     type = FILTER_PROJECTS_SUMMARIZED_INDUSTRY_RESET;
        //     break;
        // case 'projects-showcase-region':
        //     type = FILTER_PROJECTS_SHOWCASE_REGION_RESET;
        //     break;
        // case 'projects-showcase-industry':
        //     type = FILTER_PROJECTS_SHOWCASE_INDUSTRY_RESET;
        //     break;
        // case 'projects-region':
        //     type = FILTER_PROJECTS_REGION_RESET;
        //     break;
        // case 'projects-industry':
        //     type = FILTER_PROJECTS_INDUSTRY_RESET;
        //     break;
        // case 'projects-status':
        //     type = FILTER_PROJECTS_STATUS_RESET;
        //     break;
        // case 'companies-region':
        //     type = FILTER_COMPANIES_REGION_RESET;
        //     break;
        // case 'companies-industry':
        //     type = FILTER_COMPANIES_INDUSTRY_RESET;
        //     break;
        case 'voting-region':
            type = FILTER_VOTING_REGION_RESET;
            break;
        case 'voting-industry':
            type = FILTER_VOTING_INDUSTRY_RESET;
            break;
        case 'voting-company':
            type = FILTER_VOTING_COMPANY_RESET;
            break;
        case 'meeting-user':
            type = FILTER_MEETING_USER_RESET;
            break;
    }
    return {
        type
    };
};

export const toggleSelect = ({ filterType, selectedItem }) => {
    let type;
    switch (filterType) {
        // case 'map-region':
        //     type = FILTER_MAP_REGION_TOGGLE;
        //     break;
        // case 'map-district':
        //     type = FILTER_MAP_DISTRICT_TOGGLE;
        //     break;
        // case 'map-industry':
        //     type = FILTER_MAP_INDUSTRY_TOGGLE;
        //     break;
        // case 'map-project-group':
        //     type = FILTER_MAP_PROJECT_GROUP_TOGGLE;
        //     break;
        // case 'projects-summarized-region':
        //     type = FILTER_PROJECTS_SUMMARIZED_REGION_TOGGLE;
        //     break;
        // case 'projects-summarized-district':
        //     type = FILTER_PROJECTS_SUMMARIZED_DISTRICT_TOGGLE;
        //     break;
        // case 'projects-summarized-industry':
        //     type = FILTER_PROJECTS_SUMMARIZED_INDUSTRY_TOGGLE;
        //     break;
        case 'projects-summarized-project-group':
            type = FILTER_PROJECTS_SUMMARIZED_PROJECT_GROUP_TOGGLE;
            break;
        // case 'projects-showcase-region':
        //     type = FILTER_PROJECTS_SHOWCASE_REGION_TOGGLE;
        //     break;
        // case 'projects-showcase-district':
        //     type = FILTER_PROJECTS_SHOWCASE_DISTRICT_TOGGLE;
        //     break;
        // case 'projects-showcase-industry':
        //     type = FILTER_PROJECTS_SHOWCASE_INDUSTRY_TOGGLE;
        //     break;
        // case 'projects-region':
        //     type = FILTER_PROJECTS_REGION_TOGGLE;
        //     break;
        // case 'projects-district':
        //     type = FILTER_PROJECTS_DISTRICT_TOGGLE;
        //     break;
        // case 'projects-industry':
        //     type = FILTER_PROJECTS_INDUSTRY_TOGGLE;
        //     break;
        // case 'projects-status':
        //     type = FILTER_PROJECTS_STATUS_TOGGLE;
        //     break;
        case 'projects-project-group':
            type = FILTER_PROJECTS_PROJECT_GROUP_TOGGLE;
            break;
        // case 'companies-region':
        //     type = FILTER_COMPANIES_REGION_TOGGLE;
        //     break;
        // case 'companies-district':
        //     type = FILTER_COMPANIES_DISTRICT_TOGGLE;
        //     break;
        // case 'companies-industry':
        //     type = FILTER_COMPANIES_INDUSTRY_TOGGLE;
        //     break;
        case 'voting-region':
            type = FILTER_VOTING_REGION_TOGGLE;
            break;
        // case 'voting-district':
        //     type = FILTER_VOTING_DISTRICT_TOGGLE;
        //     break;
        case 'voting-industry':
            type = FILTER_VOTING_INDUSTRY_TOGGLE;
            break;
        case 'voting-company':
            type = FILTER_VOTING_COMPANY_TOGGLE;
            break;
        // case 'meeting-user':
        //     type = FILTER_MEETING_USER_TOGGLE;
        //     break;
    }
    return {
        type,
        payload: selectedItem
    };
};
