import slice from 'lodash-es/slice';
import findIndex from 'lodash-es/findIndex';
import React, { PureComponent } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { renderTitle } from '../../../Router';
import { Button, Text, IconEncircled } from '../../common';
import { forward } from '../../../constants/Icons';

import styles from './styles';

class MeetingListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.canJoin = props.user.role === 'admin' || findIndex(props.meeting.users, { id: props.user.id }) !== -1;
        // this.url = `https://kurento-meetings.herokuapp.com/?name=${this.props.user.name}&room=${this.props.meeting.room_id}`;
    }

    keyExtractor = item => `i${item.id.toString()}`;

    onItemPress = () => {
        const { meeting, user } = this.props;
        const { role, id } = user;
        if (role === 'admin' && id === meeting.user_id) {
            Actions.newMeeting({ renderTitle: renderTitle({ title: 'Редактирование совещания' }), id: meeting.id, new: !meeting.view_count, actionType: 'edit' });
        } else {
            Actions.meeting({ id: meeting.id, new: !meeting.view_count, user });
        }
    };

    goToGroupCall = () => {
        Actions.groupCall({
            username: this.props.user.name,
            room: this.props.meeting.room_id,
            meetingName: this.props.meeting.name
        });
        // Linking.canOpenURL(this.url).then(supported => {
        //     if (supported) {
        //         Linking.openURL(this.url);
        //     } else {
        //         console.log("Don't know how to open URI: " + this.url);
        //     }
        // });
    };

    renderItem = ({ item }) => {
        return (
            <Text style={[styles.text, !item.id && styles.textBlue]}>{item.name}</Text>
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
                key={index.toString(10)}
                listKey={this.keyExtractor.bind(this)}
                keyExtractor={this.keyExtractor.bind(this)}
                style={styles.flexWrapper}
                data={participantsGroup}
                renderItem={this.renderItem.bind(this)}
            />
        );
    }

    render() {
        const { date_time_caption, name, users, now, view_count } = this.props.meeting;
        const {
            infoBlock,
            infoBlockNow,
            container,
            flexWrapper,
            row,
            alignItemsCenter,
            borderBottom,
            text,
            dateStyle,
            textNew,
            caption,
            smallCaption,
            marginTop,
            clockIcon,
            dateString,
            meetingHeader,
            meetingHeaderLeft,
            button
        } = styles;

        return (
            <TouchableOpacity activeOpacity={0.5} onPress={this.onItemPress.bind(this)}>
                <View style={[infoBlock, now && infoBlockNow]}>
                    <View style={[container, borderBottom]}>
                        <View style={meetingHeader}>
                            <View style={meetingHeaderLeft}>
                                <View style={dateString}>
                                    <Icon name='md-time' style={clockIcon} />
                                    <Text style={[text, dateStyle]}>
                                        {date_time_caption}
                                        {now ? ' - ИДЁТ СЕЙЧАС' : null}
                                    </Text>
                                </View>
                                <View style={[row, alignItemsCenter]}>
                                    {!view_count &&
                                        <Text style={textNew}>
                                            НОВОЕ
                                        </Text>
                                    }
                                    <View>
                                        <Text style={caption}>
                                            {name}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <IconEncircled icon={forward} />
                            </View>
                        </View>
                    </View>
                    <View style={container}>
                        <Text style={smallCaption}>
                            Список участников:
                        </Text>
                        <View style={[flexWrapper, row]}>
                            {this.renderParticipants(users)}
                        </View>
                        {now && this.canJoin &&
                            <View style={marginTop}>
                                <Button style={button} onPress={this.goToGroupCall.bind(this)}>
                                    Присоединиться
                                </Button>
                            </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default MeetingListItem;
