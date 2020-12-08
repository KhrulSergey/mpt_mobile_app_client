import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const IconEncircled = (props) => {
    const { circle } = styles;

    return (
        <View style={[circle, props.style]}>
            <Icon name={props.icon} size={props.size || 26} color='black' />
        </View>
    );
};

const styles = {
    circle: {
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export { IconEncircled };
