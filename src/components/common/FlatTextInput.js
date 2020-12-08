import React from 'react';
import { View, Platform } from 'react-native';
import { Item, Input } from 'native-base';
import { Text } from './';
import { black, mystic, shuttleGray, white } from '../../constants/Colors';

const FlatTextInput = (props) => {
    const { textInputWrapper, textInput } = styles;

    const { label, value, placeholder, onChangeText, theme, multiline, lowercase } = props;

    let placeholderTextColor,
        borderBottomColor,
        color;
        // height = label ? multiline ? 156 : 56 : multiline ? 144 : 44;
    const height = Platform.OS === 'ios' ? 36 : 46;
    if (theme === 'light') {
        placeholderTextColor = mystic;
        borderBottomColor = mystic;
        color = black;
    } else if (theme === 'dark') {
        placeholderTextColor = shuttleGray;
        borderBottomColor = shuttleGray;
        color = white;
    }

    return (
        <View style={[textInputWrapper, { borderBottomColor }]}>
            {label &&
                <Text>
                    {label}
                </Text>
            }
            <Item>
                <Input
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    underlineColorAndroid='transparent'
                    style={[textInput, { color }, multiline ? { minHeight: height, paddingBottom: 5 } : { height }]}
                    multiline={multiline}
                    // numberOfLines={1}
                    autoCapitalize={lowercase ? 'none' : 'sentences'}
                    autoCorrect={!lowercase}
                    onChangeText={onChangeText}
                    value={value}
                    // maxLength={multiline ? 511 : 255}
                />
            </Item>
        </View>
    );
};

const styles = {
    textInputWrapper: {
        borderBottomWidth: 1,
        marginBottom: 20
    },
    textInput: {
        fontSize: 18
    },
};

export { FlatTextInput };
