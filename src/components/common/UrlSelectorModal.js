import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { storeUrls, resetUrls } from '../../actions';
import { Button, FlatTextInput } from './';
import { blackWithOpacity, midnightWithOpacity, shamrock, white } from '../../constants/Colors';

class UrlSelectorModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { url: '' };
    }

    onUrlChange = (text) => {
        this.setState({ ...this.state, url: text });
    };

    onBack = () => {
        Actions.pop();
    };

    onReset = () => {
        this.props.resetUrls();
        Actions.pop();
    };

    onApply = () => {
        this.props.storeUrls({ serverUrl: this.state.url, save: true });
        Actions.pop();
    };

    render() {
        const { style } = this.props;
        const { flexWrapper, container, row, modalWrapper, modal, buttonApply, buttonReset } = styles;

        return (
            <View style={[modalWrapper, style]}>
                <View style={[modal, container]}>
                    <View style={[flexWrapper]}>
                        <FlatTextInput
                            value={this.state.url}
                            lowercase
                            placeholder='Введите URL сервера...'
                            onChangeText={this.onUrlChange.bind(this)}
                            theme='dark'
                        />
                    </View>
                    <View style={row}>
                        <Button style={buttonApply} onPress={this.onApply.bind(this)}>
                            Применить
                        </Button>
                        <Button style={buttonReset} onPress={this.onReset.bind(this)} color='black'>
                            Сбросить
                        </Button>
                        <Button style={buttonReset} onPress={this.onBack.bind(this)} color='black'>
                            Отменить
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    flexWrapper: {
        flex: 1
    },
    container: {
        padding: 20
    },
    row: {
        flexDirection: 'row'
    },
    modalWrapper: {
        position: 'absolute',
        width: '100%',
        backgroundColor: blackWithOpacity,
        alignItems: 'center',
        paddingTop: 60
    },
    modal: {
        width: 500,
        height: 150,
        backgroundColor: midnightWithOpacity,
        borderRadius: 10
    },
    buttonApply: {
        backgroundColor: shamrock,
        flex: 1
    },
    buttonReset: {
        backgroundColor: white,
        flex: 1,
        marginLeft: 15
    }
};

export default connect(null, { storeUrls, resetUrls })(UrlSelectorModal);
