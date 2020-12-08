import React, { PureComponent } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { fetchVotings } from '../../../actions';
import VotingListItem from './VotingListItem';
import { Button, Text, Header, LoadingIndicator, EmptyIndicator } from '../../common';
import { trackById } from '../../../constants/util';

import styles from './styles';

class Votings extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { period: 'present' };
        this.userIsAdmin = props.user.role === 'admin';
        // this.periods = ['future', 'present', 'past'];
        // this.texts = ['Предстоящие', 'Активные', 'Прошедшие'];
    }

    componentDidMount() {
        console.log('Votings componentDidMount');
        this.props.fetchVotings();
    }

    onLoadMore = () => {
        const { votings, fetchVotings } = this.props;
        const { period } = this.state;
        const { current_page, last_page } = votings.data[period];
        if (current_page < last_page) {
            fetchVotings({ period, page: current_page + 1 });
        }
    };

    onSwitch = (period) => {
        this.setState({ period });
    };

    onButtonPress = () => {
        Actions.newVoting({ actionType: 'create' });
    };

    renderItem = ({ item }) => {
        return <VotingListItem voting={item} period={this.state.period} user={this.props.user} />;
    };

    renderFooter = () => {
        const { current_page, last_page } = this.props.votings.data[this.state.period];
        const { flexWrapper, footerContainer } = styles;
        return (
            current_page < last_page ?
            <View style={[flexWrapper, footerContainer]}>
                <Spinner />
            </View>
            :
            <View style={[flexWrapper, footerContainer]} />
        );
    };

    renderPeriodButton = (period, text) => {
        const { listSwitchButton, leftListSwitchButton, rightListSwitchButton, listSwitchText, listSwitchButtonActive, listSwitchButtonNotActive, listSwitchTextActive, listSwitchTextNotActive } = styles;

        let listSwitchButtonBorder = {};
        if (this.userIsAdmin) {
            if (period === 'past') {
                listSwitchButtonBorder = rightListSwitchButton;
            } else if (period === 'future') {
                listSwitchButtonBorder = leftListSwitchButton;
            }
        } else {
            if (period === 'present') {
                listSwitchButtonBorder = leftListSwitchButton;
            } else {
                listSwitchButtonBorder = rightListSwitchButton;
            }
        }

        return (
            <TouchableOpacity activeOpacity={0.5} onPress={this.onSwitch.bind(this, period)}>
                <View style={[listSwitchButton, listSwitchButtonBorder, this.state.period === period ? listSwitchButtonActive : listSwitchButtonNotActive]}>
                    <Text style={[listSwitchText, this.state.period === period ? listSwitchTextActive : listSwitchTextNotActive]}>
                        {text}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    // renderSegment = () => {
    //     const { userIsAdmin, periods, texts } = this;
    //     return (
    //         <Segment>
    //             {userIsAdmin &&
    //                 <Btn first={userIsAdmin} active={this.state.period === periods[0]} onPress={this.onSwitch.bind(this, periods[0])}>
    //                     <Text>{texts[0]}</Text>
    //                 </Btn>
    //             }
    //             <Btn first={!userIsAdmin} active={this.state.period === periods[1]} onPress={this.onSwitch.bind(this, periods[1])}>
    //                 <Text>{texts[1]}</Text>
    //             </Btn>
    //             <Btn last active={this.state.period === periods[2]} onPress={this.onSwitch.bind(this, periods[2])}>
    //                 <Text>{texts[2]}</Text>
    //             </Btn>
    //         </Segment>
    //     );
    // };

    render() {
        const { votings } = this.props;

        const { header, flexWrapper, row, alignItemsCenter, alignItemsEnd, button } = styles;

        return (
            <View style={flexWrapper}>
                {votings.fetching ?
                    <LoadingIndicator />
                    :
                    <View style={flexWrapper}>
                        <Header style={[header, alignItemsCenter]}>
                            <View style={flexWrapper} />
                            <View style={[flexWrapper, alignItemsCenter]}>
                                <View style={row}>
                                    {
                                        this.userIsAdmin &&
                                        this.renderPeriodButton('future', 'Предстоящие')
                                    }
                                    {this.renderPeriodButton('present', 'Активные')}
                                    {this.renderPeriodButton('past', 'Прошедшие')}
                                </View>
                            </View>
                            <View style={[flexWrapper, alignItemsEnd]}>
                                {
                                    this.userIsAdmin &&
                                    <Button onPress={this.onButtonPress.bind(this)} style={button}>
                                        Создать голосование
                                    </Button>
                                }
                            </View>
                        </Header>
                        {votings && votings.data && votings.data[this.state.period] && votings.data[this.state.period].data && votings.data[this.state.period].data.length > 0 ?
                            <FlatList
                                data={votings.data[this.state.period].data}
                                keyExtractor={trackById}
                                renderItem={this.renderItem.bind(this)}
                                ListFooterComponent={this.renderFooter.bind(this)}
                                onEndReached={this.onLoadMore.bind(this)}
                                onEndReachedThreshold={0.1}
                            />
                            :
                            <EmptyIndicator text='Нет голосований для выбранного периода.' />
                        }
                    </View>
                }
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { votings: state.votings, user: state.auth.user };
};

export default connect(mapStateToProps, { fetchVotings })(Votings);
