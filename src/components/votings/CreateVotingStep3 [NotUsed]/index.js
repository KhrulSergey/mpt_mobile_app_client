import React, { PureComponent } from 'react';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { setVotingActiveDate } from '../../../actions';
import { Button, Text } from '../../common';
import { TabBar } from '../NewVoting/TabBar';
import DatePickerAndroid from './DatePickerAndroid';
import DatePickerIOS from './DatePickerIOS';

import styles from './styles';

class CreateVotingStep3 extends PureComponent {
    render() {
        const { newVoting } = this.props;
        const { active_date_start, active_date_end, stepCompleted } = newVoting;

        const { container, flexWrapper, row, flexCenter } = styles;

        return (
            <View style={flexWrapper}>
                <TabBar step={3} stepCompleted={stepCompleted} />
                {Platform.OS === 'android' &&
                    <View style={[container, flexCenter]}>
                        <DatePickerAndroid period='start' date={active_date_start} voting={newVoting} />
                        <DatePickerAndroid period='end' date={active_date_end} voting={newVoting} />
                    </View>
                }
                {Platform.OS === 'ios' &&
                    <View style={[container, row, flexCenter]}>
                        <DatePickerIOS period='start' date={active_date_start} voting={newVoting} />
                        <DatePickerIOS period='end' date={active_date_end} voting={newVoting} />
                    </View>
                }
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { newVoting: state.newVoting };
};

export default connect(mapStateToProps, { setVotingActiveDate })(CreateVotingStep3);
