import React, { PureComponent } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { fetchProjectsCount } from '../../../actions';
import { IconEncircled, LoadingIndicator, Text } from '../../common';
import { REGION_IMAGES } from '../../../constants/RegionImages';
import { forward } from '../../../constants/Icons';
import { isNullOrUndefined } from '../../../constants/util';

import styles from './styles';

class Region extends PureComponent {
    componentDidMount() {
        this.props.fetchProjectsCount({ region_code: this.props.data.code });
    }

    goToProjects = (projectGroup) => {
        Actions.projects({ params: { regions: [this.props.data], projectGroup, requested_at: Date.now() } });
    };

    goToCompanies = () => {
        Actions.companies({ params: { regions: [this.props.data] } });
    };

    renderGreenBlock(info) {
        if (info) {
            const { row, col, textWhite, indicatorBlockItem, textBig, textMiddle, bottomAlign } = styles;
            return info.map(((item, index) => {
                const { name, value, unit } = item;

                return (
                    <View key={index} style={[col, indicatorBlockItem]}>
                        {!isNullOrUndefined(value) ?
                            <View style={row}>
                                <Text style={[textWhite, textBig]}>
                                    {value}
                                </Text>
                                <Text style={[textWhite, unit === '%' ? textBig : [textMiddle, bottomAlign]]}>
                                    {unit}
                                </Text>
                            </View>
                            :
                            <Text style={[textWhite, textMiddle]}>
                                Нет данных
                            </Text>
                        }
                        <Text style={[textWhite]}>
                            {name}
                        </Text>
                    </View>
                );
            }));
        }
    }

    renderProjectGroups({ fetching, projectGroupData }) {
        const { smallContainer, aiCenter, row, label, paddingRight } = styles;

        return fetching
            ? <LoadingIndicator />
            : projectGroupData.map(({ projectGroup, projectsCount }) => (
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

    render() {
        const { container, nameWrapper, blockCaptionWrapper, blockCaption, blockTitleImage, textGray, indicatorBlock, blockImage, textWhite, infoBlock, row, spaceBetween, borderBottom, paddingView, label, paddingRight, marginBottom } = styles;

        const { name, info, projects_num, state_funds, own_funds, companies_num, ref } = this.props.data;

        return (
            <ScrollView>
                <View style={container}>
                    <View style={nameWrapper}>
                        <Image source={REGION_IMAGES[ref]} style={blockTitleImage} />
                        <Text style={[blockCaption, textWhite]}>
                            {name}
                        </Text>
                    </View>
                    <View style={[infoBlock, marginBottom]}>
                        <View style={[row, indicatorBlock]}>
                            {this.renderGreenBlock(info)}
                        </View>
                        <View style={container}>
                            <Text style={textGray}>
                                Предоставлена информация за текущий период
                            </Text>
                        </View>
                    </View>
                    <View style={infoBlock}>
                        <View style={paddingView} />
                        <Image source={require('../../../images/EagleLittle.png')} style={blockImage} />
                        <View style={[container, row, spaceBetween, borderBottom]}>
                            <View style={blockCaptionWrapper}>
                                <Text style={blockCaption}>
                                    Проекты
                                </Text>
                            </View>
                            {/*<IconEncircled icon={forward} />*/}
                        </View>
                        <View style={{padding: 15}}>
                            {this.renderProjectGroups(this.props.data)}
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.5} onPress={this.goToCompanies.bind(this)}>
                        <View style={infoBlock}>
                            <View style={paddingView} />
                            <Image source={require('../../../images/Car.png')} style={blockImage} />
                            <View style={[container, row, spaceBetween, borderBottom]}>
                                <View style={blockCaptionWrapper}>
                                    <Text style={blockCaption}>
                                        Предприятия
                                    </Text>
                                </View>
                                <IconEncircled icon={forward} />
                            </View>
                            <View style={container}>
                                <View style={row}>
                                    <Text style={paddingRight}>
                                        Работают:
                                    </Text>
                                    <Text style={label}>
                                        {!isNullOrUndefined(companies_num) ? `${companies_num} предприятий` : 'Нет данных'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
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
                                        {!isNullOrUndefined(state_funds) ? `${state_funds} млн. руб.` : 'Нет данных'}
                                    </Text>
                                </View>
                                <View style={row}>
                                    <Text style={paddingRight}>
                                        Собственные средства:
                                    </Text>
                                    <Text style={label}>
                                        {!isNullOrUndefined(own_funds) ? `${own_funds} млн. руб.` : 'Нет данных'}
                                    </Text>
                                </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return { data: state.region };
};

export default connect(mapStateToProps, { fetchProjectsCount })(Region);
