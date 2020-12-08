import React, { PureComponent } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

class Input extends PureComponent {
    render() {
        const { label, value, onChangeText, placeholder, secureTextEntry } = this.props;
        const { inputStyle, labelStyle, container } = styles;

        return (
            <View style={container}>
                <Text style={labelStyle}>{label}</Text>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor='gray'
                    underlineColorAndroid='white'
                    autoCorrect={false}
                    secureTextEntry={secureTextEntry}
                    style={inputStyle}
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputStyle: {
        color: 'white',
        paddingRight: 5,
        paddingLeft: 5,
        fontSize: 14,
        lineHeight: 23,
        flex: 2
    },
    labelStyle: {
        color: 'white',
        fontSize: 14,
        paddingLeft: 20,
        flex: 1
    },
    container: {
        height: 40,
        width: 500,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export { Input };
