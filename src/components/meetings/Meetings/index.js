import React, { PureComponent } from 'react';
import { View, FlatList } from 'react-native';
import { Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import format from 'date-fns/format';
import { fetchMeetings } from '../../../actions';
import { Text, Button, Header, LoadingIndicator, EmptyIndicator } from '../../common';
import { DATE } from '../../../constants/DateTime';
import MeetingListItem from './MeetingListItem';
import { trackById } from '../../../constants/util';

import styles from './styles';

class Meetings extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('Meetings componentDidMount');
        this.props.fetchMeetings({ page: 1 });
    }

    onLoadMore = () => {
        const { meetings, fetchMeetings } = this.props;
        const { current_page, last_page } = meetings;
        if (current_page < last_page) {
            fetchMeetings({ page: current_page + 1 });
        }
    };

    onButtonPress = () => {
        Actions.newMeeting({ actionType: 'create' });
    };

    renderItem = ({ item }) => {
        return <MeetingListItem meeting={item} user={this.props.user} />;
    };

    renderFooter = () => {
        const { current_page, last_page } = this.props.meetings;
        const { flexWrapper, footerContainer } = styles;
        return (
            current_page < last_page ?
                <View style={[flexWrapper, footerContainer]}>
                    <Spinner />
                </View>
                :
                <View style={[flexWrapper, footerContainer]}>
                </View>
        );
    };

    render() {
        const { meetings, user } = this.props;

        const { flexWrapper, header, textToday, textCaption, button } = styles;

        return (
            <View style={flexWrapper}>
                {meetings.fetching && !meetings.current_page ?
                    <LoadingIndicator />
                    :
                    <View style={[flexWrapper]}>
                        <Header style={header}>
                            <View>
                                <Text style={textToday}>
                                    Сегодня {format(Date.now(), DATE)}
                                </Text>
                                <Text style={textCaption}>
                                    Список актуальных совещаний
                                </Text>
                            </View>
                            <View>
                                {
                                    user.role === 'admin' &&
                                    <Button onPress={this.onButtonPress.bind(this)} style={button}>
                                        Создать совещание
                                    </Button>
                                }
                            </View>
                        </Header>
                        {meetings.data.length > 0 ?
                            <FlatList
                                data={meetings.data}
                                keyExtractor={trackById}
                                renderItem={this.renderItem.bind(this)}
                                ListFooterComponent={this.renderFooter.bind(this)}
                                onEndReached={this.onLoadMore.bind(this)}
                                onEndReachedThreshold={0.1}
                            />
                            :
                            <EmptyIndicator text='Нет актуальных совещаний.' />
                        }
                    </View>
                }
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { meetings: state.meetings, user: state.auth.user };
};

export default connect(mapStateToProps, { fetchMeetings })(Meetings);
