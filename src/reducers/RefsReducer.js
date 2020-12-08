import keyBy from 'lodash-es/keyBy';
import sortBy from 'lodash-es/sortBy';
import { AsyncStorage } from 'react-native';
import {
    REFS_FETCHING,
    REFS_FETCHING_SUCCESS,
    REFS_FETCHING_FAIL
} from '../constants/ActionTypes';
import { placeSpecificItemAtTheBeginning } from '../constants/util';

const INITIAL_STATE = {
    data: null,
    fetching: false,
    fetchingError: null
};



export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case REFS_FETCHING:
            return { ...state, fetching: true };
        case REFS_FETCHING_SUCCESS:
            const { data } = payload;
            // AsyncStorage.setItem('gispRefs', JSON.stringify(data));
            data.industries = placeSpecificItemAtTheBeginning(sortBy(data.industries, 'name'), 'gisp_id', 0);
            data.districts = placeSpecificItemAtTheBeginning(data.districts, 'code', '0');
            data.regions = placeSpecificItemAtTheBeginning(data.regions, 'fo_code', '0');
            data.projectGroupsDict = keyBy(data.projectGroups, 'id');
            data.projectGroupsKeyedByCodeDict = keyBy(data.projectGroups, 'code');
            data.industriesDict = keyBy(data.industries, 'id');
            // data.districtsDict = keyBy(data.districts, 'code');
            data.regionsDict = keyBy(data.regions, 'code');
            data.regionsRefDict = keyBy(data.regions, 'ref');
            data.projectStatusesDict = keyBy(data.projectStatuses, 'id');
            data.projectStatusesKeyedByCodeDict = keyBy(data.projectStatuses, 'code');
            return { ...state, fetching: false, fetchingError: null, data };
        case REFS_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        default:
            return state;
    }
};
