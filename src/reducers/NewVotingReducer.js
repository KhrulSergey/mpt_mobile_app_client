import each from 'lodash-es/each';
import find from 'lodash-es/find';
import findIndex from 'lodash-es/findIndex';
import parse from 'date-fns/parse'
import format from 'date-fns/format';
import addMonths from 'date-fns/add_months'
import firebase from 'react-native-firebase';
import { DATE } from '../constants/DateTime';
import {
    VOTING_EDIT_FETCHING,
    VOTING_EDIT_FETCHING_SUCCESS,
    VOTING_EDIT_FETCHING_FAIL,
    VOTING_UPDATING,
    VOTING_UPDATING_SUCCESS,
    VOTING_UPDATING_FAIL,
    VOTING_NAME_CHANGED,
    VOTING_DESCRIPTION_CHANGED,
    VOTING_CURRENT_STEP_UPDATE,
    QUESTION_TEXT_CHANGED,
    ANSWER_TEXT_CHANGED,
    QUESTION_ADD,
    QUESTION_DELETE,
    QUESTION_TYPE_UPDATED,
    ANSWER_ADD,
    ANSWER_DELETE,
    VOTING_SET_ACTIVE_DATE,
    VOTING_ANSWER_PREVIEW_UPDATE,
    VOTING_STORING,
    VOTING_STORING_SUCCESS,
    VOTING_STORING_FAIL
} from '../constants/ActionTypes';

const formatDate = date => format(date, DATE);

const getDefaultActiveDateStart = (date) => {
    return { raw: date, formatted: formatDate(date) };
};

const getDefaultActiveDateEnd = (date) => {
    const nextMonth = addMonths(date, 1);
    return { raw: nextMonth, formatted: formatDate(nextMonth) };
};

const getInitialState = () => {
    const date = new Date();
    return {
        data: {
            _id: Date.now(),
            name: '',
            description: '',
            date_from: getDefaultActiveDateStart(date),
            date_to: getDefaultActiveDateEnd(date),
            questions: [{ _id: 1, text: '', type: 'single', answers: [{ _id: 1, text: '' }, { _id: 2, text: '' }] }]
        },
        nextQuestionId: 2,
        nextAnswerId: 3,
        currentStep: 0,
        fetching: false,
        fetchingError: null,
        storing: false,
        storingError: null,
        updating: false,
        updatingError: null,
        nameOrDescriptionEmpty: null,
        textEmpty: null,
        countError: null,
        maxAnswersError: null
    };
};
const INITIAL_STATE = getInitialState();

const getData = (actionType, state, payload) => {
    const data = { ...payload.response.data };
    let nextQuestionId = 1;
    let nextAnswerId = 1;
    each(['date_from', 'date_to'], (prop) => {
        const date = parse(payload.response.data[prop]);
        data[prop] = { raw: date, formatted: formatDate(date) };
    });
    if (data.questions) {
        each(data.questions, (question) => {
            question._id = nextQuestionId++;
            if (question.answers && question.answers.length > 0) {
                each(question.answers, (answer) => {
                    answer._id = nextAnswerId++;
                });
            }
        });
    } else {
        data.questions = [];
    }
    if (actionType === 'fetching' && payload.params.new) {
        console.log('I AM GOING TO DECREMENT BADGE NUMBER @ VOTING_EDIT_FETCHING_SUCCESS');
        firebase.notifications().getBadge()
            .then(number => firebase.notifications().setBadge(number - 1));
    }
    return { ...state, [actionType]: false, [`${actionType}Error`]: null, data, nextQuestionId, nextAnswerId, currentStep: 0 };
};

const setName = (state, payload) => {
    const newState = { ...state };
    newState.data.name = payload;
    return newState;
};

const setDescription = (state, payload) => {
    const newState = { ...state };
    newState.data.description = payload;
    return newState;
};

const updateQuestionText = (state, { questionId, text }) => {
    const newState = { ...state };
    const question = find(newState.data.questions, { _id: questionId });
    question.text = text;
    question.isEmpty = false;
    return newState;
};

const updateAnswerText = (state, { questionId, index, text }) => {
    const newState = { ...state };
    const question = find(newState.data.questions, { _id: questionId });
    question.answers[index].text = text;
    question.answers[index].isEmpty = false;
    return newState;
};

const addQuestion = (state) => {
    const newState = { ...state };
    newState.data.questions.push({ _id: state.nextQuestionId, text: '', type: 'single', answers: [{ _id: state.nextAnswerId, text: '' }, { _id: state.nextAnswerId + 1, text: '' }] });
    newState.nextAnswerId = state.nextAnswerId + 2;
    newState.nextQuestionId = state.nextQuestionId + 1;
    return newState;
};

const deleteQuestion = (state, questionId) => {
    const newState = { ...state };
    newState.data.questions.splice(findIndex(newState.data.questions, { _id: questionId }), 1);
    return newState;
};

const updateQuestionType = (state, { questionId, type }) => {
    const newState = { ...state };
    find(newState.data.questions, { _id: questionId }).type = type;
    return newState;
};

const addAnswer = (state, questionId) => {
    const newState = { ...state };
    const question = find(newState.data.questions, { _id: questionId });
    if (question.answers.length < 10) {
        question.answers.push({ _id: state.nextAnswerId, text: '' });
        newState.nextAnswerId = state.nextAnswerId + 1;
    } else {
        return { ...state, maxAnswersError: Date.now() };
    }
    return newState;
};

const deleteAnswer = (state, { questionId, answerId }) => {
    const newState = { ...state };
    const question = find(newState.data.questions, { _id: questionId });
    question.answers.splice(findIndex(question.answers, { _id: answerId }), 1);
    return newState;
};

const setActiveDate = (state, { period, raw }) => {
    const newState = { ...state };
    newState.data[`date_${period}`] = { raw, formatted: formatDate(raw) };
    return newState;
};

const updateAnswer = (state, payload) => {
    const newState = { ...state };
    const question = find(newState.data.questions, { _id: payload.question._id });
    if (question.type === 'multiple') {
        const answer = find(question.answers, { _id: payload.answer._id });
        answer.isVoted = !answer.isVoted;
    } else if (question.type === 'single') {
        each(question.answers, (answer) => {
            if (answer._id === payload.answer._id) {
                if (!answer.isVoted) {
                    answer.isVoted = true;
                }
            } else {
                answer.isVoted = false;
            }
        });
    } else if (question.type === 'text') {
        question.answer = payload.answer;
    }
    return newState;
};

const updateCurrentStep = (state, payload) => {
    if (state.currentStep === 0 || state.currentStep === 1) {
        const { name, description } = state.data;
        if (!name || !description) {
            return { ...state, nameOrDescriptionEmpty: Date.now() };
        }
    } else if (state.currentStep === 2) {
        const { questions } = state.data;
        let okText = true;
        let okCount = true;
        if (!questions.length) {
            okCount = false;
        } else {
            each(questions, (question) => {
                if (question.text) {
                    question.isEmpty = false;
                } else {
                    okText = false;
                    question.isEmpty = true;
                }
                if (question.type !== 'text') {
                    if (!question.answers.length || question.answers.length < 2) {
                        okCount = false;
                        return false;
                    }
                    each(question.answers, (answer) => {
                        if (answer.text) {
                            answer.isEmpty = false;
                        } else {
                            okText = false;
                            answer.isEmpty = true;
                        }
                    });
                }
            });
        }
        if (!okText) {
            return { ...state, textEmpty: Date.now() };
        }
        if (!okCount) {
            return { ...state, countError: Date.now() };
        }
    }
    return { ...state, currentStep: payload };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case VOTING_EDIT_FETCHING:
            return { ...state, fetching: true };
        case VOTING_EDIT_FETCHING_SUCCESS:
            return getData('fetching', state, payload);
        case VOTING_EDIT_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        case VOTING_UPDATING:
            return { ...state, updating: true };
        case VOTING_UPDATING_SUCCESS:
            return getData('updating', state, payload);
        case VOTING_UPDATING_FAIL:
            return { ...state, updating: false, updatingError: payload };
        case VOTING_NAME_CHANGED:
            return setName(state, payload);
        case VOTING_DESCRIPTION_CHANGED:
            return setDescription(state, payload);
        case VOTING_CURRENT_STEP_UPDATE:
            return updateCurrentStep(state, payload);
        case QUESTION_TEXT_CHANGED:
            return updateQuestionText(state, payload);
        case ANSWER_TEXT_CHANGED:
            return updateAnswerText(state, payload);
        case QUESTION_ADD:
            return addQuestion(state);
        case QUESTION_DELETE:
            return deleteQuestion(state, payload);
        case QUESTION_TYPE_UPDATED:
            return updateQuestionType(state, payload);
        case ANSWER_ADD:
            return addAnswer(state, payload);
        case ANSWER_DELETE:
            return deleteAnswer(state, payload);
        case VOTING_SET_ACTIVE_DATE:
            return setActiveDate(state, payload);
        case VOTING_ANSWER_PREVIEW_UPDATE:
            return updateAnswer(state, payload);
        case VOTING_STORING:
            return { ...state, storing: true };
        case VOTING_STORING_SUCCESS:
            return getInitialState();
        case VOTING_STORING_FAIL:
            return { ...state, storing: false, storingError: payload };
        default:
            return state;
    }
};
