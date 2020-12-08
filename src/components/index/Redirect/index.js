import React, { PureComponent } from 'react';
import { Image, ImageBackground, View, Platform, Dimensions, TouchableWithoutFeedback, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { loginUser, storeDimensions, storeUrls } from '../../../actions';
import { Button, Text } from '../../common';

import styles from './styles';

class Redirect extends PureComponent {
    constructor(props) {
        super(props);
        this.gispClicks = 0;
        this.user = {};
    }

    componentWillMount() {
        this.user = {
            uid: Platform.OS === 'ios' ? DeviceInfo.getUniqueID() : DeviceInfo.isEmulator() ? DeviceInfo.getInstanceID() : DeviceInfo.getSerialNumber()
        };
        AsyncStorage.getItem('gispServerUrl')
            .then((serverUrl) => {
                if (serverUrl) {
                    this.props.storeUrls({ serverUrl });
                }
            })
            .catch(console.log);
        this.props.loginUser(this.user);
        this.props.storeDimensions(Dimensions.get('window'));
    }

    onButtonPress = () => {
        this.props.loginUser(this.user);
    };

    onGispPress() {
        this.gispClicks += 1;
        if (this.gispClicks === 10) {
            this.gispClicks = 0;
            Actions.urlSelectorModal({ style: { height: this.props.dimensions.height } });
        }
    }

    render() {
        console.log('********************************* Redirect component render');
        const { loading, noInternet, noPermissions, serverError } = this.props.auth;
        console.log(loading, noInternet, noPermissions, serverError);
        const {
            flexWrapper,
            backgroundImage,
            row,
            justifyContentCenter,
            gispLogo,
            eagleLogo,
            paddingBottom,
            registerText,
            button
        } = styles;

        return (
            <View style={flexWrapper}>
                {(noInternet || serverError) ?
                    <ImageBackground source={require('../../../images/Background.png')} style={[flexWrapper, backgroundImage]}>
                        <View style={flexWrapper}>
                            <View style={[flexWrapper, row]}>
                                <View style={[flexWrapper, justifyContentCenter, paddingBottom]}>
                                    <View style={justifyContentCenter}>
                                        <Image source={require('../../../images/Eagle.png')} style={eagleLogo} />
                                        <TouchableWithoutFeedback style={gispLogo} onPress={this.onGispPress.bind(this)}>
                                            <Image source={require('../../../images/GISP.png')} style={gispLogo} />
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={[justifyContentCenter, paddingBottom]}>
                                        <Text style={registerText}>
                                            Проблема доступа к серверу!
                                        </Text>
                                        <Text style={registerText}>
                                            Проверьте соединение с интернетом.
                                        </Text>
                                    </View>
                                    <Button onPress={this.onButtonPress.bind(this)} style={button} loadingIndicator={loading} loadingText='Вход...'>
                                        Повторить
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                : noPermissions ?
                    <Image source={require('../../../images/Background.png')} style={[flexWrapper, backgroundImage]}>
                        <View style={flexWrapper}>
                            <View style={[flexWrapper, row]}>
                                <View style={[flexWrapper, justifyContentCenter, paddingBottom]}>
                                    <View style={justifyContentCenter}>
                                        <Image source={require('../../../images/Eagle.png')} style={eagleLogo} />
                                        <TouchableWithoutFeedback style={gispLogo} onPress={this.onGispPress.bind(this)}>
                                            <Image source={require('../../../images/GISP.png')} style={gispLogo} />
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={[justifyContentCenter, paddingBottom]}>
                                        <Text style={registerText}>
                                            У вас недостаточно прав для доступа к системе!
                                        </Text>
                                        <Text style={registerText}>
                                            Пожалуйста, свяжитесь с администратором.
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Image>
                :
                    <View style={[flexWrapper, { backgroundColor: 'transparent' }]} />
                }
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        dimensions: state.device.dimensions
    };
};

export default connect(mapStateToProps, { loginUser, storeDimensions, storeUrls })(Redirect);
