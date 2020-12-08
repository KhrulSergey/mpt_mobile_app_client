import React, { PureComponent } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchProject } from '../../../actions';
import { Text, Badge, LoadingIndicator } from '../../common';
import { trackByIndex } from '../../../constants/util';

import styles from './styles';

class Project extends PureComponent {
    componentDidMount() {
        this.props.fetchProject({ id: this.props.id });
    }

    renderItem = ({ item, index }) => {
        const { row, paddingTop, marginRight } = styles;
        return (
            <View style={[row, paddingTop]}>
                <Badge style={marginRight}>
                    {index + 1}
                </Badge>
                <Text>{item}</Text>
            </View>
        );
    };

    renderStatus = (status_code, status_name) => {
        if (status_code && status_name) {
            const { statusWrapperOk, statusWrapperWarning, statusWrapperDanger, statusWrapper, statusText } = styles;
            let wrapperStyle;
            switch (status_code) {
                case 'on_schedule':
                case 'finished':
                    wrapperStyle = [statusWrapper, statusWrapperOk];
                    break;
                case 'behind_schedule':
                    wrapperStyle = [statusWrapper, statusWrapperWarning];
                    break;
                case 'stopped':
                case 'paused':
                case 'excluded':
                    wrapperStyle = [statusWrapper, statusWrapperDanger];
                    break;
                default:
                    wrapperStyle = statusWrapper;
            }
            return (
                <View style={wrapperStyle}>
                    <Text style={statusText}>
                        {status_name}
                    </Text>
                </View>
            );
        }
    };

    render() {
        const { flexWrapper, container, nameWrapper, blockCaption, largeCaption, textWhite, infoBlock, borderBottom, row,
          spaceBetween, textBold, paddingRight, marginRight, header, nameCol, jcCenter, valueCol } = styles;
        
        const { data, fetching } = this.props.project;
        console.log('Project render', data);
        const { id, name, description, code, industries, date_from, date_to, status_code, status_name, company_name, budget_plan, region_name,
          additionalProperties, steps, coexecutors, date_from_fact, date_to_fact, budget_fact, indicators } = data;

        return (
            fetching || !id ?
            <LoadingIndicator />
            :
            <ScrollView>
                <View style={container}>
                    <View style={[container, nameWrapper]}>
                        <Text style={[blockCaption, textWhite]}>
                            {name}
                        </Text>
                    </View>
                    <View style={infoBlock}>
                        <View style={[container, borderBottom]}>
                            <Text>
                                {description}
                            </Text>
                        </View>
                        <View style={[container, row, spaceBetween]}>
                            <View style={[flexWrapper, marginRight]}>
                                <View style={row}>
                                    <Text style={[textBold, paddingRight]}>
                                        Код проекта:
                                    </Text>
                                    <Text>
                                        {code}
                                    </Text>
                                </View>
                                {region_name &&
                                    <View style={row}>
                                        <Text style={[textBold, paddingRight]}>
                                            Субъект РФ:
                                        </Text>
                                        <Text style={flexWrapper}>
                                            {region_name}
                                        </Text>
                                    </View>
                                }
                                <View style={row}>
                                    <Text style={[textBold, paddingRight]}>
                                        Отрасль:
                                    </Text>
                                    <Text style={flexWrapper}>
                                        {industries}
                                    </Text>
                                </View>
                                <View style={row}>
                                    <Text style={[textBold, paddingRight]}>
                                        Срок реализации - начало:
                                    </Text>
                                    <Text>
                                        {date_from}{date_from_fact && ` (факт: ${date_from_fact})`}
                                    </Text>
                                </View>
                                <View style={row}>
                                    <Text style={[textBold, paddingRight]}>
                                        Срок реализации - завершение:
                                    </Text>
                                    <Text>
                                        {date_to || 'не задан'}{date_to_fact && ` (факт: ${date_to_fact})`}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                {this.renderStatus(status_code, status_name)}
                            </View>
                        </View>
                    </View>
                    <View style={container}>
                        <Text style={largeCaption}>
                            Наименование организации (заявителя)
                        </Text>
                        <Text>
                            {company_name}
                        </Text>
                        {coexecutors &&
                            <View style={row}>
                                <Text style={[textBold, paddingRight]}>Соисполнители:</Text>
                                <Text style={flexWrapper}>{coexecutors}</Text>
                            </View>
                        }
                    </View>
                    {steps &&
                        <View style={container}>
                            <Text style={largeCaption}>
                                Этапы реализации
                            </Text>
                            {steps.length > 0
                                ?
                                <FlatList
                                    data={steps}
                                    keyExtractor={trackByIndex}
                                    renderItem={this.renderItem.bind(this)}
                                />
                                :
                                <Text>Информация отсутствует.</Text>
                            }
                        </View>
                    }
                    <View style={container}>
                        <Text style={largeCaption}>Объём финансирования (плановый)</Text>
                        <Text>{budget_plan}</Text>
                    </View>
                    {budget_fact &&
                        <View style={container}>
                            <Text style={largeCaption}>Объём финансирования (фактический)</Text>
                            <Text>{budget_fact}</Text>
                        </View>
                    }
                    {indicators && indicators.length > 0 &&
                        <View style={container}>
                            <Text style={largeCaption}>Значения показателей и индикаторов</Text>
                            <View style={[row, header]}>
                                <Text style={[nameCol, jcCenter, textWhite]}>Наименование</Text>
                                <Text style={[valueCol, jcCenter, textWhite]}>Плановое значение</Text>
                                <Text style={[valueCol, jcCenter, textWhite]}>Фактическое значение</Text>
                            </View>
                            {indicators.map((o, i) => {
                                return (
                                    <View key={i} style={row}>
                                        <Text style={[nameCol, jcCenter]}>{o.name}</Text>
                                        <Text style={[valueCol, jcCenter]}>{o.plan}</Text>
                                        <Text style={[valueCol, jcCenter]}>{o.fact}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    }
                    {additionalProperties.map((o, i) => {
                        if (data[o.prop]) {
                            return (
                                <View key={i} style={container}>
                                    <Text style={largeCaption}>{o.label}</Text>
                                    <Text>{data[o.prop]}</Text>
                                </View>
                            );
                        }
                    })}
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return { project: state.project };
};

export default connect(mapStateToProps, { fetchProject })(Project);
