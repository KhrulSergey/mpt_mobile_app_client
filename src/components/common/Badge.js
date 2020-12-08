import React from 'react';
import { Text, View } from 'react-native';
import { shamrock } from '../../constants/Colors';

const Badge = (props) => {
    const { circle, innerText } = styles;

    return (
        <View style={[circle, props.style]}>
            <Text style={innerText}>
                {props.children}
            </Text>
        </View>
    );
};

const styles = {
    circle: {
        minWidth: 20,
        height: 20,
        borderRadius: 50,
        backgroundColor: shamrock,
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerText: {
        fontSize: 12,
        color: 'white'
    }
};

export { Badge };
