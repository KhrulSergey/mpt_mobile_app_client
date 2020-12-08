import React from 'react';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Text } from './Text';

const Button = (props) => {
    const { onPress, children, loading, loadingText, style, color } = props;
    const { button, buttonText } = styles;

    const a = typeof children === 'string' ?
        (
            <Text style={[buttonText, color && { color }]}>
                {children}
            </Text>
        )
        :
        children;

    return (
        <TouchableOpacity onPress={onPress} style={[button, style]}>
            {loading ?
                <View style={button}>
                    <ActivityIndicator
                        style={{ paddingRight: 10 }}
                        color='#AA3300'
                    />
                    <Text style={buttonText}>
                        {loadingText}
                    </Text>
                </View>
                :
                a
            }
        </TouchableOpacity>
    );
};

const styles = {
    button: {
        backgroundColor: '#707070',
        width: 250,
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white'
    }
};

export { Button };
