import React from 'react';
import { View } from 'react-native';
import { Spinner } from 'native-base';

const LoadingIndicator = (props) => {
    const { container } = styles;

    return (
        <View style={container}>
            <Spinner />
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export { LoadingIndicator };
