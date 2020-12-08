import slice from 'lodash-es/slice';
import findIndex from 'lodash-es/findIndex';
import React, { PureComponent } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { fetchMeeting, updateMeetingViewCount } from '../../../actions';
import { Text, Button, LoadingIndicator } from '../../common';
import { trackById } from '../../../constants/util';

import styles from './styles';

class Meeting extends PureComponent {
    componentDidMount() {
        this.props.fetchMeeting({ id: this.props.id, new: this.props.new, actionType: 'show' });
    }

    componentWillReceiveProps(nextProps) {
        console.log('Meeting componentWillReceiveProps', this.props, nextProps);
        if (nextProps.new && nextProps.meeting.data.id !== this.props.meeting.data.id) {
            this.props.updateMeetingViewCount(nextProps.meeting.data);
        }
    }

    goToGroupCall = () => {
        Actions.groupCall({ username: this.props.user.name, room: this.props.meeting.data.name });
    };

    renderItem = ({ item }) => {
        return (
            <Text style={styles.text}>{item.name}</Text>
        );
    };

    renderParticipants(participants) {
        const participantsDivided = [];
        const numCols = 3;
        const minLines = 3;
        if (participants.length > numCols * minLines) {
            const minColSize = Math.floor(participants.length / numCols);
            let numColsExt = participants.length % numCols;
            let k = 0;
            for (let i = 0; i < numCols; i++) {
                participantsDivided.push(slice(participants, k, k += minColSize + (numColsExt-- > 0 ? 1 : 0)));
            }
        } else {
            for (let i = 0; i < numCols; i++) {
                participantsDivided.push(slice(participants, i * minLines, i * minLines + minLines));
            }
        }
        return participantsDivided.map((participantsGroup, index) =>
            <FlatList
                key={index.toString()}
                style={styles.flexWrapper}
                data={participantsGroup}
                renderItem={this.renderItem.bind(this)}
                keyExtractor={trackById}
            />
        );
    }

    renderButton() {
        const { user, meeting } = this.props;
        const { marginTop, button } = styles;

        const canJoin = user.role === 'admin' || findIndex(meeting.data.users, { id: user.id }) !== -1;

        return meeting.data.now && canJoin &&
            <View style={marginTop}>
                <Button style={button} onPress={this.goToGroupCall.bind(this)}>
                    Присоединиться
                </Button>
            </View>;
    }

    render() {
        const { data, fetching } = this.props.meeting;
        const { date_time_caption, name, description, users, now } = data;

        const { infoBlock, infoBlockNow, container, flexWrapper, row, borderBottom, text, dateStyle, caption, smallCaption, clockIcon, dateString, meetingHeader } = styles;

        return (
            <ScrollView>
                {fetching ?
                    <LoadingIndicator />
                    :
                    <View style={container}>
                        <View style={[infoBlock, now && infoBlockNow]}>
                            <View style={[container, borderBottom]}>
                                <View style={meetingHeader}>
                                    <View>
                                        <View style={dateString}>
                                            <Icon name='md-time' style={clockIcon} />
                                            <Text style={[text, dateStyle]}>
                                                {date_time_caption}
                                                {now ? ' - ИДЕТ СЕЙЧАС' : null}
                                            </Text>
                                        </View>
                                        <Text style={caption}>
                                            {name}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[container, borderBottom]}>
                                <Text>
                                    {description}
                                </Text>
                            </View>
                            <View style={container}>
                                <Text style={smallCaption}>
                                    Список участников:
                                </Text>
                                <View style={[flexWrapper, row]}>
                                    {users && this.renderParticipants(users)}
                                </View>
                                {this.renderButton()}
                            </View>
                        </View>
                    </View>
                }
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return { meeting: state.meeting, user: state.auth.user };
};

export default connect(mapStateToProps, { fetchMeeting, updateMeetingViewCount })(Meeting);
