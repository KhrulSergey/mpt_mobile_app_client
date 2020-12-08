import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Svg, { Circle, G, Text as SvgText, Line, Rect } from 'react-native-svg';
import { PieChart as Chart } from 'react-native-svg-charts';
import { getDeclinedUnit } from '../../constants/util';
import { Text } from './';
import { catskillWhite, white } from '../../constants/Colors';

class PieChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { dimensions: {} };
    }

    onLayout = event => {
        const { width, height } = event.nativeEvent.layout;
        console.log('onLayout called', { width, height });
        this.setState({ ...this.state, dimensions: { width, height } });
    };

    handleSelect(event) {
        let entry = event.nativeEvent;
        console.log('selected entry: ', entry);
        /*if (entry == null) {
            this.setState({ ...this.state, selectedEntry: null });
        } else {
            this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) });
        }*/
    }

    renderSummary(summaryAction) {
        const { action, content } = summaryAction;

        const { summaryButtonMargin } = styles;

        return action ?
            <TouchableOpacity style={summaryButtonMargin} onPress={action}>
                {content}
            </TouchableOpacity>
            :
            <View style={summaryButtonMargin}>
                {content}
            </View>;
    }

    renderLegend() {
        const { colors } = this.state;
        const { actions, entity, entityCases } = this.props;

        const { row, legendRow, legendText, circle } = styles;

        return this.props.data.sections.map((section, index) => {
            const a = (
                <View style={[row, legendRow]}>
                    <View style={[circle, { backgroundColor: section.svg.fill }]} />
                    <View style={{ backgroundColor: 'transparent' }}>
                        <Text style={legendText}>
                            {`${section.text}: `}
                            <Text style={[legendText, { color: section.svg.fill }]}>
                                {section.value} {entity || getDeclinedUnit(section.value, entityCases)}
                            </Text>
                        </Text>
                    </View>
                </View>
            );
            return actions ?
                <TouchableOpacity key={index} onPress={actions[index]}>
                    {a}
                </TouchableOpacity>
                :
                <View key={index}>
                    {a}
                </View>;
        });
    }

    render() {
        const { dimensions } = this.state;
        const { data, height, entity, entityCases, summaryAction } = this.props;

        const { flexWrapper, row, justifyContentCenter, legendWrapper, legendFooter, paddingLeft, centerTextWrapper, centerNumber, centerText, importAvgBlock, textWhite } = styles;

        const Labels = ({ slices }) => {
            return slices.map((slice, index) => {
                const { labelCentroid, pieCentroid, data } = slice;
                console.log(index, data);
                return (
                    <G key={index}>
                        {data.valuePercent >= 10 &&
                            <SvgText
                                key={`v-${index}`}
                                x={pieCentroid[0]}
                                y={pieCentroid[1]}
                                fill={white}
                                textAnchor='middle'
                                alignmentBaseline='middle'
                                fontSize={18}
                                //stroke={'black'}
                                //strokeWidth={0.2}
                            >
                                {data.label}
                            </SvgText>
                        }
                    </G>
                )
            })
        };

        return (
            <View style={[justifyContentCenter, { height }]}>
                <View style={[{ height }, row]}>
                    <View style={[flexWrapper, { height }]} onLayout={this.onLayout.bind(this)}>
                        <Chart
                            style={{height: '100%'}}
                            data={data.sections}
                            innerRadius={45}
                            outerRadius={120}
                            labelRadius={140}
                            padAngle={0}
                        >
                            <Labels/>
                        </Chart>
                        <View style={[centerTextWrapper, justifyContentCenter, { top: dimensions.height / 2 - 40, left: dimensions.width / 2 - 40 }]}>
                            <Text style={centerNumber}>
                                {data.value}
                            </Text>
                            <Text style={centerText}>
                                {entity || getDeclinedUnit(data.value, entityCases)}
                            </Text>
                        </View>
                    </View>
                    <View style={[legendWrapper, paddingLeft, justifyContentCenter]}>
                        {this.renderLegend()}
                        {(data.legendLabel || summaryAction) &&
                            <View style={[row, legendFooter]}>
                                {data.legendLabel &&
                                    <View style={importAvgBlock}>
                                        <Text>
                                            {data.legendLabel}
                                        </Text>
                                    </View>
                                }
                                {summaryAction && this.renderSummary(summaryAction)}
                            </View>
                        }
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    flexWrapper: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    justifyContentCenter: {
        justifyContent: 'center'
    },
    legendWrapper: {
        flex: 2
    },
    paddingLeft: {
        paddingLeft: 40
    },
    legendRow: {
        marginBottom: 10,
        alignItems: 'center'
    },
    legendText: {
        fontSize: 15
    },
    legendFooter: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    },
    centerTextWrapper: {
        position: 'absolute',
        backgroundColor: 'transparent',
        width: 80,
        height: 80,
        alignItems: 'center'
    },
    centerNumber: {
        fontSize: 30
    },
    centerText: {
        fontSize: 15
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 50,
        marginRight: 10
    },
    importAvgBlock: {
        width: 320,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: catskillWhite,
        padding: 20,
        marginRight: 20
    },
    textWhite: {
        color: white
    },
    summaryButtonMargin: {
        marginRight: 20
    }
};

export default PieChart;
