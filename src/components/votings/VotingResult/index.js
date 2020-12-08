import React, { PureComponent } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchVoting, updateVotingViewCount } from '../../../actions';
import { Text, LoadingIndicator } from '../../common';
import QuestionListItemResult from './QuestionListItemResult';
import { trackById } from '../../../constants/util';

import styles from '../Voting/styles';

class VotingResult extends PureComponent {
    componentDidMount() {
        this.props.fetchVoting({ id: this.props.id, actionType: 'show', new: this.props.new });
    }

    componentWillReceiveProps(nextProps) {
        console.log('VotingResult componentWillReceiveProps', this.props, nextProps);
        if (nextProps.new && nextProps.voting.data.id !== this.props.voting.data.id) {
            this.props.updateVotingViewCount({ ...nextProps.voting.data, period: nextProps.period });
        }
    }

    renderItem = ({ item, index }) => {
        return <QuestionListItemResult question={item} index={index + 1} />;
    };

    render() {
        const { data, fetching } = this.props.voting;
        const { name, questions } = data;

        const { container, captionWrapper, caption } = styles;

        return (
            fetching ?
            <LoadingIndicator />
            :
            <ScrollView>
                <View style={container}>
                    <View style={captionWrapper}>
                        <Text style={caption}>
                            {name}
                        </Text>
                    </View>
                    <FlatList
                        data={questions}
                        keyExtractor={trackById}
                        renderItem={this.renderItem.bind(this)}
                    />
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return { voting: state.voting };
};

export default connect(mapStateToProps, { fetchVoting, updateVotingViewCount })(VotingResult);
