import React from 'react';
import { View } from 'react-native';
import { Text } from './';

const EmptyIndicator = (props) => {
    const { container, text } = styles;

    return (
        <View style={[container, props.style]}>
            <Text style={text}>
                {props.text}
            </Text>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'gray'
    }
};

export { EmptyIndicator };
