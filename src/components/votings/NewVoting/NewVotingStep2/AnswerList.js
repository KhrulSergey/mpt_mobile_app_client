import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Answer from './Answer';
import { addAnswer } from '../../../../actions';
import { Button } from '../../../common';

import styles from './styles';

class AnswerList extends PureComponent {

    renderAnswerList = () => {
        return this.props.answers.map(((item, index) => {
            return <Answer key={item._id} voting={this.props.voting} question={this.props.question} index={index} answer={item} />;
        }));
    };

    onAddAnswer = () => {
        this.props.addAnswer(this.props.question._id);
    };

    render() {
        return (
            <View>
                {this.renderAnswerList()}
                <Button onPress={this.onAddAnswer.bind(this)} style={styles.button}>
                    Добавить ответ
                </Button>
            </View>
        );
    }
}

export default connect(null, { addAnswer })(AnswerList);
