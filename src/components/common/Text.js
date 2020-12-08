import React from 'react';
import { Text as VanillaText } from 'react-native';

const Text = (props) => {
    return (
        <VanillaText numberOfLines={props.numberOfLines} style={[styles.text, props.style]}>
            {props.children}
        </VanillaText>
    );
};

const styles = {
    text: {
        color: 'black'
    }
};

export { Text };
