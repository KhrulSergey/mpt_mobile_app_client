import each from 'lodash-es/each';
import format from 'date-fns/format';
import { DATE_SERVER } from '../constants/DateTime';
import {
    VOTINGS_FETCHING,
    VOTINGS_FETCHING_SUCCESS,
    VOTINGS_FETCHING_FAIL,
    VOTING_FETCHING,
    VOTING_FETCHING_SUCCESS,
    VOTING_FETCHING_FAIL,
    VOTING_EDIT_FETCHING,
    VOTING_EDIT_FETCHING_SUCCESS,
    VOTING_EDIT_FETCHING_FAIL,
    VOTING_QUESTION_VOTING,
    VOTING_QUESTION_VOTING_SUCCESS,
    VOTING_QUESTION_VOTING_FAIL,
    VOTING_ANSWER_UPDATE,
    VOTING_STORING,
    VOTING_STORING_SUCCESS,
    VOTING_STORING_FAIL,
    VOTING_UPDATING,
    VOTING_UPDATING_SUCCESS,
    VOTING_UPDATING_FAIL,
    VOTING_COMPANIES_FETCHING,
    VOTING_COMPANIES_FETCHING_SUCCESS,
    VOTING_COMPANIES_FETCHING_FAIL,
    VOTINGS_VIEW_COUNT_UPDATE

} from '../constants/ActionTypes';

export const fetchVotings = (params) => { // { period, page }
    return {
        type: VOTINGS_FETCHING,
        payload: params
    };
};

export const fetchVotingsSuccess = (response) => {
    return {
        type: VOTINGS_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchVotingsFail = (error) => {
    return {
        type: VOTINGS_FETCHING_FAIL,
        payload: error
    };
};

export const fetchVoting = (payload) => { // { id, actionType, new }
    switch (payload.actionType) {
        case 'vote':
        case 'show':
            return {
                type: VOTING_FETCHING,
                payload
            };
        case 'edit':
            return {
                type: VOTING_EDIT_FETCHING,
                payload
            };
    }
};

export const fetchVotingSuccess = (response) => {
    return {
        type: VOTING_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchVotingFail = (error) => {
    return {
        type: VOTING_FETCHING_FAIL,
        payload: error
    };
};

export const fetchVotingEditSuccess = (response) => {
    return {
        type: VOTING_EDIT_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchVotingEditFail = (error) => {
    return {
        type: VOTING_EDIT_FETCHING_FAIL,
        payload: error
    };
};

/////////// store voting ////////////////

const getFilterArray = (array, prop) => {
    const res = [];
    each(array, (item) => {
        res.push(item[prop]);
    });
    return res;
};

const getQuestions = (questions) => {
    const q = [];
    each(questions, (question) => {
        const { text, type, answers } = question;
        if (type === 'text') {
            q.push({ text, type });
        } else {
            const a = [];
            each(answers, (answer) => {
                a.push({ text: answer.text });
            });
            q.push({ text, type, answers: a });
        }
    });
    return q;
};

export const storeVoting = (voting) => {
    const { name, description, date_from, date_to, questions, filters, repeated } = voting;
    const { regions, industries, companies } = filters;
    const payload = {
        data: {
            name,
            description,
            date_from: format(date_from.raw, DATE_SERVER),
            date_to: format(date_to.raw, DATE_SERVER),
            filters: {
                regions: getFilterArray(regions, 'code'),
                industries: getFilterArray(industries, 'id'),
                companies: getFilterArray(companies, 'id')
            },
            questions: getQuestions(questions)
        },
        repeated
    };
    return {
        type: VOTING_STORING,
        payload
    };
};

export const storeVotingSuccess = (response) => {
    return {
        type: VOTING_STORING_SUCCESS,
        payload: response
    };
};

export const storeVotingFail = (error) => {
    return {
        type: VOTING_STORING_FAIL,
        payload: error
    };
};

////////////////////////////////////////////////////////////////////////////////////////////////////

export const updateVoting = ({ id, name, description, date_from, date_to, filters, questions, repeated }) => {
    const questionsEdited = [];
    each(questions, (question) => {
        const q = {};
        if (question.id) q.id = question.id;
        if (question.type === 'single' || question.type === 'multiple') {
            const answers = [];
            each(question.answers, (answer) => {
                const a = {};
                if (answer.id) a.id = answer.id;
                answers.push({ ...a, text: answer.text });
            });
            q.answers = answers;
        }
        questionsEdited.push({ ...q, text: question.text, type: question.type });
    });
    const data = {
        name,
        description,
        date_from: format(date_from.raw, DATE_SERVER),
        date_to: format(date_to.raw, DATE_SERVER),
        filters: {
            regions: getFilterArray(filters.regions, 'code'),
            industries: getFilterArray(filters.industries, 'id'),
            companies: getFilterArray(filters.companies, 'id')
        },
        questions: questionsEdited
    };
    return {
        type: VOTING_UPDATING,
        payload: { id, data, repeated }
    };
};

export const updateVotingSuccess = (response) => {
    return {
        type: VOTING_UPDATING_SUCCESS,
        payload: response
    };
};

export const updateVotingFail = (error) => {
    return {
        type: VOTING_UPDATING_FAIL,
        payload: error
    };
};

/////////////////////////////////////////////

export const vote = ({ voting, question, data, repeated }) => {
    console.log('vote action creator { voting, question }', { voting, question });
    if (!data) {
        data = {};
        if (question.type === 'text') {
            data.text = question.answer;
        } else {
            data.answers = [];
            each(question.answers, (answer) => {
                if (answer.isVoted) {
                    data.answers.push(answer.id);
                }
            });
        }
    }
    return {
        type: VOTING_QUESTION_VOTING,
        payload: { voting, question, data, repeated }
    };
};

export const voteSuccess = (response) => {
    return {
        type: VOTING_QUESTION_VOTING_SUCCESS,
        payload: response
    };
};

export const voteFail = (error) => {
    return {
        type: VOTING_QUESTION_VOTING_FAIL,
        payload: error
    };
};

export const updateVotingAnswer = ({ question, answer }) => {
    return {
        type: VOTING_ANSWER_UPDATE,
        payload: { question, answer }
    };
};

export const fetchCopmaniesVoting = (pattern) => {
    return {
        type: VOTING_COMPANIES_FETCHING,
        payload: pattern
    };
};

export const fetchCopmaniesVotingSuccess = (response) => {
    return {
        type: VOTING_COMPANIES_FETCHING_SUCCESS,
        payload: response
    };
};

export const fetchCopmaniesVotingFail = (error) => {
    return {
        type: VOTING_COMPANIES_FETCHING_FAIL,
        payload: error
    };
};

export const updateVotingViewCount = (voting) => {
    return {
        type: VOTINGS_VIEW_COUNT_UPDATE,
        payload: voting
    };
};
