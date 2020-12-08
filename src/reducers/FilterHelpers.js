import map from 'lodash-es/map';
import each from 'lodash-es/each';
import find from 'lodash-es/find';
import take from 'lodash-es/take';
import cloneDeep from 'lodash-es/cloneDeep';
import findIndex from 'lodash-es/findIndex';
import takeRight from 'lodash-es/takeRight';
import filter from "lodash-es/filter";

const divideArray = (array) => {
    return {
        colLeft: take(array, Math.ceil(array.length / 2)),
        colRight: takeRight(array, array.length - Math.ceil(array.length / 2))
    };
};

const toggleRadioItemSelection = (state, { id }) => {
    const newState = cloneDeep(state);
    newState.list = map(state.list, item => ({ ...item, selected: false }));
    const item = find(newState.list, { id });
    item.selected = true;
    newState.selected = item;
    return newState;
};

const toggleItemSelection = (state, { id }) => {
    const newState = cloneDeep(state);
    const item = find(newState.plain, { id });
    item.selected = !item.selected;
    if (item.selected) {
        if (!find(newState.selected, { id })) newState.selected.push(item);
    } else {
        newState.selected.splice(findIndex(newState.selected, { id }), 1);
    }
    newState.divided = divideArray(newState.plain);
    return newState;
};

const toggleRegionSelection = (state, selectedRegion) => {
    // const newState = { ...state, grouped: cloneDeep(state.grouped) };
    const newState = cloneDeep(state);
    const district = find(newState.grouped, { code: selectedRegion.fo_code });
    district.updated_at = Date.now();
    const region = find(district.regions, { code: selectedRegion.code });
    find(newState.plain, { code: region.code }).selected = region.selected = !region.selected;
    if (region.selected) {
        if (!find(newState.selected, { code: region.code })) newState.selected.push(region);
    } else {
        newState.selected.splice(findIndex(newState.selected, { code: region.code }), 1);
    }
    // if (selectedRegion.selected) {
    //     district.selected = true;
    //     each(district.regions, (region) => {
    //         if (!region.selected) {
    //             district.selected = false;
    //             return false;
    //         }
    //     });
    // } else {
    //     district.selected = false;
    // }
    newState.groupedDivided = divideArray(newState.grouped);
    // filteredDivided: divideArray(filter(state.plain, (o) => o.name.toLowerCase().includes(payload.toLowerCase())))
    return newState;
};

const toggleDistrictSelection = (state, selectedDistrict) => {
    // const newState = { ...state, grouped: cloneDeep(state.grouped) };
    const newState = cloneDeep(state);
    const district = find(newState.grouped, { code: selectedDistrict.code });
    district.updated_at = Date.now();
    if (find(district.regions, o => !o.selected)) {
        // district.selected = true;
        each(district.regions, (region) => {
            find(newState.plain, { code: region.code }).selected = region.selected = true;
            if (!find(newState.selected, { code: region.code })) {
                newState.selected.push(region);
            }
        });
    } else {
        // district.selected = false;
        each(district.regions, (region) => {
            find(newState.plain, { code: region.code }).selected = region.selected = false;
            newState.selected.splice(findIndex(newState.selected, { code: region.code }), 1);
        });
    }
    newState.groupedDivided = divideArray(newState.grouped);
    return newState;
};

const resetFilter = (state) => {
    state.selected = [];
    const newState = cloneDeep(state);
    each(newState.plain, (item) => {
        item.selected = false;
    });
    newState.divided = divideArray(newState.plain);
    return newState;
};

const resetGroupedFilter = (state, selectedRegion) => {
    state.selected = [];
    const newState = cloneDeep(state);
    const selectedRegionRef = selectedRegion && selectedRegion.ref;
    if (selectedRegionRef) {
        each(newState.plain, (region) => {
            region.selected = region.ref === selectedRegionRef;
        });
        const updated_at = Date.now();
        each(newState.grouped, (district) => {
            district.updated_at = updated_at;
            each(district.regions, (region) => {
                if (region.ref === selectedRegionRef) {
                    region.selected = true;
                    newState.selected.push(region);
                } else {
                    region.selected = false;
                }
            });
        });
    } else {
        each(newState.plain, (region) => {
            region.selected = false;
        });
        const updated_at = Date.now();
        each(newState.grouped, (district) => {
            district.updated_at = updated_at;
            each(district.regions, (region) => {
                region.selected = false;
            });
        });
    }
    newState.groupedDivided = divideArray(newState.grouped);
    return newState;
};

const applyTextFilter = (state, term) => {
    return { ...state, filteredDivided: divideArray(filter(state.plain, (o) => o.name.toLowerCase().includes(term.toLowerCase()))) };
};

export {
    divideArray,
    toggleRadioItemSelection,
    toggleItemSelection,
    toggleRegionSelection,
    toggleDistrictSelection,
    resetFilter,
    resetGroupedFilter,
    applyTextFilter
};
