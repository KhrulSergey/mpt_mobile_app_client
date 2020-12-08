import { Platform } from 'react-native';
import { all, put, takeEvery } from 'redux-saga/effects'
import { Toast } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import { store } from './';
import {
  INIT_USER,
  LOGIN_USER,
  COUNTERS_FETCHING,
  REFS_FETCHING,
  // REGIONS_INIT_FETCHING,
  QUARTERS_FETCHING,
  REGIONS_STATIC_FETCHING,
  REGIONS_FETCHING,
  // REGIONS_ARCHIVED_FETCHING,
  PROJECTS_SHOWCASE_FETCHING,
  PROJECTS_COUNT_FETCHING,
  PROJECTS_SUMMARIZED_FETCHING,
  PROJECTS_FETCHING,
  PROJECT_FETCHING,
  COMPANIES_FETCHING,
  COMPANY_FETCHING,
  VOTINGS_FETCHING,
  VOTING_FETCHING,
  VOTING_STORING,
  VOTING_EDIT_FETCHING,
  VOTING_UPDATING,
  VOTING_QUESTION_VOTING,
  VOTING_COMPANIES_FETCHING,
  MEETINGS_FETCHING,
  MEETING_FETCHING,
  MEETING_EDIT_FETCHING,
  MEETING_STORING,
  MEETING_UPDATING,
  MEETING_USERS_FETCHING
} from '../constants/ActionTypes';
import * as actions from '../actions';
import * as API from '../constants/API';

const setToken = (response) => {
  if (response) {
    let { authorization: token } = response.headers;
    if (!token) {
      token = response.data.token;
    }
    console.log('storing new token:', token, 'from', response.request.responseURL);
    if (token) {
      store.dispatch(actions.updateToken(token));
    }
  }
};

const showErrorMessage = (text) => Toast.show({
  text,
  position: 'bottom',
  duration: 5000,
  type: 'danger'
});

const handleError = (errorResponse, actionOnFail, payloadOnFail, originalAction, originalPayload = {}) => {
  if (errorResponse) {
    setToken(errorResponse);
    const { status, data } = errorResponse;
    if (data && data.error) {
      if (!originalPayload.repeated && status === 401 && (data.error === 'Token Invalid' || data.error === 'Token Expired')) {
        store.dispatch(actions.loginUser({ uid: store.getState().auth.uid }));
        setTimeout(() => store.dispatch(originalAction({ ...originalPayload, repeated: true })), 1000);
      } else {
        showErrorMessage(data.error);
      }
    }
  }
  return actionOnFail(payloadOnFail);
};

function* initUser(action) {
  try {
    const deviceInfo = {
      name: DeviceInfo.getDeviceName(),
      type: 'device',
      manufacturer: DeviceInfo.getManufacturer(),
      brand: DeviceInfo.getBrand(),
      model: DeviceInfo.getModel(),
      id: DeviceInfo.getDeviceId(),
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      bundleId: DeviceInfo.getBundleId(),
      buildNumber: DeviceInfo.getBuildNumber(),
      appVersion: DeviceInfo.getVersion(),
      appVersionReadable: DeviceInfo.getReadableVersion(),
      userAgent: DeviceInfo.getUserAgent(),
      locale: DeviceInfo.getDeviceLocale(),
      country: DeviceInfo.getDeviceCountry(),
      timezone: DeviceInfo.getTimezone(),
      isEmulator: DeviceInfo.isEmulator(),
      isTablet: DeviceInfo.isTablet()
    };
    if (Platform.OS === 'android') {
      deviceInfo.APILevel = DeviceInfo.getAPILevel();
      deviceInfo.phoneNumber = DeviceInfo.getPhoneNumber();
      deviceInfo.firstInstallTime = DeviceInfo.getFirstInstallTime();
      deviceInfo.lastInstallTime = DeviceInfo.getLastUpdateTime();
      deviceInfo.serialNumber = DeviceInfo.getSerialNumber();
    }
    const response = yield API.postUserData({ ...action.payload, ...deviceInfo });
    yield put(actions.initUserSuccess(response.data));
  } catch (error) {
    yield put(actions.initUserFail(error.response));
  }
}

function* loginUser(action) {
  try {
    const response = yield API.getToken(action.payload.uid);
    setToken(response);
    yield put(actions.loginUserSuccess({ ...response.data, ...action.payload }));
  } catch (error) {
    if (error.response && (error.response.status === 424 || error.response.status === 404)) {
      yield all([
        put(actions.initUser({ ...action.payload, fcmToken: store.getState().auth.fcm_token })),
        put(actions.loginUserFail(error.response))
      ]);
    } else {
      yield put(actions.loginUserFail(error.response));
    }
  }
}

function* getCounters(action) {
  try {
    const response = yield API.getCounters();
    setToken(response);
    yield put(actions.fetchCountersSuccess(response));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchCountersFail, error.response, actions.fetchCounters, action.payload));
  }
}

function* getRefs(action) {
  try {
    const response = yield API.getRefs();
    setToken(response);
    yield store.getState().auth.user.role === 'admin'
        ? all([put(actions.fetchRefsSuccess(response)), put(actions.fetchQuarters())])
        : put(actions.fetchRefsSuccess(response));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchRefsFail, error.response, actions.fetchRefs, action.payload));
  }
}

function* getQuarters(action) {
    try {
        const response = yield API.getQuarters();
        setToken(response);
        yield all([
            put(actions.fetchQuartersSuccess(response)),
            put(actions.fetchRegionsStaticData())
        ]);
    } catch (error) {
        yield put(handleError(error.response, actions.fetchQuartersFail, error.response, actions.fetchQuarters, action.payload));
    }
}

function* getRegionsStaticData(action) {
    try {
        const response = yield API.getRegionsStaticData();
        setToken(response);
        yield all([
            put(actions.fetchRegionsStaticDataSuccess(response)),
            put(actions.fetchRegionsDynamicData({ ...action.payload, projectGroup: store.getState().refs.data.projectGroupsKeyedByCodeDict['import']/*, selectedRegions: [{ ref: 'RU-MOS', name: 'Московская область' }]*/ }))
        ]);
    } catch (error) {
        yield put(handleError(error.response, actions.fetchRegionsStaticDataFail, error.response, actions.fetchRegionsStaticData, action.payload));
    }
}

// function* getRegionsInit(action) {
//   try {
//     const response = yield API.getRegionsDynamicData();
//     setToken(response);
//     yield put(actions.fetchRegionsInitSuccess({ response, selectedRegions: [{ ref: 'RU-MOS', name: 'Московская область' }] }));
//   } catch (error) {
//     yield put(handleError(error.response, actions.fetchRegionsInitFail, error.response, actions.fetchRegionsDynamicData, action.payload));
//   }
// }

function* getRegions(action) {
  try {
    const { selectedRegions } = action.payload;
    const response = yield API.getRegionsDynamicData(action.payload);
    setToken(response);
    yield put(actions.fetchRegionsDynamicDataSuccess({ response, selectedRegions }));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchRegionsDynamicDataFail, error.response, actions.fetchRegionsDynamicData, action.payload));
  }
}

// function* getArchivedRegions(action) {
//   try {
//     const { quarter, year, industries, selectedRegions } = action.payload;
//     const response = yield API.getRegionsDynamicData({ quarter, year, filters: { industries }, past: 1 });
//     setToken(response);
//     yield put(actions.fetchArchivedRegionsSuccess({ response, selectedRegions }));
//   } catch (error) {
//     yield put(handleError(error.response, actions.fetchArchivedRegionsFail, error.response, actions.fetchArchivedRegions, action.payload));
//   }
// }

function* getProjectsShowcase(action) {
  try {
    const response = yield API.getProjectsShowcase(action.payload);
    setToken(response);
    yield put(actions.fetchProjectsShowcaseSuccess({ response, params: action.payload }));
  } catch (error) {
    // yield put(actions.fetchProjectsShowcaseSuccess({ response: [], params: action.payload }));
    yield put(handleError(error.response, actions.fetchProjectsShowcaseFail, error.response, actions.fetchProjectsShowcase, action.payload));
  }
}

function* getProjectsCount(action) {
    try {
      const response = yield API.getProjectsShowcase(action.payload);
      setToken(response);
      yield put(actions.fetchProjectsCountSuccess({ response, params: action.payload }));
    } catch (error) {
      yield put(handleError(error.response, actions.fetchProjectsCountFail, error.response, actions.fetchProjectsCount, action.payload));
    }
}

function* getProjectsSummarized(action) {
  try {
    const response = yield API.getProjectsSummarized(action.payload);
    setToken(response);
    yield put(actions.fetchProjectsSummarizedSuccess({ response, params: action.payload }));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchProjectsSummarizedFail, error.response, actions.fetchProjectsSummarized, action.payload));
  }
}

function* getProjects(action) {
  try {
    const response = yield API.getProjects(action.payload);
    setToken(response);
    yield put(actions.fetchProjectsSuccess({ response, params: action.payload }));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchProjectsFail, error.response, actions.fetchProjects, action.payload));
  }
}

function* getProject(action) {
  try {
    const response = yield API.getProject(action.payload.id);
    setToken(response);
    yield put(actions.fetchProjectSuccess(response));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchProjectFail, error.response, actions.fetchProject, action.payload));
  }
}

function* getCompanies(action) {
  try {
    const response = yield API.getCompanies(action.payload);
    setToken(response);
    yield put(actions.fetchCompaniesSuccess({ response, params: action.payload }));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchCompaniesFail, error.response, actions.fetchCompanies, action.payload));
  }
}

function* getCompany(action) {
  try {
    const response = yield API.getCompany(action.payload.id);
    setToken(response);
    yield put(actions.fetchCompanySuccess({ response }));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchCompanyFail, error.response, actions.fetchCompany, action.payload));
  }
}

function* getVotings(action) {
  try {
    const response = yield API.getVotings(action.payload);
    setToken(response);
    yield put(actions.fetchVotingsSuccess({ response, params: action.payload }));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchVotingsFail, { response: error.response, params: action.payload }, actions.fetchVotings, action.payload));
  }
}

function* getVoting(action) {
  try {
    const response = yield API.getVoting(action.payload.id);
    setToken(response);
    yield put(actions.fetchVotingSuccess({ response, params: action.payload }));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchVotingFail, error.response, actions.fetchVoting, action.payload));
  }
}

function* postVoting(action) {
  try {
    const response = yield API.postVoting(action.payload.data);
    setToken(response);
    yield all([
        put(actions.storeVotingSuccess(response)),
        put(actions.fetchVotings())
    ]);
  } catch (error) {
    yield put(handleError(error.response, actions.storeVotingFail, error.response, actions.storeVoting, action.payload));
  }
}

function* getVotingEdit(action) {
  try {
    const response = yield API.getVoting(action.payload.id);
    setToken(response);
    yield put(actions.fetchVotingEditSuccess({ response, params: action.payload }));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchVotingEditFail, error.response, actions.fetchVoting, action.payload));
  }
}

function* updateVoting(action) {
  try {
    const response = yield API.updateVoting(action.payload);
    setToken(response);
    yield all([
        put(actions.updateVotingSuccess({ response })),
        put(actions.fetchVotings())
    ]);
  } catch (error) {
    yield put(handleError(error.response, actions.updateVotingFail, error.response, actions.updateVoting, action.payload));
  }
}

function* vote(action) {
  try {
    const { payload } = action;
    const response = yield API.voteQuestion(payload);
    setToken(response);
    yield put(actions.voteSuccess({ ...payload, response }));
  } catch (error) {
    yield put(handleError(error.response, actions.voteFail, { ...payload, response: error.response }, actions.vote, action.payload));
  }
}

function* getCompaniesVoting(action) {
  try {
    const { payload } = action;
    const response = yield API.getCompaniesByName(payload.pattern);
    setToken(response);
    yield put(actions.fetchCopmaniesVotingSuccess(response));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchCopmaniesVotingFail, error.response, actions.fetchCopmaniesVoting, action.payload));
  }
}

function* getMeetings(action) {
  try {
    const response = yield API.getMeetings(action.payload);
    setToken(response);
    yield put(actions.fetchMeetingsSuccess({ response, params: action.payload }));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchMeetingsFail, error.response, actions.fetchMeetings, action.payload));
  }
}

function* getMeeting(action) {
  try {
    const response = yield API.getMeeting(action.payload.id);
    setToken(response);
    yield put(actions.fetchMeetingSuccess({ response, params: action.payload }));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchMeetingFail, error.response, actions.fetchMeeting, action.payload));
  }
}

function* getMeetingEdit(action) {
  try {
    const response = yield API.getMeeting(action.payload.id);
    setToken(response);
    yield put(actions.fetchMeetingEditSuccess({ response, params: action.payload }));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchMeetingEditFail, error.response, actions.fetchMeeting, action.payload));
  }
}

function* postMeeting(action) {
  try {
    const response = yield API.postMeeting(action.payload.data);
    setToken(response);
    yield all([
        put(actions.storeMeetingSuccess(response)),
        put(actions.fetchMeetings({ page: 1 }))
    ]);
  } catch (error) {
    yield put(handleError(error.response, actions.storeMeetingFail, error.response, actions.storeMeeting, action.payload));
  }
}

function* updateMeeting(action) {
  try {
    const response = yield API.updateMeeting(action.payload);
    setToken(response);
    yield all([
        put(actions.storeMeetingSuccess(response)),
        put(actions.fetchMeetings({ page: 1 }))
    ]);
  } catch (error) {
    yield put(handleError(error.response, actions.updateMeetingFail, error.response, actions.updateMeeting, action.payload));
  }
}

function* getUsersMeeting(action) {
  try {
    const response = yield API.getUsers(action.payload.pattern);
    setToken(response);
    yield put(actions.fetchUsersMeetingSuccess(response));
  } catch (error) {
    yield put(handleError(error.response, actions.fetchUsersMeetingFail, error.response, actions.fetchUsersMeeting, action.payload));
  }
}

function* Saga() {
  yield all([
    takeEvery(INIT_USER, initUser),
    takeEvery(LOGIN_USER, loginUser),
    takeEvery(COUNTERS_FETCHING, getCounters),
    takeEvery(REFS_FETCHING, getRefs),
    takeEvery(QUARTERS_FETCHING, getQuarters),
    takeEvery(REGIONS_STATIC_FETCHING, getRegionsStaticData),
    // takeEvery(REGIONS_INIT_FETCHING, getRegionsInit),
    takeEvery(REGIONS_FETCHING, getRegions),
    // takeEvery(REGIONS_ARCHIVED_FETCHING, getArchivedRegions),
    takeEvery(PROJECTS_SHOWCASE_FETCHING, getProjectsShowcase),
    takeEvery(PROJECTS_COUNT_FETCHING, getProjectsCount),
    takeEvery(PROJECTS_SUMMARIZED_FETCHING, getProjectsSummarized),
    takeEvery(PROJECTS_FETCHING, getProjects),
    takeEvery(PROJECT_FETCHING, getProject),
    takeEvery(COMPANIES_FETCHING, getCompanies),
    takeEvery(COMPANY_FETCHING, getCompany),
    takeEvery(VOTINGS_FETCHING, getVotings),
    takeEvery(VOTING_FETCHING, getVoting),
    takeEvery(VOTING_STORING, postVoting),
    takeEvery(VOTING_EDIT_FETCHING, getVotingEdit),
    takeEvery(VOTING_UPDATING, updateVoting),
    takeEvery(VOTING_QUESTION_VOTING, vote),
    takeEvery(VOTING_COMPANIES_FETCHING, getCompaniesVoting),
    takeEvery(MEETINGS_FETCHING, getMeetings),
    takeEvery(MEETING_FETCHING, getMeeting),
    takeEvery(MEETING_EDIT_FETCHING, getMeetingEdit),
    takeEvery(MEETING_STORING, postMeeting),
    takeEvery(MEETING_UPDATING, updateMeeting),
    takeEvery(MEETING_USERS_FETCHING, getUsersMeeting)
  ])
}

export default Saga;
