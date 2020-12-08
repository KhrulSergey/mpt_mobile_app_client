import format from 'date-fns/format';
import isBefore from 'date-fns/is_before';
import firebase from 'react-native-firebase';
import { DATE, TIME } from '../constants/DateTime';
import {
    MEETING_FETCHING,
    MEETING_FETCHING_SUCCESS,
    MEETING_FETCHING_FAIL
} from '../constants/ActionTypes';

const INITIAL_STATE = {
    data: {},
    fetching: false,
    fetchingError: null
};

const getMeeting = (state, payload) => {
    const meeting = payload.response.data;
    const now = Date.now();
    meeting.date_time_caption = `${format(meeting.date_from, DATE)}, в ${format(meeting.date_from, TIME)}`;
    if (isBefore(meeting.date_from, now) && isBefore(now, meeting.date_to)) {
        meeting.now = true;
    }
    if (payload.params.new) {
        console.log('I AM GOING TO DECREMENT BADGE NUMBER @ MEETING_FETCHING_SUCCESS');
        firebase.notifications().getBadge()
            .then(number => firebase.notifications().setBadge(number - 1));
    }
    return { ...state, fetching: false, fetchingError: null, data: meeting };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case MEETING_FETCHING:
            return { ...state, fetching: true };
        case MEETING_FETCHING_SUCCESS:
            return getMeeting(state, payload);
        case MEETING_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        default:
            return state;
    }
};
