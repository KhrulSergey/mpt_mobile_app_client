import React, { PureComponent } from 'react';
import { TextInput as VanillaTextInput, StyleSheet } from 'react-native';

class TextInput extends PureComponent {
    render() {
        const { value, onChangeText, placeholder, editable, style } = this.props;

        return (
            <VanillaTextInput
                placeholder={placeholder}
                placeholderTextColor='gray'
                underlineColorAndroid='transparent'
                autoCapitalize='sentences'
                // autoCorrect={false}
                multiline
                style={[styles.textInput, style]}
                value={value}
                onChangeText={onChangeText}
                editable={editable === undefined ? true : editable}
                maxLength={255}
            />
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 42,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: 'white',
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 12
    },
});

export { TextInput };
