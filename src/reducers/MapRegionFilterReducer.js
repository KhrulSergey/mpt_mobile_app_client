import map from 'lodash-es/map';
import each from 'lodash-es/each';
import filter from 'lodash-es/filter';
import cloneDeep from 'lodash-es/cloneDeep';
import {
    REFS_FETCHING,
    REFS_FETCHING_SUCCESS,
    REFS_FETCHING_FAIL,
    FILTER_MAP_REGION_VISIBILITY_TOGGLE,
    FILTER_MAP_REGION_TOGGLE,
    FILTER_MAP_DISTRICT_TOGGLE,
    REGIONS_SELECT,
    REGIONS_FETCHING_SUCCESS,
    FILTER_MAP_REGION_RESET,
    FILTER_MAP_REGION_FILTER,
    FILTER_MAP_REGION_POPULATE
} from '../constants/ActionTypes';
import {
    divideArray,
    toggleRegionSelection,
    toggleDistrictSelection,
    resetGroupedFilter,
    applyTextFilter
} from './FilterHelpers';
import find from "lodash-es/find";

const INITIAL_STATE = {
    fetching: false,
    fetchingError: null,
    selected: [],
    updated_at: null
};

const getInitialState = (state, { districts, regions }) => {
    const districtListClone = cloneDeep(districts);
    const regionListClone = cloneDeep(regions);
    each(regionListClone, region => region.selected = false);
    const updated_at = Date.now();
    const grouped = map(districtListClone, (districtListItem) => {
        return {
            ...districtListItem,
            updated_at,
            regions: filter(regionListClone, ['fo_code', districtListItem.code])
        };
    });
    return { ...state, fetching: false, fetchingError: null, grouped, groupedDivided: divideArray(grouped), plain: regionListClone, plainInitial: cloneDeep(regionListClone), groupedInitial: cloneDeep(grouped), updated_at: Date.now() };
};

const toggleVisibility = (state, payload) => {
    if (payload) {
        return { ...state, ...payload.data, currentScene: payload.currentScene, updated_at: Date.now() }
    }
    return { ...state, updated_at: Date.now() }
};

const populateFilter = (state, payload) => {
    console.log('populateFilter payload', payload);
    state.selected = [];
    const newState = cloneDeep(state);
    newState.plain = cloneDeep(newState.plainInitial);
    newState.grouped = cloneDeep(newState.groupedInitial);
    each(payload, (region) => {
        const foundRegion = find(newState.plain, { code: region.code });
        if (foundRegion) foundRegion.selected = true;
        const selectedDistrict = find(newState.grouped, { code: region.fo_code });
        selectedDistrict.updated_at = Date.now();
        const selectedRegion = find(selectedDistrict.regions, { code: region.code });
        if (selectedRegion) selectedRegion.selected = true;
        newState.selected.push(region);
    });
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
        case FILTER_MAP_REGION_VISIBILITY_TOGGLE:
            return toggleVisibility(state, payload);
        case FILTER_MAP_REGION_TOGGLE:
            return toggleRegionSelection(state, payload);
        case FILTER_MAP_DISTRICT_TOGGLE:
            return toggleDistrictSelection(state, payload);
        case REGIONS_SELECT:
            if (payload.selectedRegions.length === 1) {
                return resetGroupedFilter(state, payload.selectedRegions[0]);
            }
            return state;
        // case REGIONS_FETCHING_SUCCESS:
        //     return resetFilter(state);
        case FILTER_MAP_REGION_RESET:
            return resetGroupedFilter(state);
        case FILTER_MAP_REGION_FILTER:
            return applyTextFilter(state, payload);
        case FILTER_MAP_REGION_POPULATE:
            return populateFilter(state, payload);
        default:
            return state;
    }
};
