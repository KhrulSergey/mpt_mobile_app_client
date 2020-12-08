import React, { PureComponent } from 'react';
import { Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { getDeclinedUnit } from '../../../constants/util';
import { fetchRefs, fetchRefsSuccess, fetchCounters } from '../../../actions';
import { menu } from '../../../constants/Icons';

import styles from './styles';

class Menu extends PureComponent {
    constructor(props) {
        super(props);
        this.cases = { nom: 'новое событие', gen: 'новых события', plu: 'новых событий' };
        this.gispClicks = 0;
    }

    componentDidMount() {
        console.log('Menu componentDidMount');
        if (this.props.initialized) {
            this.props.fetchCounters();
        } else if (!this.props.refs) {
            this.props.fetchRefs();
            // AsyncStorage.getItem('gispRefs')
            //     .then((refsData) => {
            //         if (refsData) {
            //             const refs = JSON.parse(refsData);
            //             console.log('refsData', refs);
            //             this.props.fetchRefsSuccess({ data: refs });
            //         } else {
            //             console.log('refsData go fetch');
            //             this.props.fetchRefs();
            //         }
            //     })
            //     .catch((error) => {
            //         console.log('refsData error', error);
            //         this.props.fetchRefs();
            //     });
        }
        Keyboard.dismiss();
    }

    goToAnalytics() {
        const { user } = this.props.auth;
        if (user.role === 'admin') {
            Actions.map();
        } else if (user.role === 'manager') {
            Actions.company({
                id: user.company_id,
                onLeft: () => Actions.menu({ initialized: true }),
                onBack: () => Actions.menu({ initialized: true }),
                backButtonImage: menu,
                leftButtonIconStyle: { width: 30, height: 24, resizeMode: 'contain' }
            });
        }
    }

    goToVotings() {
        Actions.votings();
    }

    goToMeetings() {
        Actions.meetings();
    }

    onGispPress() {
        const { heightWithoutNavbar, navbarHeight } = this.props.dimensions;
        this.gispClicks += 1;
        if (this.gispClicks === 10) {
            this.gispClicks = 0;
            Actions.urlSelectorModal({ style: { height: heightWithoutNavbar, marginTop: navbarHeight } });
        }
    }

    render() {
        console.log('********************************* Menu component render');
        const { user, counters } = this.props.auth;
        const { newVotings, newMeetings } = counters;

        const { flexWrapper, container, menuList, menuListItem, borderRight, image, menuListItemText, eventNumBlock, eventNumText, footer, gispLogo } = styles;

        return (
            <View style={[flexWrapper, container]}>
                <View style={[flexWrapper, menuList]}>
                    <View style={[flexWrapper, borderRight]}>
                        <TouchableOpacity style={flexWrapper} onPress={this.goToAnalytics.bind(this)}>
                            <View style={[flexWrapper, menuListItem]}>
                                <Image source={require('../../../images/analytics.png')} style={image} />
                                <Text style={menuListItemText}>
                                    {user.role === 'admin' ? 'Аналитика' : 'Предприятие'}
                                </Text>
                                <View style={eventNumBlock} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[flexWrapper, borderRight]}>
                        <TouchableOpacity style={flexWrapper} onPress={this.goToVotings.bind(this)}>
                            <View style={[flexWrapper, menuListItem]}>
                                <Image source={require('../../../images/vote.png')} style={image} />
                                <Text style={menuListItemText}>
                                    Голосования
                                </Text>
                                <View style={eventNumBlock}>
                                    {newVotings > 0 &&
                                    <Text style={eventNumText}>
                                        {`${newVotings} ${getDeclinedUnit(newVotings, this.cases)}`}
                                    </Text>
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={flexWrapper} onPress={this.goToMeetings.bind(this)}>
                        <View style={[flexWrapper, menuListItem]}>
                            <Image source={require('../../../images/meeting.png')} style={image} />
                            <Text style={menuListItemText}>
                                Совещания
                            </Text>
                            <View style={eventNumBlock}>
                                {newMeetings > 0 &&
                                <Text style={eventNumText}>
                                    {`${newMeetings} ${getDeclinedUnit(newMeetings, this.cases)}`}
                                </Text>
                                }
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={footer}>
                    <TouchableWithoutFeedback style={gispLogo} onPress={this.onGispPress.bind(this)}>
                        <Image source={require('../../../images/GISP.png')} style={gispLogo} />
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        refs: state.refs.data,
        dimensions: state.device.dimensions
    };
};

export default connect(mapStateToProps, { fetchRefs, fetchRefsSuccess, fetchCounters })(Menu);
