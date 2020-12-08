import React, { PureComponent } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from '../../common';
import { trackById } from '../../../constants/util';

import styles from './styles';

class BarChart extends PureComponent {
    renderItem = ({ item }) => {
        const { text, valuePercent, value, label } = item;

        const { paddingBottom, answerText, row, barFilled, barNotFilled, barText } = styles;

        return (
            <View style={paddingBottom}>
                <Text style={answerText}>
                    {text}:
                </Text>
                <View style={row}>
                    <View style={[barFilled, { flex: valuePercent }]}>
                        <Text style={barText}>
                            {value} ({label})
                        </Text>
                    </View>
                    <View style={[barNotFilled, { flex: 100 - valuePercent }]} />
                </View>
            </View>
        );
    };

    render() {
        console.log('BarChart render', this.props.question);

        return (
            <View style={styles.chartWrapper}>
                <View>
                    <FlatList
                        data={this.props.question.answers}
                        keyExtractor={trackById}
                        renderItem={this.renderItem.bind(this)}
                    />
                </View>
            </View>
        );
    }
}

export default BarChart;
