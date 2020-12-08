import React from 'react';
import { View, Platform } from 'react-native';
import { black, catskillWhite, white } from '../../constants/Colors';

let platformSpecific = {};
if (Platform.OS === 'ios') {
    platformSpecific = {
        shadowColor: black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 3
    };
} else {
    platformSpecific = {
        borderTopWidth: 1.2,
        borderTopColor: catskillWhite
    };
}

const Footer = (props) => {
    const { style, children } = props;

    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
};

const styles = {
    container: {
        height: 58,
        backgroundColor: white,
        flexDirection: 'row',
        ...platformSpecific
    }
};

export { Footer };
