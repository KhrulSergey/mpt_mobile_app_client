import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchVoting } from '../../../actions';
import { renderTitle } from '../../../Router';
import { IconEncircled, Text } from '../../common';
import { checkmark, checkmarkEncircled, forward } from '../../../constants/Icons';

import styles from './styles';

class VotingListItem extends PureComponent {
    onRowPress() {
        const { user, voting, period } = this.props;
        const { id, view_count } = voting;
        if (user.role === 'manager') {
            this.props.fetchVoting({ id, actionType: 'vote', new: !view_count, companyId: user.company_id });
            Actions.voting({ id, period, new: !view_count, companyId: user.company_id });
        } else if (user.role === 'admin') {
            if (period === 'future') {
                Actions.newVoting({ renderTitle: renderTitle({ title: 'Редактирование голосования' }), actionType: 'edit', id, period, new: !view_count });
            } else {
                Actions.votingResult({ id, period, new: !view_count });
            }
        }
    }

    renderSubjectNumBlock() {
        const { voting, period, user } = this.props;
        const { companies_count, companies_voted, companies_processed } = voting;

        const { row, alignItemsCenter, periodStyle, textVoted, subjectNumBlock, borderRight, checkmarkStyle, subjectNumContainer } = styles;

        if (user.role === 'admin' && period !== 'future') {
            return (
                <View style={[subjectNumBlock, row, alignItemsCenter]}>
                    <View style={[subjectNumContainer, row, alignItemsCenter, borderRight]}>
                        <Icon name={checkmark} style={checkmarkStyle} />
                        <Text style={periodStyle}>
                            {companies_voted} из {companies_count} завершили
                        </Text>
                    </View>
                    <View style={subjectNumContainer}>
                        <Text style={[periodStyle, textVoted]}>
                            {companies_processed} в процессе
                        </Text>
                    </View>
                </View>
            );
        }
    }

    render() {
        const { name, description, date_from, date_to, voted, view_count } = this.props.voting;
        const isVoted = this.props.user.role === 'manager' && voted;

        const { infoBlock, container, borderBottom, textNew, caption, descriptionStyle, periodStyle, checkmarkStyle, voteTitle, row, alignItemsCenter, textVoted } = styles;

        return (
            <TouchableOpacity activeOpacity={0.5} onPress={this.onRowPress.bind(this)}>
                <View style={infoBlock}>
                    <View style={[container, borderBottom, voteTitle, row, alignItemsCenter]}>
                        {isVoted ? <Icon name={checkmarkEncircled} style={checkmarkStyle} /> : null}
                        {!view_count &&
                            <Text style={textNew}>
                                НОВОЕ
                            </Text>
                        }
                        <Text style={[caption, isVoted ? textVoted : null]}>
                            {name}
                        </Text>
                        <IconEncircled icon={forward} />
                    </View>
                    <View style={container}>
                        <Text style={[descriptionStyle, isVoted ? textVoted : null]}>
                            {description}
                        </Text>
                        <View style={[voteTitle, row, alignItemsCenter]}>
                            <Text style={periodStyle}>
                                Активно с {date_from} до {date_to}
                            </Text>
                            {this.renderSubjectNumBlock()}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default connect(null, { fetchVoting })(VotingListItem);
