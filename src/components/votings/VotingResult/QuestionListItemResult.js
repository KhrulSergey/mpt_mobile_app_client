import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Foundation';
import BarChart from './BarChart';
import PieChart from '../../common/PieChart';
import { Text, Button } from '../../common';
import { graphBar, graphPie } from '../../../constants/Icons';

import styles from './styles';

class QuestionListItemResult extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { chart: 'bar' };
        this.cases = { nom: 'голос', gen: 'голоса', plu: 'голосов' };
    }

    onLayout = event => {
        if (this.state.chartViewHeight) return;
        this.setState({ chartViewHeight: event.nativeEvent.layout.height });
    };

    onButtonPress = () => {
        if (this.state.chart === 'bar') {
            this.setState({ chart: 'pie' });
        } else {
            this.setState({ chart: 'bar' });
        }
    };

    render() {
        const { question, index } = this.props;
        const { chart, chartViewHeight } = this.state;

        const { container, questionWrapper, questionText, paddingRight, answersWrapper, row, buttonWrapper, button, graphIcon, textBlue } = styles;

        return (
            <View>
                <View style={[container, questionWrapper]}>
                    <View style={[row]}>
                        <Text style={[questionText, paddingRight]}>
                            {index}.
                        </Text>
                        <Text style={questionText}>
                            {question.text}
                        </Text>
                        {/*<Text style={questionText}>
                            {`Проголосовало: ${completed}%`}
                        </Text>*/}
                    </View>
                </View>
                <View style={[container, answersWrapper]}>
                    <View onLayout={this.onLayout.bind(this)}>
                        {chart === 'bar'
                            ? <BarChart question={question} />
                            : <PieChart data={question} height={chartViewHeight < 400 ? 400 : chartViewHeight} entityCases={this.cases} />
                        }
                    </View>
                    <View style={buttonWrapper}>
                        <Button style={[button, row]} onPress={this.onButtonPress.bind(this)}>
                            <Icon name={chart === 'bar' ? graphPie : graphBar} style={[graphIcon, textBlue]} />
                            <Text style={textBlue}>
                                {chart === 'bar' ? 'Отобразить круговую диаграмму' : 'Отобразить столбчатую диаграмму'}
                            </Text>
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { voting: state.voting };
};

export default connect(mapStateToProps, null)(QuestionListItemResult);
