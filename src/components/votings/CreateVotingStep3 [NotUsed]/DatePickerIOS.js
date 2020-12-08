import React, { PureComponent } from 'react';
import { View, DatePickerIOS } from 'react-native';
import { connect } from 'react-redux';
import { setVotingActiveDate } from '../../../actions/index';
import { Text } from '../../common/index';

import styles from './styles';

class CreateVotingStep3 extends PureComponent {
    onDateChange = (date) => {
        this.props.setVotingActiveDate(this.props.period, { year: date.getFullYear(), month: date.getMonth(), day: date.getDate(), date });
    };

    formatDate = date => {
        const { year, day } = date;
        const month = date.month + 1;
        const formatNumber = number => number < 10 ? `0${number}` : number;
        return `${formatNumber(day)}.${formatNumber(month)}.${year}`;
    };

    render() {
        const { date, period } = this.props;

        const { flexCenter, row, textWrapper, text, label, datePicker } = styles;

        return (
            <View style={[flexCenter, period === 'start' ? { paddingRight: 40 } : null]}>
                <View style={[row, textWrapper]}>
                    <Text style={text}>
                        {period === 'start' ? 'Дата начала:' : 'Дата окончания:'}
                    </Text>
                    <Text style={[text, label]}>
                        {this.formatDate(date)}
                    </Text>
                </View>
                <DatePickerIOS
                    style={datePicker}
                    date={date.date}
                    mode='date'
                    // timeZoneOffsetInMinutes={(-1) * this.state.date.getTimezoneOffset() / 60}
                    onDateChange={this.onDateChange}
                />
            </View>
        );
    }
}

export default connect(null, { setVotingActiveDate })(CreateVotingStep3);
