import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { back } from '../../constants/Icons';

const BackButton = (props) => {
    const { iconStyle } = styles;

    return (
        <TouchableOpacity onPress={props.onPress}>
            <Icon name={back} style={iconStyle} />
        </TouchableOpacity>
    );
};

const styles = {
    iconStyle: {
        fontSize: 36,
        color: 'white',
        top: -4
    }
};

export { BackButton };
