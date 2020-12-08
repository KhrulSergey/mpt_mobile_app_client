import { Platform } from 'react-native';
import {
    STORE_DIMENSIONS
} from '../constants/ActionTypes';

const INITIAL_STATE = {
    dimensions: {}
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case STORE_DIMENSIONS:
            const { width } = payload;
            const height = Platform.OS === 'ios' ? payload.height : payload.height - 20;
            const navbarHeight = Platform.OS === 'ios' ? 64 : 56;
            return { dimensions: { width, height, navbarHeight, heightWithoutNavbar: height - navbarHeight } };
        default:
            return state;
    }
};
