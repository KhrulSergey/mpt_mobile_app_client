import each from 'lodash-es/each';
import find from 'lodash-es/find';
import cloneDeep from 'lodash-es/cloneDeep';
import format from 'date-fns/format';
import isBefore from 'date-fns/is_before';
import { DATE, TIME } from '../constants/DateTime';
import {
    MEETINGS_FETCHING,
    MEETINGS_FETCHING_SUCCESS,
    MEETINGS_FETCHING_FAIL,
    MEETING_VIEW_COUNT_UPDATE
} from '../constants/ActionTypes';

const INITIAL_STATE = {
    data: [],
    fetching: false,
    fetchingError: null
};

const getMeetingList = (state, payload) => {
    let data = payload.response.data.data;
    const { current_page, last_page } = payload.response.data;
    const now = Date.now();
    each(data, (meeting) => {
        meeting.date_time_caption = `${format(meeting.date_from, DATE)}, в ${format(meeting.date_from, TIME)}`;
        if (isBefore(meeting.date_from, now) && isBefore(now, meeting.date_to)) {
            meeting.now = true;
        }
        if (meeting.users_count > 14) {
            meeting.users[14] = { id: 0, name: `и ${meeting.users_count - 14} других...` };
        }
    });
    if (payload.params.page === current_page && state.data && payload.params.page !== 1) {
        data = state.data.concat(data);
    }
    return { ...state, fetching: false, fetchingError: null, data, current_page, last_page };
};

const updateViewCount = (state, { id }) => {
    const newState = cloneDeep(state);
    const meeting = find(newState.data, { id });
    if (meeting) meeting.view_count = true;
    return newState;
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case MEETINGS_FETCHING:
            return { ...state, fetching: true };
        case MEETINGS_FETCHING_SUCCESS:
            return getMeetingList(state, payload);
        case MEETINGS_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        case MEETING_VIEW_COUNT_UPDATE:
            return updateViewCount(state, payload);
        default:
            return state;
    }
};
