import sortBy from 'lodash-es/sortBy';
import isEqual from 'lodash-es/isEqual';
import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { changeMeetingName, changeMeetingDescription, changeMeetingDate, toggleModalVisibility } from '../../../actions';
import { Text, Button, FlatTextInput } from '../../common';

import styles from './styles';

class MeetingData extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isDateTimeFromPickerVisible: false,
            isDateTimeToPickerVisible: false
        };
        this.userIds = sortBy(props.data.users.map(user => user.id));
        this.selectedUserIds = sortBy(props.selectedUsers.map(user => user.id));
        this.showParticipantsUpdatedText = false;
    }

    componentWillReceiveProps(nextProps) {
        const newlySelectedUserIds = sortBy(nextProps.selectedUsers.map(user => user.id));
        if (!isEqual(newlySelectedUserIds, this.selectedUserIds)) {
            this.selectedUserIds = newlySelectedUserIds;
            this.showParticipantsUpdatedText = !isEqual(this.userIds, this.selectedUserIds);
        }
    }

    showDateTimePicker = (period) => this.setState({ ...this.state, [period === 'from' ? 'isDateTimeFromPickerVisible' : 'isDateTimeToPickerVisible']: true });

    hideDateTimePicker = (period) => this.setState({ ...this.state, [period === 'from' ? 'isDateTimeFromPickerVisible' : 'isDateTimeToPickerVisible']: false });

    handleDatePicked = (period, date) => {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!! A date has been picked: ', period, date);
        this.props.changeMeetingDate({ period, date });
        this.hideDateTimePicker(period);
    };

    onNameChange = (text) => {
        this.props.changeMeetingName(text);
    };

    onDescriptionChange = (text) => {
        this.props.changeMeetingDescription(text);
    };

    renderDateTimePickerButton = (period) => {
        const { date_from, date_to } = this.props.data;
        const { dateWrapper, caption, dateText } = styles;

        return (
            <View style={dateWrapper}>
                <Text style={caption}>
                    {period === 'from' ? 'Дата начала:' : 'Дата окончания:'}
                </Text>
                <TouchableOpacity onPress={this.showDateTimePicker.bind(this, period)}>
                    <Text style={dateText}>
                        {(period === 'from' ? date_from.formatted : date_to.formatted).substr(0, 16)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    toggleModal = () => {
        this.props.toggleModalVisibility('meeting-user');
        if (Actions.currentScene === 'searchModal') {
            Actions.pop();
        } else {
            const { navbarHeight, heightWithoutNavbar } = this.props.dimensions;
            Actions.searchModal({ filterType: 'meeting-user', style: { height: heightWithoutNavbar, marginTop: navbarHeight } });
        }
    };

    render() {
        const { name, description, date_from, date_to } = this.props.data;
        const { row, jcSpaceBetween, actionButton, participantsUpdatedText } = styles;

        return (
            <View>
                <FlatTextInput
                    label='Название совещания:'
                    value={name}
                    placeholder='Введите тему совещания'
                    onChangeText={this.onNameChange.bind(this)}
                    theme='light'
                />
                <View style={[row, jcSpaceBetween]}>
                    <View>
                        {this.renderDateTimePickerButton('from')}
                        {this.renderDateTimePickerButton('to')}
                    </View>
                    <View>
                        <Button style={actionButton} onPress={this.toggleModal.bind(this)}>
                            Пригласить участников
                        </Button>
                        {this.showParticipantsUpdatedText &&
                            <Text style={participantsUpdatedText}>
                                Список участников был изменен
                            </Text>
                        }
                    </View>
                </View>
                <FlatTextInput
                    label='Описание совещания:'
                    value={description}
                    placeholder='Коротко опишите повестку совещания для участников'
                    onChangeText={this.onDescriptionChange.bind(this)}
                    multiline
                    theme='light'
                />
                <DateTimePicker
                    isVisible={this.state.isDateTimeFromPickerVisible}
                    onConfirm={this.handleDatePicked.bind(this, 'from')}
                    onCancel={this.hideDateTimePicker.bind(this, 'from')}
                    date={date_from.raw}
                    mode='datetime'
                    cancelTextIOS='Отмена'
                    confirmTextIOS='Применить'
                    titleIOS='Выберите дату и время'
                />
                <DateTimePicker
                    isVisible={this.state.isDateTimeToPickerVisible}
                    onConfirm={this.handleDatePicked.bind(this, 'to')}
                    onCancel={this.hideDateTimePicker.bind(this, 'to')}
                    date={date_to.raw}
                    mode='datetime'
                    cancelTextIOS='Отмена'
                    confirmTextIOS='Применить'
                    titleIOS='Выберите дату и время'
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { dimensions: state.device.dimensions };
};

export default connect(mapStateToProps, { changeMeetingName, changeMeetingDescription, changeMeetingDate, toggleModalVisibility })(MeetingData);
