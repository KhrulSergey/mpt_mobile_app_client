import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { questionTextChanged, deleteQuestion } from '../../../../actions';
import QuestionType from './QuestionType';
import AnswerList from './AnswerList';
import { Text, Button, TextInput } from '../../../common';

import styles from './styles';

class Question extends PureComponent {
    onQuestionChange = (text) => {
        this.props.questionTextChanged({ questionId: this.props.question._id, text });
    };

    onDeleteQuestion = () => {
        this.props.deleteQuestion(this.props.question._id);
    };

    render() {
        const { index, question, voting } = this.props;
        const { text, answers, isEmpty } = question;

        const { container, flexWrapper, row, alignItemsCenter, spaceBetween, infoBlock, caption, borderTop, textInput, textInputInvalid, buttonDeleteQuestion, marginBottom } = styles;

        return (
            <View style={[infoBlock, marginBottom]}>
                <View style={container}>
                    <View style={[row, alignItemsCenter, spaceBetween, marginBottom]}>
                        <Text style={caption}>
                            Вопрос {index + 1}
                        </Text>
                        <Button style={buttonDeleteQuestion} onPress={this.onDeleteQuestion.bind(this)}>
                            <Text>Удалить вопрос</Text>
                        </Button>
                    </View>
                    <TextInput
                        style={[textInput, isEmpty && textInputInvalid]}
                        placeholder='Текст вопроса'
                        onChangeText={this.onQuestionChange.bind(this)}
                        value={text}
                    />
                </View>
                <View style={[container, borderTop]}>
                    <Text style={marginBottom}>
                        Тип ответа
                    </Text>
                    <View style={[flexWrapper, row]}>
                        <QuestionType type={'single'} question={question} voting={voting} />
                        <QuestionType type={'multiple'} question={question} voting={voting} />
                        <QuestionType type={'text'} question={question} voting={voting} />
                    </View>
                </View>
                {
                    question.type !== 'text' &&
                    <View style={[container, borderTop]}>
                        <AnswerList answers={answers} voting={voting} question={question} />
                    </View>
                }
            </View>
        );
    }
}

export default connect(null, { questionTextChanged, deleteQuestion })(Question);
