import slice from 'lodash-es/slice';
import cloneDeep from 'lodash-es/cloneDeep';
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Picker from 'react-native-wheel-picker';
import { updatePeriodArchived } from '../../../actions';
import { Button, Text } from '../../common';

import styles from './styles';

class QuarterSelectorModal extends PureComponent {
    constructor(props) {
        super(props);
        const { quarter, year, periods } = props;
        this.periods = cloneDeep(periods);
        const lastPeriodIndex = this.periods.length - 1;
        const lastPeriod = this.periods[lastPeriodIndex];
        const lastPeriodQuartersLength = lastPeriod.quarter.length;
        if (lastPeriodQuartersLength > 1) {
          this.periods[lastPeriodIndex].quarter = slice(this.periods[lastPeriodIndex].quarter, 0, lastPeriodQuartersLength - 1);
        } else {
          this.periods = slice(this.periods, 0, lastPeriodIndex);
        }
        // const quarterList = ['1', '2', '3', '4'];
        // const yearList = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'];
        const period = this.periods.find(period => +period.year === year);
        const quarterList = period ? period.quarter : [];
        const yearList = this.periods.map(period => period.year);
        this.state = { quarterList, yearList, selectedQuarter: quarterList.findIndex(el => el === quarter.toString()), selectedYear: yearList.findIndex(el => el === year.toString()) };
    }

    pickQuarter = (index) => {
        this.setState({ ...this.state, selectedQuarter: index });
    };

    pickYear = (index) => {
        const quarterList = this.periods[index].quarter;
        this.setState({ ...this.state, selectedYear: index, quarterList });
    };

    goBack = () => {
        Actions.pop();
    };

    onSelect = () => {
        const { selectedQuarter, selectedYear, quarterList, yearList } = this.state;
        const quarter = +quarterList[selectedQuarter];
        const year = +yearList[selectedYear];
        this.props.updatePeriodArchived({ quarter, year });
        Actions.pop();
    };

    render() {
        const { style } = this.props;
        const { quarterList, yearList, selectedQuarter, selectedYear } = this.state;
        const { flexWrapper, container, row, alignItemsCenter, justifyContentCenter, leftPicker, rightPicker, fontSize18, textWhite, pickerModalWrapper, pickerModal, buttonApply, buttonReset } = styles;
        const pickerItemStyle = { fontSize: 22, color: 'white' };

        return (
            <View style={[pickerModalWrapper, alignItemsCenter, justifyContentCenter, style]}>
                <View style={[pickerModal, container, alignItemsCenter]}>
                    <Text style={[textWhite, fontSize18]}>
                         Выберите период для сравнения
                    </Text>
                    <View style={[flexWrapper, row, alignItemsCenter]}>
                        <Picker
                            style={leftPicker}
                            selectedValue={selectedQuarter}
                            itemStyle={pickerItemStyle}
                            onValueChange={this.pickQuarter.bind(this)}
                        >
                            {quarterList.map((value, index) => (
                                <Picker.Item label={value} value={index} key={index} />
                            ))}
                        </Picker>
                        <Text style={textWhite}>
                            квартал
                        </Text>
                        <Picker
                            style={rightPicker}
                            selectedValue={selectedYear}
                            itemStyle={pickerItemStyle}
                            onValueChange={this.pickYear.bind(this)}
                        >
                            {yearList.map((value, index) => (
                                <Picker.Item label={value} value={index} key={index} />
                            ))}
                        </Picker>
                        <Text style={textWhite}>
                            года
                        </Text>
                    </View>
                    <View style={row}>
                        <Button style={buttonApply} onPress={this.onSelect.bind(this)}>
                            Применить
                        </Button>
                        <Button style={buttonReset} onPress={this.goBack.bind(this)} color='black'>
                            Отменить
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}

export default connect(null, { updatePeriodArchived })(QuarterSelectorModal);
