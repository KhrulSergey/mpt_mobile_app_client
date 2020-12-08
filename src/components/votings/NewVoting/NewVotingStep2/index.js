import React, { PureComponent } from 'react';
import { View, FlatList, Keyboard } from 'react-native';
import { Content } from 'native-base';
import { connect } from 'react-redux';
import { toast } from '../../../../constants/util';
import Question from './Question';
import { changeVotingCurrentStep, addQuestion } from '../../../../actions';
import { Button, Footer } from '../../../common';

import styles from './styles';

class NewVotingStep2 extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { isKeyboardShown: false };
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.voting.textEmpty && this.props.voting.textEmpty !== nextProps.voting.textEmpty) {
            toast('Все поля обязательны к заполнению!');
        } else if (nextProps.voting.countError && this.props.voting.countError !== nextProps.voting.countError) {
            toast('Неверно задано количество ответов!');
        } else if (nextProps.voting.maxAnswersError && this.props.voting.maxAnswersError !== nextProps.voting.maxAnswersError) {
            toast('Количество ответов не может быть больше 10!');
        }
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardDidShow() {
        this.setState({ ...this.state, isKeyboardShown: true });
    }

    keyboardDidHide() {
        this.setState({ ...this.state, isKeyboardShown: false });
    }

    onProceed = () => {
        this.props.changeVotingCurrentStep(3);
    };

    onAddQuestion = () => {
        this.props.addQuestion();
    };

    keyExtractor = (item) => item._id.toString();

    renderItem = ({ item, index }) => {
        return <Question key={index} index={index} voting={this.props.voting} question={item} />;
    };

    render() {
        const { data } = this.props.voting;

        const { container, flexWrapper, footer, button, buttonSave } = styles;

        return (
            <View style={flexWrapper}>
                <Content style={flexWrapper} extraHeight={130}>
                    <FlatList
                        style={[flexWrapper, container]}
                        data={data.questions}
                        extraData={this.props}
                        keyExtractor={this.keyExtractor.bind(this)}
                        renderItem={this.renderItem.bind(this)}
                    />
                </Content>
                {!this.state.isKeyboardShown &&
                    <Footer style={footer}>
                        <Button onPress={this.onAddQuestion.bind(this)} style={[button, flexWrapper]}>
                            Добавить вопрос
                        </Button>
                        <Button style={[buttonSave, flexWrapper]} onPress={this.onProceed.bind(this)}>
                            Сохранить и продолжить
                        </Button>
                    </Footer>
                }
            </View>
        );
    }
}

export default connect(null, { changeVotingCurrentStep, addQuestion })(NewVotingStep2);
