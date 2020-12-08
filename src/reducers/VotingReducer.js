import each from 'lodash-es/each';
import find from 'lodash-es/find';
import orderBy from 'lodash-es/orderBy';
import findIndex from 'lodash-es/findIndex';
import firebase from 'react-native-firebase';
import { colors } from './ChartColors';
import {
    VOTING_FETCHING,
    VOTING_FETCHING_SUCCESS,
    VOTING_FETCHING_FAIL,
    VOTING_QUESTION_VOTING,
    VOTING_QUESTION_VOTING_SUCCESS,
    VOTING_QUESTION_VOTING_FAIL,
    VOTING_ANSWER_UPDATE
} from '../constants/ActionTypes';

const INITIAL_STATE = {
    data: {
        questions: []
    },
    fetching: false,
    fetchingError: null
};

const getManagerVotingData = (state, payload) => {
    const { response, params } = payload;
    const { companyId } = params;
    const data = response.data;
    if (data.responded_companies.includes(companyId)) {
        data.isVoted = true;
    }
    each(data.questions, (question) => {
        question.voting = false;
        question.votingError = null;
        if (question.responded_companies.includes(companyId)) {
            question.isVoted = true;
        }
        if (question.type === 'text') {
            let indexOfAnswer = -1;
            if (question.answer_text && question.answer_text.length > 0) {
                indexOfAnswer = findIndex(question.answer_text, { company_id: companyId });
            }
            question.answer = indexOfAnswer >= 0 ? question.answer_text[indexOfAnswer].text : null;
        } else {
            each(question.answers, (answer) => {
                if (answer.responded_companies.includes(companyId)) {
                    answer.isVoted = true;
                }
            });
        }
    });
    if (params.new) {
        console.log('I AM GOING TO DECREMENT BADGE NUMBER @ VOTING_FETCHING_SUCCESS');
        firebase.notifications().getBadge()
            .then(number => firebase.notifications().setBadge(number - 1));
    }
    return { ...state, data, fetching: false, fetchingError: null };
};

const getAdminVotingData = (state, payload) => {
    const { id, name, questions } = payload.response.data;
    const data = { id, name, questions: [] };
    each(questions, (question) => {
        if (question.type === 'multiple' || question.type === 'single') {
            question.value = question.companies_voted;
            each(question.answers, (answer, index) => {
                answer.value = answer.companies_voted;
                answer.valuePercent = question.companies_voted ? answer.companies_voted / question.companies_voted * 100 : 0;
                answer.label = answer.valuePercent > 0 ? `${+answer.valuePercent.toFixed(2)}%` : '';
                answer.svg = { fill: colors[index] };
                answer.key = `segment-${index}`
            });
            question.sections = orderBy(question.answers, ['value'], ['desc']);
            data.questions.push(question);
        }
    });
    if (payload.params.new) {
        console.log('I AM GOING TO DECREMENT BADGE NUMBER @ VOTING_FETCHING_SUCCESS');
        firebase.notifications().getBadge()
            .then(number => firebase.notifications().setBadge(number - 1));
    }
    return { ...state, data, fetching: false, fetchingError: null };
};

const getVotingData = (state, payload) => {
    const { actionType } = payload.params;
    if (actionType === 'vote') {
        return getManagerVotingData(state, payload);
    } else if (actionType === 'show') {
        return getAdminVotingData(state, payload);
    }
    return state;
};

const updateAnswer = (state, action) => {
    let voting = { ...state };
    const question = find(voting.data.questions, { id: action.payload.question.id });
    if (question.type === 'multiple') {
        const answer = find(question.answers, { id: action.payload.answer.id });
        answer.isVoted = !answer.isVoted;
    } else if (question.type === 'single') {
        each(question.answers, (answer) => {
            if (answer.id === action.payload.answer.id) {
                if (!answer.isVoted) {
                    answer.isVoted = true;
                }
            } else {
                answer.isVoted = false;
            }
        });
    } else if (question.type === 'text') {
        question.answer = action.payload.answer;
    }
    return voting;
};

const updateQuestion = (type, state, payload) => { // { voting, question, data, (response) }
    const voting = { ...state };
    const data = { ...state.data };
    const question = find(data.questions, { id: payload.question.id });
    switch (type) {
        case 'voting':
            question.voting = true;
            break;
        case 'voted':
            question.isVoted = true;
            question.voting = false;
            question.votingError = null;
            break;
        case 'failed':
            question.voting = false;
            question.votingError = payload.response;
            break;
    }
    return { ...voting, data };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case VOTING_FETCHING:
            return { ...state, fetching: true };
        case VOTING_FETCHING_SUCCESS:
            return getVotingData(state, payload);
        case VOTING_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        case VOTING_QUESTION_VOTING:
            return updateQuestion('voting', state, payload);
        case VOTING_QUESTION_VOTING_SUCCESS:
            return updateQuestion('voted', state, payload);
        case VOTING_QUESTION_VOTING_FAIL:
            return updateQuestion('failed', state, payload);
        case VOTING_ANSWER_UPDATE:
            return updateAnswer(state, action);
        default:
            return state;
    }
};
