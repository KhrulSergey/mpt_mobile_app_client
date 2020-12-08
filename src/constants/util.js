import concat from 'lodash-es/concat';
import filter from 'lodash-es/filter';
import isNull from 'lodash-es/isNull';
import findIndex from 'lodash-es/findIndex';
import isUndefined from 'lodash-es/isUndefined';
import { Platform } from 'react-native';
import { Toast } from 'native-base';

const isNullOrUndefined = o => isNull(o) || isUndefined(o);

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

const getDeclinedUnit = (num, cases) => {
    return num % 10 === 1 && num % 100 !== 11
        ? cases.nom
        : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
            ? cases.gen
            : cases.plu;
};

const placeSpecificItemAtTheBeginning = (array, prop, value) => {
    const _index = findIndex(array, { [prop]: value });
    if (_index > 0) return concat(array[_index], filter(array, o => o[prop] !== value));
    return array;
};

const trackByIndex = (item, index) => index.toString();

const trackById = (item, index) => item.id.toString();

const toast = (text) => Toast.show({
    text,
    position: 'bottom',
    style: { bottom: Platform.OS === 'ios' ? 40 : 0 },
    // buttonText: 'OK',
    duration: 5000,
    type: 'danger'
});

export {
    isNullOrUndefined,
    isNumeric,
    getDeclinedUnit,
    placeSpecificItemAtTheBeginning,
    trackByIndex,
    trackById,
    toast
};
