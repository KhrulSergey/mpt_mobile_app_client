import React, { PureComponent } from 'react';
import { View, Image, ImageBackground, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { loginUser } from '../../../actions';
import { Button, Text } from '../../common';

import styles from './styles';

class LoginForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isKeyboardShown: false
        };
        this.gispClicks = 0;
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardDidShow() {
        this.setState(() => {
            return { isKeyboardShown: true };
        });
    }

    keyboardDidHide() {
        this.setState(() => {
            return { isKeyboardShown: false };
        });
    }

    // onEmailChange(text) {
    //     this.props.emailChanged(text);
    // }
    //
    // onPasswordChange(text) {
    //     this.props.passwordChanged(text);
    // }

    onButtonPress() {
        this.props.loginUser({ uid: this.props.auth.uid });
    }

    openLink() {
        const { serverUrl } = this.props.urls;
        Linking.canOpenURL(serverUrl).then(supported => {
            if (supported) {
                Linking.openURL(serverUrl);
            } else {
                console.log("Don't know how to open URI: " + serverUrl);
            }
        });
    }

    onGispPress() {
        this.gispClicks += 1;
        if (this.gispClicks === 10) {
            this.gispClicks = 0;
            Actions.urlSelectorModal({ style: { height: this.props.dimensions.height } });
        }
    }

    render() {
        const { auth, urls } = this.props;
        const { code, loading } = auth;

        const {
            flexWrapper,
            backgroundImage,
            row,
            alignItemsFlexStart,
            justifyContentCenter,
            gispLogo,
            eagleLogo,
            paddingBottom,
            registerText,
            linkText,
            codeText,
            button
        } = styles;

        return (
            <ImageBackground source={require('../../../images/Background.png')} style={[flexWrapper, backgroundImage]}>
                <View style={flexWrapper}>
                    <View style={[flexWrapper, row, this.state.isKeyboardShown && alignItemsFlexStart]}>
                        <View style={[flexWrapper, justifyContentCenter, paddingBottom]}>
                            {!this.state.isKeyboardShown &&
                                <View style={justifyContentCenter}>
                                    <Image source={require('../../../images/Eagle.png')} style={eagleLogo} />
                                    <TouchableWithoutFeedback style={gispLogo} onPress={this.onGispPress.bind(this)}>
                                        <Image source={require('../../../images/GISP.png')} style={gispLogo} />
                                    </TouchableWithoutFeedback>
                                </View>
                            }
                            {code &&
                                <View style={[justifyContentCenter, paddingBottom]}>
                                    {/*<Input
                                     label='Логин'
                                     placeholder='username@example.com'
                                     onChangeText={this.onEmailChange.bind(this)}
                                     value={email}
                                     />
                                     <Input
                                     secureTextEntry
                                     label='Пароль'
                                     placeholder='password'
                                     onChangeText={this.onPasswordChange.bind(this)}
                                     value={password}
                                     />*/}
                                    <Text style={registerText}>
                                        Пожалуйста, зарегистрируйте инсталляцию вашего приложения!
                                    </Text>
                                    <View style={row}>
                                        <Text style={registerText}>
                                            Перейдите по адресу
                                        </Text>
                                        <TouchableOpacity onPress={this.openLink.bind(this)}>
                                            <Text style={[registerText, linkText]}>
                                                {urls.serverUrl}
                                            </Text>
                                        </TouchableOpacity>
                                        <Text style={registerText}>
                                            и введите этот код:
                                        </Text>
                                    </View>
                                    <Text style={codeText}>
                                        {code}
                                    </Text>
                                    <Text style={registerText}>
                                        после чего нажмите на кнопку
                                    </Text>
                                </View>
                            }
                            <Button onPress={this.onButtonPress.bind(this)} style={button} loadingIndicator={loading} loadingText='Вход...'>
                                Продолжить
                            </Button>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        urls: state.urls,
        dimensions: state.device.dimensions
    };
};

export default connect(mapStateToProps, { loginUser })(LoginForm);
