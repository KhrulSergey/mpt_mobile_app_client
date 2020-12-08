import map from 'lodash-es/map';
import each from 'lodash-es/each';
import filter from 'lodash-es/filter';
import cloneDeep from 'lodash-es/cloneDeep';
import {
    REFS_FETCHING,
    REFS_FETCHING_SUCCESS,
    REFS_FETCHING_FAIL,
    FILTER_VOTING_REGION_VISIBILITY_TOGGLE,
    FILTER_VOTING_REGION_TOGGLE,
    FILTER_VOTING_DISTRICT_TOGGLE,
    FILTER_VOTING_REGION_RESET,
    VOTING_EDIT_FETCHING_SUCCESS,
    FILTER_VOTING_REGION_FILTER
} from '../constants/ActionTypes';
import {
    divideArray,
    toggleRegionSelection,
    toggleDistrictSelection,
    resetGroupedFilter,
    applyTextFilter
} from './FilterHelpers';

const INITIAL_STATE = {
    fetching: false,
    fetchingError: null,
    selected: [],
    updated_at: null
};

const getInitialState = (state, { districts, regions }) => {
    const districtListClone = cloneDeep(districts);
    const regionListClone = cloneDeep(regions);
    const grouped = map(districtListClone, (district) => {
        return {
            ...district,
            regions: filter(regionListClone, ['fo_code', district.code])
        };
    });
    return { ...state, fetching: false, fetchingError: null, grouped, groupedDivided: divideArray(grouped), plain: regionListClone, selected: [], updated_at: Date.now() };
};

// const toggleVotingRegionFilterSelection = (state, selectedRegion) => {
//     // const newState = { ...state, grouped: cloneDeep(state.grouped) };
//     const newState = cloneDeep(state);
//     each(newState.grouped, (district) => {
//         if (district.code === selectedRegion.fo_code) {
//             each(district.regions, (region) => {
//                 if (region.id === selectedRegion.id) {
//                     region.selected = !region.selected;
//                     each(newState.plain, (__region) => {
//                         if (__region.id === region.id) {
//                             __region.selected = region.selected;
//                             return false;
//                         }
//                     });
//                     if (region.selected) {
//                         let needSelect = true;
//                         each(newState.selected, (_region, index) => {
//                             if (_region.id === region.id) {
//                                 needSelect = false;
//                                 return false;
//                             }
//                         });
//                         if (needSelect) {
//                             newState.selected.push(region);
//                         }
//                     } else {
//                         each(newState.selected, (_region, index) => {
//                             if (_region.id === region.id) {
//                                 newState.selected.splice(index, 1);
//                                 return false;
//                             }
//                         });
//                     }
//                     return false;
//                 }
//             });
//             if (selectedRegion.selected) {
//                 district.selected = true;
//                 each(district.regions, (region) => {
//                     if (!region.selected) {
//                         district.selected = false;
//                         return false;
//                     }
//                 });
//             } else {
//                 district.selected = false;
//             }
//             return false;
//         }
//     });
//     newState.groupedDivided = divideArray(newState.grouped);
//     return newState;
// };

// const toggleVotingDistrictFilterSelection = (state, selectedDistrict) => {
//     // const newState = { ...state, grouped: cloneDeep(state.grouped) };
//     const newState = cloneDeep(state);
//     each(newState.grouped, (district) => {
//         if (district.code === selectedDistrict.code) {
//             let needSelectAll = false;
//             each(district.regions, (region) => {
//                 if (!region.selected) {
//                     needSelectAll = true;
//                     return false;
//                 }
//             });
//             if (needSelectAll) {
//                 district.selected = true;
//                 each(district.regions, (region) => {
//                     region.selected = true;
//                     each(newState.plain, (__region) => {
//                         if (__region.id === region.id) {
//                             __region.selected = region.selected;
//                             return false;
//                         }
//                     });
//                     let needSelect = true;
//                     each(newState.selected, (_region, index) => {
//                         if (_region.id === region.id) {
//                             needSelect = false;
//                             return false;
//                         }
//                     });
//                     if (needSelect) {
//                         newState.selected.push(region);
//                     }
//                 });
//             } else {
//                 district.selected = false;
//                 each(district.regions, (region) => {
//                     region.selected = false;
//                     each(newState.plain, (__region) => {
//                         if (__region.id === region.id) {
//                             __region.selected = region.selected;
//                             return false;
//                         }
//                     });
//                     each(newState.selected, (_region, index) => {
//                         if (_region.id === region.id) {
//                             newState.selected.splice(index, 1);
//                             return false;
//                         }
//                     });
//                 });
//             }
//             return false;
//         }
//     });
//     newState.groupedDivided = divideArray(newState.grouped);
//     return newState;
// };

// const resetFilter = (state) => {
//     state.selected = [];
//     const newState = cloneDeep(state);
//     // const newState = { ...state, selected: [], grouped: cloneDeep(state.grouped) };
//     each(newState.plain, (region) => {
//         region.selected = false;
//     });
//     each(newState.grouped, (district) => {
//         district.selected = false;
//         each(district.regions, (region) => {
//             region.selected = false;
//         });
//     });
//     newState.groupedDivided = divideArray(newState.grouped);
//     return newState;
// };

const toggleVisibility = (state, payload) => {
    if (payload) {
        return { ...state, ...payload.data, updated_at: Date.now() }
    }
    return { ...state, updated_at: Date.now() }
};

const initiateVotingRegionFilterSelection = (state, payload) => {
    const { filters } = payload.response.data;
    const regions = filters && filters.regions ? { ...filters.regions } : [];
    const newState = { ...state };

    each(regions, (regionCode) => {
        const region = each(newState.plain, { code: regionCode });
        region.selected = true;
        newState.selected.push(region);
        // each(newState.grouped, (district) => {
        //     const region = find(district.regions, { code: regionCode });
        //     if (region) {
        //         region.selected = true;
        //         newState.selected.push(region);
        //     }
        // });
    });
    // each(newState.grouped, (district) => {
    //     if (!find(district.regions, o => !o.selected)) district.selected = true;
    // });
    newState.groupedDivided = divideArray(newState.grouped);
    return newState;
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case REFS_FETCHING:
            return { ...state, fetching: true };
        case REFS_FETCHING_SUCCESS:
            return getInitialState(state, payload.data);
        case REFS_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        case FILTER_VOTING_REGION_VISIBILITY_TOGGLE:
            return toggleVisibility(state, payload);
        case FILTER_VOTING_REGION_TOGGLE:
            return toggleRegionSelection(state, payload);
        case FILTER_VOTING_DISTRICT_TOGGLE:
            return toggleDistrictSelection(state, payload);
        case FILTER_VOTING_REGION_RESET:
            return resetGroupedFilter(state);
        case VOTING_EDIT_FETCHING_SUCCESS:
            return initiateVotingRegionFilterSelection(resetGroupedFilter(state), payload);
        case FILTER_VOTING_REGION_FILTER:
            return applyTextFilter(state, payload);
        default:
            return state;
    }
};
