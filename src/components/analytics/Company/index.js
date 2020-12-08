import React, { PureComponent } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { fetchCompany } from '../../../actions';
import { IconEncircled, Text, LoadingIndicator } from '../../common';
import { back, forward } from '../../../constants/Icons';
import { isNullOrUndefined } from '../../../constants/util';

import styles from './styles';

class Company extends PureComponent {
    componentDidMount() {
        this.props.fetchCompany({ id: this.props.id });
    }

    goToProjects = (projectGroup) => {
        Actions.projects({ params: { company_id: this.props.company.data.id, projectGroup, requested_at: Date.now() } });
    };

    renderProjectGroups(data) {
        const { smallContainer, aiCenter, row, label, paddingRight } = styles;

        return data.projectGroupData.map(({ projectGroup, projectsCount }) => (
            <TouchableOpacity key={projectGroup.id} activeOpacity={0.5} onPress={this.goToProjects.bind(this, projectGroup)}>
                <View style={[smallContainer, aiCenter, row]}>
                    <View style={row}>
                        <Text style={paddingRight}>
                            {projectGroup.name}:
                        </Text>
                        <Text style={label}>
                            {projectsCount}
                        </Text>
                    </View>
                    <IconEncircled icon={forward} />
                </View>
            </TouchableOpacity>
        ));
    }

    // renderCoexecutors(coexecutors) {
    //     if (coexecutors) {
    //         return <Text>{coexecutors.join(', ')}</Text>;
    //     }
    // }

    renderFinancialStatus(data) {
        if (data) {
            const { row, label, paddingRight } = styles;
            return data.map((item => {
                return (
                    <View key={item.year} style={row}>
                        <Text style={paddingRight}>
                            Выручка в {item.year} году:
                        </Text>
                        <Text style={label}>
                            {item.value} млн. руб.
                        </Text>
                    </View>
                );
            }));
        }
        return (
            <View>
                <Text>Нет данных</Text>
            </View>
        );
    }

    render() {
        const { container, smallContainer, nameWrapper, blockCaptionWrapper, blockCaption, blockImage, integrationImage, integrationInfoBlock, percentText, paddingRightPercent, jcCenter, aiCenter, integrationText, noDataText, textWhite, infoBlock, paddingView, row, spaceBetween, borderBottom, borderTop, borderRight, smallCaption, label, largeCaption, textBold, paddingRight, marginBottom } = styles;

        const { data, fetching } = this.props.company;
        const { name, industries, region_name, integration_rating, founder, coexecutors, projects_count, state_funds, own_funds, financial_status } = data;

        return (
            fetching ?
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
                        <View style={[row, borderBottom]}>
                            <View style={[container, row, spaceBetween, borderRight]}>
                                <View>
                                    <Text style={smallCaption}>
                                        Отрасль
                                    </Text>
                                    <Text style={label}>
                                        {industries}
                                    </Text>
                                </View>
                                {/*<IconEncircled icon={forward} />*/}
                            </View>
                            <View style={[container, row, spaceBetween]}>
                                <View>
                                    <Text style={smallCaption}>
                                        Регион
                                    </Text>
                                    <Text style={label}>
                                        {region_name}
                                    </Text>
                                </View>
                                {/*<IconEncircled icon={forward} />*/}
                            </View>
                        </View>
                        <View style={container}>
                            <Image source={require('../../../images/Group.png')} style={integrationImage} />
                            <View style={[row, integrationInfoBlock]}>
                                <View style={paddingRightPercent}>
                                    {isNullOrUndefined(integration_rating) ?
                                        <View style={[jcCenter, aiCenter]}>
                                            <Text style={[noDataText, label, integrationText]}>
                                                нет
                                            </Text>
                                            <Text style={[noDataText, label, integrationText]}>
                                                данных
                                            </Text>
                                        </View>
                                        :
                                        <Text style={[percentText, label]}>
                                            {integration_rating}%
                                        </Text>
                                    }
                                </View>
                                <View style={jcCenter}>
                                    <Text style={[blockCaption, label, integrationText]}>
                                        Рейтинг
                                    </Text>
                                    <Text style={[blockCaption, label, integrationText]}>
                                        интегрированности
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {founder &&
                        <View style={[container, marginBottom]}>
                            <Text style={largeCaption}>
                                Учредители
                            </Text>
                            <Text>
                                {founder}
                            </Text>
                            {/*<View style={row}>
                             <Text style={[textBold, paddingRight]}>
                             Соисполнители:
                             </Text>
                             {this.renderCoexecutors(coexecutors)}
                             </View>*/}
                        </View>
                    }
                    <View style={infoBlock}>
                        <View style={paddingView} />
                        <Image source={require('../../../images/EagleLittle.png')} style={blockImage} />
                        <View style={[container, row, spaceBetween, borderBottom]}>
                            <View style={blockCaptionWrapper}>
                                <Text style={blockCaption}>
                                    Участие в проектах
                                </Text>
                            </View>
                        </View>
                        <View style={{padding: 15}}>
                            {this.renderProjectGroups(data)}
                        </View>
                    </View>
                    <View style={infoBlock}>
                        <View style={paddingView} />
                        <Image source={require('../../../images/EagleLittle.png')} style={blockImage} />
                        <View style={[container, row, spaceBetween, borderBottom]}>
                            <View style={blockCaptionWrapper}>
                                <Text style={blockCaption}>
                                    Инструменты поддержки
                                </Text>
                            </View>
                            {/*<IconEncircled icon={forward} />*/}
                        </View>
                        <View style={container}>
                            <View style={row}>
                                <Text style={paddingRight}>
                                    Господдержка:
                                </Text>
                                <Text style={label}>
                                    {state_funds} млн. руб.
                                </Text>
                            </View>
                            <View style={row}>
                                <Text style={paddingRight}>
                                    Собственные средства:
                                </Text>
                                <Text style={label}>
                                    {own_funds} млн. руб.
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={infoBlock}>
                        <View style={paddingView} />
                        <Image source={require('../../../images/Ruble.png')} style={blockImage} />
                        <View style={[container, row, spaceBetween, borderBottom]}>
                            <View style={blockCaptionWrapper}>
                                <Text style={blockCaption}>
                                    Финансовое состояние
                                </Text>
                            </View>
                            {/*<IconEncircled icon={forward} />*/}
                        </View>
                        <View style={container}>
                            {this.renderFinancialStatus(financial_status)}
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return { company: state.company };
};

export default connect(mapStateToProps, { fetchCompany })(Company);
