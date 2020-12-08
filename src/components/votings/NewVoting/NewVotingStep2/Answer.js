import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput } from '../../../common';
import { answerTextChanged, deleteAnswer } from '../../../../actions';
import { del } from '../../../../constants/Icons';

import styles from './styles';

class Answer extends PureComponent {
    onAnswerChange = (text) => {
        const { question, index } = this.props;
        this.props.answerTextChanged({ questionId: question._id, index, text });
    };

    onDeleteAnswer = () => {
        this.props.deleteAnswer(this.props.question._id, this.props.answer._id);
    };

    render() {
        const { index, answer } = this.props;
        const { text, isEmpty } = answer;

        const { flexWrapper, row, textInput, textInputInvalid, buttonDeleteAnswer, buttonDeleteAnswerIcon, marginBottom } = styles;

        return (
            <View style={row}>
                <TextInput
                    style={[flexWrapper, textInput, marginBottom, isEmpty && textInputInvalid]}
                    placeholder={`Текст ответа ${index + 1}`}
                    onChangeText={this.onAnswerChange.bind(this)}
                    value={text}
                />
                <TouchableOpacity onPress={this.onDeleteAnswer.bind(this)}>
                    <View style={buttonDeleteAnswer}>
                        <Icon name={del} style={buttonDeleteAnswerIcon} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect(null, { answerTextChanged, deleteAnswer })(Answer);
