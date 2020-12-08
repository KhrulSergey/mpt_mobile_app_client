import truncate from 'lodash-es/truncate';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from './';
import { del } from '../../constants/Icons';

const Tag = (props) => {
    const { onPress, text, style } = props;
    const { container, textStyle, button, icon } = styles;

    return (
        <View style={[container, style]}>
            <Text style={textStyle}>
                {truncate(text, { length: 35, separator: ' ' })}
            </Text>
            <TouchableOpacity onPress={onPress} style={button}>
                <Icon name={del} style={icon} />
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    container: {
        backgroundColor: 'white',
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        paddingHorizontal: 10,
        margin: 3,
        minHeight: 36
    },
    textStyle: {
        maxWidth: '96%'
    },
    button: {
        paddingLeft: 10,
        top: 2,
        backgroundColor: 'transparent'
    },
    icon: {
        fontSize: 36,
        color: 'gray'
    }
};

export { Tag };
