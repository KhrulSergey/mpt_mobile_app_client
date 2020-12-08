import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { updateVotingAnswer, updatePreviewVotingAnswer } from '../../../actions';
import { Text } from '../../common/index';
import { checkboxOn, checkboxOff, radioButtonOn, radioButtonOff } from '../../../constants/Icons';

import styles from './styles';

class AnswerListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.answer.isVoted
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ checked: nextProps.answer.isVoted });
    }

    toggle() {
        const { question, answer, preview } = this.props;
        if (preview) {
            this.props.updatePreviewVotingAnswer({ question, answer });
        } else {
            this.props.updateVotingAnswer({ question, answer });
        }
    }

    renderCheckbox() {
        const { question } = this.props;

        const { checkbox } = styles;

        if (question.type === 'multiple') {
            return this.state.checked ?
                <Icon name={checkboxOn} style={checkbox} />
                :
                <Icon name={checkboxOff} style={checkbox} />;
        } else if (question.type === 'single') {
            return this.state.checked ?
                <Icon name={radioButtonOn} style={checkbox} />
                :
                <Icon name={radioButtonOff} style={checkbox} />;
        }
    }

    renderAnswer() {
        const { text } = this.props.answer;

        const { row, answerText } = styles;

        return (
            <View style={row}>
                {this.renderCheckbox()}
                <Text style={answerText}>
                    {text}
                </Text>
            </View>
        );
    }

    render() {
        const { question } = this.props;

        if (question.isVoted) {
            return this.renderAnswer();
        }
        return (
            <TouchableWithoutFeedback onPress={this.toggle.bind(this)}>
                {this.renderAnswer()}
            </TouchableWithoutFeedback>
        );
    }
}

const mapStateToProps = (state, props) => {
    return { voting: props.preview ? state.newVoting : state.voting };
};

export default connect(mapStateToProps, { updateVotingAnswer, updatePreviewVotingAnswer })(AnswerListItem);
