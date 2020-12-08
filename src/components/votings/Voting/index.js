import React, { PureComponent } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { updateVotingViewCount } from '../../../actions';
import { Text, LoadingIndicator } from '../../common';
import QuestionListItem from './QuestionListItem';

import styles from './styles';

class Voting extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (nextProps.new && nextProps.voting.data.id !== this.props.voting.data.id) {
            this.props.updateVotingViewCount({ ...nextProps.voting.data, period: nextProps.period });
        }
    }

    keyExtractor = (item) => (this.props.preview ? item._id : item.id).toString();

    renderItem = ({ item, index }) => {
        return <QuestionListItem question={item} index={index + 1} preview={this.props.preview} period={this.props.period} />;
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
                            keyExtractor={this.keyExtractor.bind(this)}
                            renderItem={this.renderItem.bind(this)}
                        />
                    </View>
                </ScrollView>
        );
    }
}

const mapStateToProps = (state, props) => {
    return { voting: props.preview ? state.newVoting : state.voting };
};

export default connect(mapStateToProps, { updateVotingViewCount })(Voting);
