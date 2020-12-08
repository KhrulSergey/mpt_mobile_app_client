import React, { PureComponent } from 'react';
import { View, DatePickerAndroid } from 'react-native';
import { connect } from 'react-redux';
import { setVotingActiveDate } from '../../../actions/index';
import { Button, Text } from '../../common/index';

import styles from './styles';

class CreateVotingStep3 extends PureComponent {
    async renderDatePicker() {
        const { period, date } = this.props;

        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: new Date(date.year, date.month, date.day)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                this.props.setVotingActiveDate(period, { year, month, day });
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', code, message);
        }
    }

    formatDate = date => {
        const { year, day } = date;
        const month = date.month + 1;
        const formatNumber = number => number < 10 ? `0${number}` : number;
        return `${formatNumber(day)}.${formatNumber(month)}.${year}`;
    };

    render() {
        const { date, period } = this.props;

        const { flexCenter, row, textWrapper, text, label, button } = styles;

        return (
            <View style={flexCenter}>
                <View style={[row, textWrapper]}>
                    <Text style={text}>
                        {period === 'start' ? 'Дата начала:' : 'Дата окончания:'}
                    </Text>
                    <Text style={[text, label]}>
                        {this.formatDate(date)}
                    </Text>
                </View>
                <Button onPress={this.renderDatePicker.bind(this)} style={button}>
                    {period === 'start' ? 'Изменить дату начала' : 'Изменить дату окончания'}
                </Button>
            </View>
        );
    }
}

export default connect(null, { setVotingActiveDate })(CreateVotingStep3);
