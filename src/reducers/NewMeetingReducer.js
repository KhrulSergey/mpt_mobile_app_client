import each from 'lodash-es/each';
import cloneDeep from 'lodash-es/cloneDeep';
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import addDays from 'date-fns/add_days'
import firebase from 'react-native-firebase';
import { DATE_TIME } from '../constants/DateTime';
import {
    MEETING_EDIT_FETCHING,
    MEETING_EDIT_FETCHING_SUCCESS,
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
    MEETING_UPDATING_FAIL
} from '../constants/ActionTypes';

const formatDate = date => format(date, DATE_TIME);

const getDefaultDateStart = (date) => {
    return { raw: date, formatted: formatDate(date) };
};

const getDefaultDateEnd = (date) => {
    const tomorrow = addDays(date, 1);
    return { raw: tomorrow, formatted: formatDate(tomorrow) };
};

const getInitialState = () => {
    const date = new Date();
    return {
        data: {
            _id: Date.now(),
            name: '',
            description: '',
            date_from: getDefaultDateStart(date),
            date_to: getDefaultDateEnd(date),
            users: []
        },
        fetching: false,
        fetchingError: null,
        storing: false,
        storingError: null,
        updating: false,
        updatingError: null,
        mode: 'create'
    };
};
const INITIAL_STATE = getInitialState();

const populateData = (state, payload) => {
    const data = payload.response.data;
    each(['date_from', 'date_to'], (prop) => {
        const date = parse(data[prop]);
        data[prop] = { raw: date, formatted: formatDate(date) };
    });
    if (payload.params.new) {
        console.log('I AM GOING TO DECREMENT BADGE NUMBER @ MEETING_EDIT_FETCHING_SUCCESS');
        firebase.notifications().getBadge()
            .then(number => firebase.notifications().setBadge(number - 1));
    }
    return { ...state, data, fetching: false, fetchingError: null, mode: 'edit' };
};

const setName = (state, payload) => {
    const newState = cloneDeep(state);
    newState.data.name = payload;
    return newState;
};

const setDescription = (state, payload) => {
    const newState = cloneDeep(state);
    newState.data.description = payload;
    return newState;
};

const setActiveDate = (state, { period, raw }) => {
    const newState = cloneDeep(state);
    newState.data[`date_${period}`] = { raw, formatted: formatDate(raw) };
    return newState;
};

// const addParticipant = (state, payload) => {
//     const newState = cloneDeep(state);
//     newState.data.users.push(payload);
//     newState.usersFound.splice(findIndex(newState.usersFound, { id: payload.id }), 1);
//     return newState;
// };
//
// const updateFoundUsers = (state, payload) => {
//     const usersFound = [];
//     each(payload.data, (userFound) => {
//         if (!find(state.data.users, { id: userFound.id })) usersFound.push({ ...userFound, new: true });
//     });
//     return { ...state, usersFound, fetchingUsers: false, fetchingUsersError: null };
// };
//
// const removeParticipant = (state, payload) => {
//     console.log('gotta removeParticipant', cloneDeep(payload));
//     const newState = cloneDeep(state);
//     console.log('cloned state', cloneDeep(newState));
//     const index = findIndex(newState.data.users, { id: payload.id });
//     console.log('found user in newState.data.users with id = ', payload.id, '; found index = ', index);
//     if (index || index === 0) {
//         newState.data.users.splice(index, 1);
//         if (payload.new) newState.usersFound.push(payload);
//     }
//     console.log('returning state', cloneDeep(newState));
//     return newState;
// };

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case MEETING_EDIT_FETCHING:
            return { ...state, fetching: true };
        case MEETING_EDIT_FETCHING_SUCCESS:
            return populateData(state, payload);
        case MEETING_EDIT_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        case MEETING_INITIALIZE:
            return getInitialState();
        case MEETING_NAME_CHANGED:
            return setName(state, payload);
        case MEETING_DESCRIPTION_CHANGED:
            return setDescription(state, payload);
        case MEETING_DATE_CHANGED:
            return setActiveDate(state, payload);
        case MEETING_STORING:
            return { ...state, storing: true };
        case MEETING_STORING_SUCCESS:
            return { ...state, storing: false, storingError: null };
        case MEETING_STORING_FAIL:
            return { ...state, storing: false, storingError: payload };
        case MEETING_UPDATING:
            return { ...state, updating: true };
        case MEETING_UPDATING_SUCCESS:
            return { ...state, updating: false, updatingError: null };
        case MEETING_UPDATING_FAIL:
            return { ...state, updating: false, updatingError: payload };
        // case MEETING_USERS_FETCHING:
        //     return { ...state, fetchingUsers: true };
        // case MEETING_USERS_FETCHING_SUCCESS:
        //     return updateFoundUsers(state, payload);
        // case MEETING_USERS_FETCHING_FAIL:
        //     return { ...state, fetchingUsers: false, fetchingUsersError: payload };
        // case MEETING_PARTICIPANT_ADD:
        //     return addParticipant(state, payload);
        // case MEETING_PARTICIPANT_REMOVE:
        //     return removeParticipant(state, payload);
        default:
            return state;
    }
};
