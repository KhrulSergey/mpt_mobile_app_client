import React, { PureComponent } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import AnswerListItem from './AnswerListItem';
import { Button, Text, TextInput } from '../../common';
import { updateVotingAnswer, vote } from '../../../actions';

import styles from './styles';

class QuestionListItem extends PureComponent {
    onTextAnswerChange(answer) {
        const { question } = this.props;
        this.props.updateVotingAnswer({ question, answer });
    }

    keyExtractor = (item) => (this.props.preview ? item._id : item.id).toString();

    renderItem = ({ item }) => {
        console.log('item', item);
        return <AnswerListItem question={this.props.question} answer={item} preview={this.props.preview} />;
    };

    renderQuestionContent() {
        const { question, preview, period } = this.props;
        const { type } = question;

        if (type === 'multiple' || type === 'single') {
            const { answers } = question;
            return (
                <FlatList
                    data={answers}
                    keyExtractor={this.keyExtractor.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                />
            );
        } else if (type === 'text') {
            const { answer, isVoted } = question;
            return (
                <TextInput
                    style={styles.textInput}
                    placeholder='Текст ответа'
                    onChangeText={preview ? null : this.onTextAnswerChange.bind(this)}
                    value={answer}
                    editable={!isVoted && period !== 'past'}
                />
            );
        }
    }

    onButtonPress() {
        const { voting, question } = this.props;

        this.props.vote({ voting, question });
    }

    renderButton() {
        const { question, preview, period } = this.props;

        const { button } = styles;

        if (!(question.isVoted || preview || period === 'past')) {
            return (
                <Button style={button} onPress={this.onButtonPress.bind(this)} loading={question.voting} loadingText='Голосуем...'>
                    Голосовать
                </Button>
            );
        }
    }

    render() {
        const { text } = this.props.question;

        const { container, questionWrapper, questionText, answersWrapper } = styles;

        return (
            <View>
                <View style={[container, questionWrapper]}>
                    <Text style={questionText}>
                        {`${this.props.index}. ${text}`}
                    </Text>
                </View>
                <View style={[container, answersWrapper]}>
                    {this.renderQuestionContent()}
                    <View>
                        {this.renderButton()}
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state, props) => {
    return { voting: props.preview ? state.newVoting : state.voting };
};

export default connect(mapStateToProps, { updateVotingAnswer, vote })(QuestionListItem);
