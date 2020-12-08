import axios from 'axios';
import { store } from '../configureStore';

function getApiUrl() {
    return store.getState().urls.apiUrl;
}

function getHeaders() {
    const state = store.getState();
    const token = state && state.auth && state.auth.token;
    console.log('selected token', token);
    return { headers: { 'Authorization': token } };
}

const postUserData = (deviceInfo) => axios.post(`${getApiUrl()}/client/init`, deviceInfo);

const getToken = (uid) => axios.get(`${getApiUrl()}/client/start?uid=${uid}`);

const getCounters = () => axios.get(`${getApiUrl()}/user/counters`, getHeaders());

const getRefs = () => axios.get(`${getApiUrl()}/references`, getHeaders());

// map: get available quarters
const getQuarters = () => axios.get(`${getApiUrl()}/quarters`, getHeaders());

// map: get regions static data
const getRegionsStaticData = () => axios.get(`${getApiUrl()}/region-analytics-static`, getHeaders());

// map: get regions dynamic data
const getRegionsDynamicData = (params) => {
    let qs = '';
    if (params) {
        const { quarter, year, industry_id, project_group_id, past } = params;
        if (quarter && year) qs += `quarter=${quarter}&year=${year}&`;
        if (industry_id) qs += `industry_id=${industry_id}&`;
        if (project_group_id) qs += `project_group_id=${project_group_id}&`;
        if (past) qs += `past=${past}`;
    }
    return axios.get(`${getApiUrl()}/region-analytics-dynamic?${qs}`, getHeaders());
};

// get projects group data
const getProjectsShowcase = (params) => {
  let qs = '';
  if (params) {
    const { industry_id, region_code } = params;
    if (industry_id) {
      qs += `industry_id=${industry_id}&`;
    }
    if (region_code) {
      qs += `region_code=${region_code}&`;
    }
  }
  return axios.get(`${getApiUrl()}/project-group-analytics?${qs}`, getHeaders());
};

// get projects data
const getProjectsSummarized = (params) => {
    let qs = '';
    if (params) {
        const { industry_id, region_code, project_group_id } = params;
        if (industry_id) {
            qs += `industry_id=${industry_id}&`;
        }
        if (region_code) {
            qs += `region_code=${region_code}&`;
        }
        if (project_group_id) {
            qs += `project_group_id=${project_group_id}&`;
        }
    }
    return axios.get(`${getApiUrl()}/project-analytics?${qs}`, getHeaders());
};

// get projects data
const getProjects = (params) => {
    let qs = '';
    if (params) {
        const { page, industry_id, region_code, company_id, status_id, sort, sort_direction, project_group_id } = params;
        if (page) {
            qs += `page=${page}&`;
        }
        if (industry_id) {
            qs += `industry_id=${industry_id}&`;
        }
        if (region_code) {
            qs += `region_code=${region_code}&`;
        }
        if (company_id) {
            qs += `company_id=${company_id}&`;
        }
        if (status_id) {
            qs += `status_id=${status_id}&`;
        }
        if (sort && sort_direction) {
            qs += `sort=${sort}&sort_direction=${sort_direction}&`;
        }
        if (project_group_id) {
            qs += `project_group_id=${project_group_id}&`;
        }
    }
    return axios.get(`${getApiUrl()}/project?${qs}`, getHeaders());
};

// get project data
const getProject = (id) => {
    return axios.get(`${getApiUrl()}/project/${id}`, getHeaders());
};

// get companies data
const getCompanies = (params) => {
    let qs = '';
    if (params) {
        const { page, region_code, industry_id } = params;
        if (page) {
            qs += `page=${page}&`;
        }
        if (region_code) {
            qs += `region_code=${region_code}&`;
        }
        if (industry_id) {
            qs += `industry_id=${industry_id}&`;
        }
    }
    return axios.get(`${getApiUrl()}/company?${qs}`, getHeaders());
};

// get company data
const getCompany = (id) => {
    return axios.get(`${getApiUrl()}/company/${id}`, getHeaders());
};

// companies search
const getCompaniesByName = (pattern) => axios.get(`${getApiUrl()}/company/search?q=${pattern}`, getHeaders());

const getVotings = (params) => {
    if (params) {
        const { page, period } = params;
        let param = '';
        if (period) {
            param = `period=${period}`;
        }
        return axios.get(`${getApiUrl()}/vote?page=${page}&${param}`, getHeaders());
    }
    return axios.get(`${getApiUrl()}/vote/all`, getHeaders());
};

const getVoting = (id) => axios.get(`${getApiUrl()}/vote/${id}`, getHeaders());

const postVoting = (data) => {
    const { headers } = getHeaders();
    headers['Content-Type'] = 'application/json';
    console.log('{ headers, data }', { headers, data });
    return axios.post(`${getApiUrl()}/vote`, data, { headers });
};

const updateVoting = ({ id, data }) => axios.put(`${getApiUrl()}/vote/${id}`, data, getHeaders()); // { name, description, date_from, date_to, filters: { regions: [], industries: [], companies: [] } }

// manager action
const voteQuestion = ({ voting, question, data }) => axios.post(`${getApiUrl()}/vote/${voting.data.id}/question/${question.id}/vote`, data, getHeaders()); // { answers: [] / text }

// not implemented
const deleteVoting = (id) => axios.delete(`${getApiUrl()}/vote/${id}`, getHeaders());

const getMeetings = (params) => axios.get(`${getApiUrl()}/meeting?page=${params.page}`, getHeaders());

// not implemented
const getMeeting = (id) => axios.get(`${getApiUrl()}/meeting/${id}`, getHeaders());

const postMeeting = (data) => axios.post(`${getApiUrl()}/meeting`, data, getHeaders());

const updateMeeting = ({ id, data }) => axios.put(`${getApiUrl()}/meeting/${id}`, data, getHeaders());

// not implemented
const deleteMeeting = (id) => axios.delete(`${getApiUrl()}/meeting/${id}`, getHeaders());

const getUsers = (pattern) => axios.get(`${getApiUrl()}/user/search?q=${pattern}`, getHeaders());

export {
    postUserData,
    getToken,
    getCounters,
    getRefs,
    getQuarters,
    getRegionsStaticData,
    getRegionsDynamicData,
    getProjectsShowcase,
    getProjectsSummarized,
    getProjects,
    getProject,
    getCompanies,
    getCompany,
    getCompaniesByName,
    getVotings,
    getVoting,
    postVoting,
    updateVoting,
    deleteVoting,
    voteQuestion,
    getMeetings,
    getMeeting,
    postMeeting,
    updateMeeting,
    deleteMeeting,
    getUsers
};
