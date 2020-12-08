import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import DeviceReducer from './DeviceReducer';
import UrlsReducer from './UrlsReducer';
import RefsReducer from './RefsReducer';
import MapDataReducer from './MapDataReducer';
import MapRegionFilterReducer from './MapRegionFilterReducer';
import MapIndustryFilterReducer from './MapIndustryFilterReducer';
import VotingRegionFilterReducer from './VotingRegionFilterReducer';
import VotingIndustryFilterReducer from './VotingIndustryFilterReducer';
import VotingCompanyFilterReducer from './VotingCompanyFilterReducer';
import ProjectsShowcaseReducer from './ProjectsShowcaseReducer';
import ProjectsSummarizedReducer from './ProjectsSummarizedReducer';
import ProjectsSummarizedIndustryFilterReducer from './ProjectsSummarizedIndustryFilterReducer';
import ProjectsSummarizedRegionFilterReducer from './ProjectsSummarizedRegionFilterReducer';
import RegionReducer from './RegionReducer';
import ProjectsReducer from './ProjectsReducer';
import ProjectsIndustryFilterReducer from './ProjectsIndustryFilterReducer';
import ProjectsRegionFilterReducer from './ProjectsRegionFilterReducer';
import ProjectReducer from './ProjectReducer';
import CompaniesReducer from './CompaniesReducer';
import CompaniesIndustryFilterReducer from './CompaniesIndustryFilterReducer';
import CompaniesRegionFilterReducer from './CompaniesRegionFilterReducer';
import CompanyReducer from './CompanyReducer';
import VotingsReducer from './VotingsReducer';
import VotingReducer from './VotingReducer';
import NewVotingReducer from './NewVotingReducer';
import MeetingsReducer from './MeetingsReducer';
import MeetingReducer from './MeetingReducer';
import MeetingUserFilterReducer from './MeetingUserFilterReducer';
import NewMeetingReducer from './NewMeetingReducer';
import MapProjectGroupFilterReducer from './MapProjectGroupFilterReducer';
import ProjectsSummarizedProjectGroupFilterReducer from './ProjectsSummarizedProjectGroupFilterReducer';
import ProjectsShowcaseIndustryFilterReducer from './ProjectsShowcaseIndustryFilterReducer';
import ProjectsShowcaseRegionFilterReducer from './ProjectsShowcaseRegionFilterReducer';
import ProjectsProjectGroupFilterReducer from './ProjectsProjectGroupFilterReducer';
import ProjectsStatusFilterReducer from './ProjectsStatusFilterReducer';

export default combineReducers({
    auth: AuthReducer,
    device: DeviceReducer,
    urls: UrlsReducer,
    refs: RefsReducer,
    mapData: MapDataReducer,
    mapRegionFilter: MapRegionFilterReducer,
    mapIndustryFilter: MapIndustryFilterReducer,
    mapProjectGroupFilter: MapProjectGroupFilterReducer,
    votingRegionFilter: VotingRegionFilterReducer,
    votingIndustryFilter: VotingIndustryFilterReducer,
    votingCompanyFilter: VotingCompanyFilterReducer,
    projectsShowcase: ProjectsShowcaseReducer,
    // projectsShowcaseIndustryFilter: ProjectsShowcaseIndustryFilterReducer,
    // projectsShowcaseRegionFilter: ProjectsShowcaseRegionFilterReducer,
    projectsSummarized: ProjectsSummarizedReducer,
    // projectsSummarizedIndustryFilter: ProjectsSummarizedIndustryFilterReducer,
    // projectsSummarizedRegionFilter: ProjectsSummarizedRegionFilterReducer,
    // projectsSummarizedProjectGroupFilter: ProjectsSummarizedProjectGroupFilterReducer,
    region: RegionReducer,
    projects: ProjectsReducer,
    projectsProjectGroupFilter: ProjectsProjectGroupFilterReducer,
    projectsIndustryFilter: ProjectsIndustryFilterReducer,
    projectsRegionFilter: ProjectsRegionFilterReducer,
    projectsStatusFilter: ProjectsStatusFilterReducer,
    project: ProjectReducer,
    companies: CompaniesReducer,
    companiesIndustryFilter: CompaniesIndustryFilterReducer,
    companiesRegionFilter: CompaniesRegionFilterReducer,
    company: CompanyReducer,
    votings: VotingsReducer,
    voting: VotingReducer,
    newVoting: NewVotingReducer,
    meetings: MeetingsReducer,
    meeting: MeetingReducer,
    meetingUserFilter: MeetingUserFilterReducer,
    newMeeting: NewMeetingReducer
});
