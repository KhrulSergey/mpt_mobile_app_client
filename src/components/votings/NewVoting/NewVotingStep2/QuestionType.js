import React, { PureComponent } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { updateQuestionType } from '../../../../actions';
import { Text } from '../../../common';
import { radioButtonOn, radioButtonOff } from '../../../../constants/Icons';

import styles from './styles';

class QuestionType extends PureComponent {
    renderRadioButton(type) {
        const { radioButton } = styles;

        return this.props.question.type === type ?
            <Icon name={radioButtonOn} style={radioButton} />
            :
            <Icon name={radioButtonOff} style={radioButton} />;
    }

    onSelectAnswerType = (questionId, type) => {
        this.props.updateQuestionType({ questionId, type });
    };

    getAnswerTypeText = (answerType) => {
        switch (answerType) {
            case 'single':
                return 'Выбор одного (radio)';
            case 'multiple':
                return 'Выбор нескольких (checkbox)';
            case 'text':
                return 'Текстовый ответ';
            default:
                return null;
        }
    };

    render() {
        const { type, question } = this.props;

        const { row, alignItemsCenter, questionTypeText } = styles;

        return (
            <TouchableWithoutFeedback onPress={this.onSelectAnswerType.bind(this, question._id, type)}>
                <View style={[row, alignItemsCenter]}>
                    {this.renderRadioButton(type)}
                    <Text style={questionTypeText}>
                        {this.getAnswerTypeText(type)}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default connect(null, { updateQuestionType })(QuestionType);
