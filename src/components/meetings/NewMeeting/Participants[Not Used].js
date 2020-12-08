import React, { PureComponent } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Item, Input, Icon, Spinner } from 'native-base';
import { connect } from 'react-redux';
import Participant from './Participant';
import User from './User';
import { fetchUsersMeeting } from '../../../actions';
import { Text, Button } from '../../common';
import { closeEncircled } from '../../../constants/Icons';

import styles from './styles';

class Participants extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { pattern: '', isUserFoundListShown: false };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.meeting.fetchingUsers && !nextProps.meeting.fetchingUsers && !nextProps.meeting.fetchingUsersError) {
            this.setState({ ...this.state, isUserFoundListShown: true });
        }
        if (nextProps.meeting.data.users.length > this.props.meeting.data.users.length) {
            this.setState({ ...this.state, isUserFoundListShown: false });
        }
    }

    onPress = () => {
        this.setState({ pattern: '', isUserFoundListShown: false });
    };

    onFocus = () => {
        if (this.props.meeting.data.users.length > 0) {
            this.setState({ ...this.state, isUserFoundListShown: true });
        }
    };

    onUsersPatternChange = (pattern) => {
        this.setState({ pattern });
        if (pattern && pattern.length > 2) {
            clearTimeout(this.timerId);
            this.timerId = setTimeout(() => this.props.fetchUsersMeeting({ pattern }), 1000);
        }
    };

    renderUsersFound = () => {
        const { usersFound } = this.props.meeting;
        const { flexWrapper, usersFoundWrapper } = styles;
        return (
            <ScrollView style={[flexWrapper, usersFoundWrapper, { height: 40 * usersFound.length, top: this.state.isUserFoundListShown ? 0 : 2000 }]}>
                {usersFound.map(((item) => <User key={item.id} item={item} />))}
            </ScrollView>
        );
    };

    renderParticipants = () => {
        const { flexWrapper, textWrapper } = styles;
        return (
            <View style={[flexWrapper, this.state.isUserFoundListShown && { marginTop: 30 * this.props.meeting.usersFound.length }]}>
                <Text style={textWrapper}>
                    Список участников:
                </Text>
                {this.props.meeting.data.users.map(((item) => <Participant key={item.id} item={item} />))}
            </View>
        );
    };

    render() {
        const { flexWrapper, caption, paddingRight, paddingBottom } = styles;

        return (
            <View>
                <Text style={caption}>
                    Пригласить участников совещания
                </Text>
                <Item regular>
                    <Input placeholder='Найти пользователя' value={this.state.pattern} onChangeText={this.onUsersPatternChange.bind(this)} onFocus={this.onFocus.bind(this)} />
                    {this.props.meeting.fetchingUsers ?
                        <Spinner size='small' style={paddingRight} />
                        :
                        <TouchableOpacity onPress={this.onPress.bind(this)}>
                            <Icon name={closeEncircled} />
                        </TouchableOpacity>
                    }
                </Item>
                <View style={[flexWrapper, paddingBottom]}>
                    {this.renderParticipants()}
                    {this.renderUsersFound()}
                </View>
            </View>
        );
    }
}

export default connect(null, { fetchUsersMeeting })(Participants);
