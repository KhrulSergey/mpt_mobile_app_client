import React from 'react';
import { View, Platform } from 'react-native';
import { black, manatee, white } from '../../constants/Colors';

let platformSpecific = {};
if (Platform.OS === 'ios') {
    platformSpecific = {
        shadowColor: black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 3
    };
} else if (Platform.Version < 21) {
    platformSpecific = {
        borderBottomWidth: 1.2,
        borderBottomColor: manatee
    };
} else {
    platformSpecific = {
        elevation: 7
    };
}

const Header = (props) => {
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
        zIndex: 1,
        backgroundColor: white,
        flexDirection: 'row',
        ...platformSpecific
    }
};

export { Header };
