import each from 'lodash-es/each';
import format from 'date-fns/format';
import { DATE_TIME_SERVER } from '../constants/DateTime';
import {
    MEETINGS_FETCHING,
    MEETINGS_FETCHING_SUCCESS,
    MEETINGS_FETCHING_FAIL,
    MEETING_FETCHING,
    MEETING_EDIT_FETCHING,
    MEETING_FETCHING_SUCCESS,
    MEETING_EDIT_FETCHING_SUCCESS,
    MEETING_FETCHING_FAIL,
    MEETING_EDIT_FETCHING_FAIL,
    MEETING_INITIALIZE,
    MEETING_NAME_CHANGED,
    MEETING_DESCRIPTION_CHANGED,
    MEETING_DATE_CHANGED,
    MEETING_STORING,
    MEETING_STORING_SUCCESS,
    MEETING_STORING_FAIL,
    MEETING_UPDATING,
    MEETING_UPDATING_SUCCESS,
    MEETING_UPDATING_FAIL,
    MEETING_USERS_FETCHING,
    MEETING_USERS_FETCHING_SUCCESS,
    MEETING_USERS_FETCHING_FAIL,
    MEETING_PARTICIPANT_ADD,
    MEETING_PARTICIPANT_REMOVE,
    MEETING_VIEW_COUNT_UPDATE
} from '../constants/ActionTypes';

export const fetchMeetings = (params) => {
    return {
        type: MEETINGS_FETCHING,
        payload: params
    };
};

export const fetchMeetingsSuccess = (response) => {
    return {
        type: MEETINGS_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchMeetingsFail = (error) => {
    return {
        type: MEETINGS_FETCHING_FAIL,
        payload: error
    };
};

export const fetchMeeting = (payload) => { // { id, actionType }
    let type;
    switch (payload.actionType) {
        case 'show':
            type = MEETING_FETCHING;
            break;
        case 'edit':
            type = MEETING_EDIT_FETCHING;
            break;
        case 'create':
            type = MEETING_INITIALIZE;
    }
    return {
        type,
        payload
    };
};

export const fetchMeetingSuccess = (response) => {
    return {
        type: MEETING_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchMeetingEditSuccess = (response) => {
    return {
        type: MEETING_EDIT_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchMeetingFail = (error) => {
    return {
        type: MEETING_FETCHING_FAIL,
        payload: error
    };
};

export const fetchMeetingEditFail = (error) => {
    return {
        type: MEETING_EDIT_FETCHING_FAIL,
        payload: error
    };
};


// export const initializeNewMeeting = (meeting) => {
//     return {
//         type: MEETING_INITIALIZE,
//         payload: meeting
//     };
// };

export const changeMeetingName = (text) => {
    return {
        type: MEETING_NAME_CHANGED,
        payload: text
    };
};

export const changeMeetingDescription = (text) => {
    return {
        type: MEETING_DESCRIPTION_CHANGED,
        payload: text
    };
};

export const changeMeetingDate = ({ period, date }) => {
    return {
        type: MEETING_DATE_CHANGED,
        payload: { period, raw: date }
    };
};

export const storeMeeting = (meetingData) => {
    const { name, description, date_from, date_to, users: usersObj, repeated } = meetingData;
    const users = [];
    each(usersObj, (user) => {
        users.push(user.id);
    });
    const payload = {
        data: {
            name,
            description,
            date_from: format(date_from.raw, DATE_TIME_SERVER),
            date_to: format(date_to.raw, DATE_TIME_SERVER),
            users
        },
        repeated
    };
    return {
        type: MEETING_STORING,
        payload
    };
};

export const storeMeetingSuccess = (response) => {
    return {
        type: MEETING_STORING_SUCCESS,
        payload: response
    };
};

export const storeMeetingFail = (error) => {
    return {
        type: MEETING_STORING_FAIL,
        payload: error
    };
};

export const updateMeeting = (meeting) => {
    const { id, name, description, date_from, date_to, users: usersObj, repeated } = meeting;
    const users = [];
    each(usersObj, (user) => {
        users.push(user.id);
    });
    const data = {
        name,
        description,
        date_from: format(date_from.raw, DATE_TIME_SERVER),
        date_to: format(date_to.raw, DATE_TIME_SERVER),
        users
    };
    return {
        type: MEETING_UPDATING,
        payload: { id, data, repeated }
    };
};

export const updateMeetingSuccess = (response) => {
    return {
        type: MEETING_UPDATING_SUCCESS,
        payload: response
    };
};

export const updateMeetingFail = (error) => {
    return {
        type: MEETING_UPDATING_FAIL,
        payload: error
    };
};

export const fetchUsersMeeting = (pattern) => {
    return {
        type: MEETING_USERS_FETCHING,
        payload: pattern
    };
};

export const fetchUsersMeetingSuccess = (response) => {
    return {
        type: MEETING_USERS_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchUsersMeetingFail = (error) => {
    return {
        type: MEETING_USERS_FETCHING_FAIL,
        payload: error
    };
};

export const addMeetingParticipant = (user) => {
    return {
        type: MEETING_PARTICIPANT_ADD,
        payload: user
    };
};

export const removeMeetingParticipant = (user) => {
    return {
        type: MEETING_PARTICIPANT_REMOVE,
        payload: user
    };
};

export const updateMeetingViewCount = (meeting) => {
    return {
        type: MEETING_VIEW_COUNT_UPDATE,
        payload: meeting
    };
};
