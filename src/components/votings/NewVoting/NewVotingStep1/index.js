import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { toast } from '../../../../constants/util';
import { changeVotingCurrentStep, updateVoting, votingNameChanged, votingDescriptionChanged, setVotingActiveDate } from '../../../../actions';
import { Text, Button, Footer, FlatTextInput } from '../../../common';

import styles from './styles';

class NewVotingStep1 extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isDateTimeFromPickerVisible: false,
            isDateTimeToPickerVisible: false,
            isKeyboardShown: false
        };
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.voting.nameOrDescriptionEmpty && this.props.voting.nameOrDescriptionEmpty !== nextProps.voting.nameOrDescriptionEmpty) {
            toast('Название и описание голосования обязательны к заполнению!');
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

    showDateTimePicker = (period) => this.setState({ ...this.state, [period === 'from' ? 'isDateTimeFromPickerVisible' : 'isDateTimeToPickerVisible']: true });

    hideDateTimePicker = (period) => this.setState({ ...this.state, [period === 'from' ? 'isDateTimeFromPickerVisible' : 'isDateTimeToPickerVisible']: false });

    handleDatePicked = (period, date) => {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!! A date has been picked: ', period, date);
        this.props.setVotingActiveDate({ period, date });
        this.hideDateTimePicker(period);
    };

    onProceed = () => {
        this.props.changeVotingCurrentStep(2);
    };

    onNameChange = (text) => {
        this.props.votingNameChanged(text);
    };

    onDescriptionChange = (text) => {
        this.props.votingDescriptionChanged(text);
    };

    renderDateTimePickerButton = (period) => {
        const { date_from, date_to } = this.props.voting.data;
        const { paddingBottom, caption, dateText } = styles;

        return (
            <View style={paddingBottom}>
                <Text style={caption}>
                    {period === 'from' ? 'Дата начала:' : 'Дата окончания:'}
                </Text>
                <TouchableOpacity onPress={this.showDateTimePicker.bind(this, period)}>
                    <Text style={dateText}>
                        {period === 'from' ? date_from.formatted : date_to.formatted}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const { data } = this.props.voting;
        const { name, description, date_from, date_to } = data;
        const { isDateTimeFromPickerVisible, isDateTimeToPickerVisible, isKeyboardShown } = this.state;

        const { container, flexWrapper, footer, footerButton } = styles;

        return (
            <View style={flexWrapper}>
                <View style={[container, flexWrapper]}>
                    <FlatTextInput
                        label='Введите название голосования:'
                        value={name}
                        placeholder='Наименование голосования'
                        onChangeText={this.onNameChange.bind(this)}
                        theme='light'
                    />
                    <FlatTextInput
                        label='Описание голосования:'
                        value={description}
                        placeholder='Текст описания'
                        onChangeText={this.onDescriptionChange.bind(this)}
                        multiline
                        theme='light'
                    />
                    {this.renderDateTimePickerButton('from')}
                    {this.renderDateTimePickerButton('to')}
                    <DateTimePicker
                        isVisible={isDateTimeFromPickerVisible}
                        onConfirm={this.handleDatePicked.bind(this, 'from')}
                        onCancel={this.hideDateTimePicker.bind(this, 'from')}
                        date={date_from.raw}
                        mode='date'
                        cancelTextIOS='Отмена'
                        confirmTextIOS='Применить'
                        titleIOS='Выберите дату'
                    />
                    <DateTimePicker
                        isVisible={isDateTimeToPickerVisible}
                        onConfirm={this.handleDatePicked.bind(this, 'to')}
                        onCancel={this.hideDateTimePicker.bind(this, 'to')}
                        date={date_to.raw}
                        mode='date'
                        cancelTextIOS='Отмена'
                        confirmTextIOS='Применить'
                        titleIOS='Выберите дату'
                    />
                </View>
                {!isKeyboardShown &&
                    <Footer style={footer}>
                        <Button style={footerButton} onPress={this.onProceed.bind(this)}>
                            Сохранить и продолжить
                        </Button>
                    </Footer>
                }
            </View>
        );
    }
}

export default connect(null, { changeVotingCurrentStep, updateVoting, votingNameChanged, votingDescriptionChanged, setVotingActiveDate })(NewVotingStep1);
