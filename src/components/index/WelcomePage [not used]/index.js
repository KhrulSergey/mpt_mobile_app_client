import React, { PureComponent } from 'react';
import { Text, View, Image, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { authLoggedInUser, storeDimensions } from '../../../actions/index';

import styles from './styles';

class WelcomePage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { dimensions: undefined };
    }

    componentWillMount() {
        AsyncStorage.getItem('user')
            .then((userData) => {
                console.log('user data (raw)', userData);
                if (userData) {
                    setTimeout(() => {
                        const user = JSON.parse(userData);
                        this.props.authLoggedInUser(user);
                        Actions.main({ type: 'reset', leftButtonSize: 0 });
                    }, 1000);
                } else {
                    setTimeout(() => {
                        Actions.auth({ type: 'reset' });
                    }, 1000);
                }
            })
            .catch((error) => {
                console.log(error);
                Actions.auth({ type: 'reset' });
            });
    }

    onLayout = event => {
        if (this.state.dimensions) return;
        const { width, height } = event.nativeEvent.layout;
        this.setState({ dimensions: { width, height } });
        this.props.storeDimensions({ width, height });
    };

    render() {
        if (this.state.dimensions) {
            const { width, height } = this.state.dimensions;
            console.log('width: ', width, 'height: ', height);
        }

        const {
            backgroundImage,
            container,
            welcomeTextWrapper,
            welcomeText,
            nameText,
            textWhite,
            eagleFlat,
            gispLogo,
            bottomPanel,
            bottomCol,
            wrapper,
            fingerImg,
            row,
            flexCenter,
            authText,
            authTextWrapper
        } = styles;

        return (
            <Image source={require('../../../images/Background.png')} style={backgroundImage} onLayout={this.onLayout}>
                <View style={wrapper}>
                    <View style={container}>
                        <Image source={require('../../../images/Eagle.png')} style={eagleFlat} />
                        <View style={welcomeTextWrapper}>
                            <Text style={[textWhite, welcomeText]}>
                                Добро пожаловать в Личный Кабинет
                            </Text>
                            <Text style={[textWhite, welcomeText]}>
                                Министерство Промышленности и Торговли
                            </Text>
                        </View>
                        {/*<Text style={[textWhite, nameText]}>
                            {this.props.user.name}
                        </Text>*/}
                    </View>
                    <View style={bottomPanel}>
                        <View style={[bottomCol, row]}>
                            {/*<Image source={require('../../images/Finger.png')} style={fingerImg} />
                            <View style={authTextWrapper}>
                                <Text style={authText}>
                                    Аутентифицируйтесь с помощью
                                </Text>
                                <Text style={authText}>
                                    проверки отпечатка пальца
                                </Text>
                            </View>*/}
                        </View>
                        <View style={[bottomCol, flexCenter]}>
                            <Image source={require('../../../images/GISP.png')} style={gispLogo} />
                        </View>
                        <View style={bottomCol} />
                    </View>
                </View>
            </Image>
        );
    }
}

export default connect(null, { authLoggedInUser, storeDimensions })(WelcomePage);
