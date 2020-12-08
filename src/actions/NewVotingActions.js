import {
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
    VOTING_ANSWER_PREVIEW_UPDATE
} from '../constants/ActionTypes';

export const votingNameChanged = (text) => {
    return {
        type: VOTING_NAME_CHANGED,
        payload: text
    };
};

export const votingDescriptionChanged = (text) => {
    return {
        type: VOTING_DESCRIPTION_CHANGED,
        payload: text
    };
};

export const changeVotingCurrentStep = (step) => {
    return {
        type: VOTING_CURRENT_STEP_UPDATE,
        payload: step
    };
};

export const questionTextChanged = ({ questionId, text }) => {
    return {
        type: QUESTION_TEXT_CHANGED,
        payload: { questionId, text }
    };
};

export const answerTextChanged = ({ questionId, index, text }) => {
    return {
        type: ANSWER_TEXT_CHANGED,
        payload: { questionId, index, text }
    };
};

export const addQuestion = () => {
    return {
        type: QUESTION_ADD,
        payload: null
    };
};

export const deleteQuestion = (questionId) => {
    return {
        type: QUESTION_DELETE,
        payload: questionId
    };
};

export const updateQuestionType = ({ questionId, type }) => {
    return {
        type: QUESTION_TYPE_UPDATED,
        payload: { questionId, type }
    };
};

export const addAnswer = (questionId) => {
    return {
        type: ANSWER_ADD,
        payload: questionId
    };
};

export const deleteAnswer = (questionId, answerId) => {
    return {
        type: ANSWER_DELETE,
        payload: { questionId, answerId }
    };
};

export const setVotingActiveDate = ({ period, date }) => {
    return {
        type: VOTING_SET_ACTIVE_DATE,
        payload: { period, raw: date }
    };
};

export const updatePreviewVotingAnswer = ({ question, answer }) => {
    return {
        type: VOTING_ANSWER_PREVIEW_UPDATE,
        payload: { question, answer }
    };
};

// export const resetNewVoting = () => {
//     return {
//         type: VOTING_PUBLISH_SUCCESS,
//         payload: Date.now()
//     };
// };
