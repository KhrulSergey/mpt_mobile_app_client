import sortBy from 'lodash-es/sortBy';
import isEqual from 'lodash-es/isEqual';
import React, { PureComponent } from 'react';
import { View, Image, TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Foundation';
import Config from 'react-native-config';
import Panel from './Panel';
import { fetchRegionsDynamicData, toggleModalVisibility, selectRegions, selectRegion } from '../../../actions';
import { Text, FilterPanel, LoadingIndicator, IconEncircled } from '../../common';
import { REGION_IMAGES } from '../../../constants/RegionImages';
import { back, forward, graphBar, menu } from '../../../constants/Icons';
import { store } from '../../../configureStore';
import { menuButton } from '../../../Router';

import styles from './styles';

const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <link rel="stylesheet" href="WebViewContent/leaflet.css"/>
        <script src="WebViewContent/leaflet.js"></script>
        <style>
            html, body, #map {
                width: 100%;
                height: 100%;
                padding: 0;
                margin: 0;
            }
        </style>
    </head>
    <body>
        <div id="map">
        </div>
        <script type="text/javascript" src="WebViewContent/regions.js"></script>
        <script type="text/javascript" src="WebViewContent/script.js"></script>
    </body>
    </html>`;

const backButton = {
    onLeft: () => Actions.replace('map', menuButton),
    leftButtonImage: back,
    leftButtonIconStyle: { width: 24, height: 22, resizeMode: 'contain' }
};

class Map extends PureComponent {
    constructor(props) {
        super(props);
        const { width, navbarHeight, heightWithoutNavbar } = props.dimensions;
        this.state = { map: { width: width - 350, height: heightWithoutNavbar - 60 }, popup: { width: 300, height: 180, top: -180, left: 0, wrapperTop: 2000 } };
        this.modalStyle = { height: this.state.map.height, marginTop: navbarHeight + 60 };
        this.webViewSource = Config.ENV === 'development' ? require('./WebViewContent/index.html') : Platform.OS === 'ios' ? { html, baseUrl: '' } : { uri: 'file:///android_asset/index.html' };
        const { projectStatuses } = store.getState().refs.data;
        this.dangerStatusIds = projectStatuses.filter(o => o.code === 'paused' || o.code === 'behind_schedule');
        this.okStatusIds = projectStatuses.filter(o => o.code === 'on_schedule');
    }

    componentWillReceiveProps(nextProps) {
        console.log('Map component will receive props', nextProps);
        const selectedRegions = sortBy(nextProps.filterRegion.selected, 'code').map(o => o.code);
        const selectedIndustries = sortBy(nextProps.filterIndustry.selected, 'id').map(o => o.id);
        if (nextProps.filterRegion.currentScene === 'map' && this.props.filterRegion.updated_at !== nextProps.filterRegion.updated_at && !isEqual(this.props.filterRegion.selected, selectedRegions)) {
            this.props.selectRegions({ selectedRegions: nextProps.filterRegion.selected });
        }
        if (nextProps.filterIndustry.currentScene === 'map' && this.props.filterIndustry.updated_at !== nextProps.filterIndustry.updated_at && !isEqual(this.props.filterIndustry.selected, selectedIndustries)) {
            const { quarter, year } = this.props.data.periodArchived;
            this.props.fetchRegionsDynamicData({ quarter, year, industries: nextProps.filterIndustry.selected, selectedRegions: this.props.filterRegion.selected, projectGroup: this.props.filterProjectGroup.selected });
        }
        if (nextProps.filterProjectGroup.currentScene === 'map' && this.props.filterProjectGroup.updated_at !== nextProps.filterProjectGroup.updated_at && !isEqual(this.props.filterProjectGroup.selected, nextProps.filterProjectGroup.selected)) {
            const { quarter, year } = this.props.data.periodArchived;
            this.props.fetchRegionsDynamicData({ quarter, year, industries: this.props.filterIndustry.selected, selectedRegions: this.props.filterRegion.selected, projectGroup: nextProps.filterProjectGroup.selected });
        }
        if (nextProps.data.selectedData.updated_at !== this.props.data.selectedData.updated_at) {
            this.selectActiveRegion({ regions: nextProps.data.selectedData.regions });
        }
        if (nextProps.data.periodArchivedUpdatedAt !== this.props.data.periodArchivedUpdatedAt && (nextProps.data.periodArchived.quarter !== this.props.data.periodArchived.quarter || nextProps.data.periodArchived.year !== this.props.data.periodArchived.year)) {
            this.props.fetchRegionsDynamicData({ quarter: nextProps.data.periodArchived.quarter, year: nextProps.data.periodArchived.year, industries: this.props.filterIndustry.selected, selectedRegions: this.props.filterRegion.selected });
        }
    }

    componentWillUnmount() {
        if (this.webview) this.webview.postMessage(JSON.stringify({ remove: true }));
    }

    togglePopup = data => {
        console.log('togglePopup called', data);

        const { x, y } = data.coords;
        const { popup, map } = this.state;

        this.props.selectRegions({ selectedRegions: [data.region] });

        let top,
            left;
        if (x < popup.width) {
            left = x;
        } else {
            left = x - popup.width;
        }
        if (y > map.height - popup.height) {
            top = y - popup.height;
        } else {
            top = y;
        }
        this.setState({ ...this.state, popup: { ...popup, top, left, wrapperTop: 0 } });
    };

    togglePopupWrapper = () => {
        const { popup, map } = this.state;
        this.setState({ ...this.state, popup: { ...popup, top: map.height, left: 0, wrapperTop: map.height } });
    };

    goToRegion = () => {
        this.props.selectRegion(this.props.data.selectedData.regions[0]);
        Actions.region(/*{ region: this.props.data.selectedData.regions[0] }*/);
    };

    goToProjectsShowcase = () => {
        Actions.projectsShowcase({ params: {
            data: this.props.data.data,
            regions: this.props.filterRegion.selected,
            industries: this.props.filterIndustry.selected
        } });
    };

    goToProjects = () => {
        Actions.projects({ params: {
            statuses: this.okStatusIds,
            regions: this.props.filterRegion.selected,
            industries: this.props.filterIndustry.selected,
            projectGroup: this.props.filterProjectGroup.selected,
            requested_at: Date.now()
        } });
    };

    goToProblemProjects = () => {
        Actions.projects({ params: {
            statuses: this.dangerStatusIds,
            regions: this.props.filterRegion.selected,
            industries: this.props.filterIndustry.selected,
            projectGroup: this.props.filterProjectGroup.selected,
            requested_at: Date.now()
        } });
    };

    toggleDistrictList = () => {
        this.props.toggleModalVisibility('map-region');
        if (Actions.currentScene === 'regionFilterModal') {
            Actions.replace('map', menuButton);
        } else {
            Actions.refresh(backButton);
            Actions.regionFilterModal({ currentScene: 'map', filterType: 'map-region', style: this.modalStyle });
        }
    };

    toggleIndustryList = () => {
        this.props.toggleModalVisibility('map-industry');
        if (Actions.currentScene === 'filterModal') {
            Actions.replace('map', menuButton);
        } else {
            Actions.refresh(backButton);
            Actions.filterModal({ currentScene: 'map', filterType: 'map-industry', style: this.modalStyle });
        }
    };

    toggleProjectGroupList = () => {
        this.props.toggleModalVisibility('map-project-group');
        if (Actions.currentScene === 'selectModal') {
            Actions.replace('map', menuButton);
        } else {
            Actions.refresh(backButton);
            Actions.selectModal({ currentScene: 'map', filterType: 'map-project-group', style: this.modalStyle });
        }
    };

    onMessage = e => {
        console.log('nativeEvent', e.nativeEvent, JSON.parse(e.nativeEvent.data));
        this.togglePopup(JSON.parse(e.nativeEvent.data));
    };

    postMessage = ({ regions }) => {
        if (this.webview) {
            if (regions) {
                this.webview.postMessage(JSON.stringify({ regions }));
            }
        }
    };

    selectActiveRegion = ({ regions, init }) => {
        if (init) {
            setTimeout(() => this.postMessage({ regions }), 100);
        } else {
            this.postMessage({ regions });
        }
    };

    openQuarterSelector = () => {
        const { data, dimensions } = this.props;
        const { periodArchived, periods } = data;
        const { quarter, year } = periodArchived;
        Actions.quarterSelectorModal({ quarter, year, periods, style: { height: dimensions.heightWithoutNavbar, marginTop: dimensions.navbarHeight } });
    };

    render() {
        const { data, filterRegion, filterIndustry, filterProjectGroup } = this.props;
        const { dataArchived } = data;
        const hideDynamic = !dataArchived;
        console.log('************************ Map render', this.props);
        const { fetchingInit, fetching, fetchingArchived, selectedData, periodArchived, periods } = data;
        const { name, projects_num_ok, projects_num_ok_dynamic, projects_num_ok_dynamic_percent, projects_num_problem, projects_num_problem_dynamic, projects_num_problem_dynamic_percent, state_funds, state_funds_dynamic, state_funds_dynamic_percent, production_index, production_index_dynamic_percent, ref, companies_num, unprofitable_companies_num, unprofitable_companies_percent, workers_num, debt, regions } = selectedData;
        const { quarter, year } = periodArchived;
        const { selected: selectedRegions } = filterRegion;
        const { selected: selectedIndustries } = filterIndustry;
        const { selected: selectedProjectGroup } = filterProjectGroup;

        const { container, paddingHorizontal, flexWrapper, row, filterBlock, alignItemsCenter, spaceBetween, borderRight, leftBlock, fontSize12, fontSize10, paddingLeft, positionAbsolute, popupStyle, justifyContentCenter, popupSection, popupFooter, popupHeaderWrapper, popupHeader, popupHeaderImage, textBlue, comparisonButton, navigationButton, textWhite, comparisonButtonIcon, paddingRight, textGreen, fontSize13, fontSize16, iconEncircled } = styles;

        const { map, popup } = this.state;

        return (
            <View style={flexWrapper}>
                {fetchingInit ?
                    <LoadingIndicator />
                    :
                    <View style={flexWrapper}>
                        <View style={[row, filterBlock]}>
                            <FilterPanel caption='Отрасль' selected={selectedIndustries.length > 0 ? selectedIndustries : 'Все отрасли'} onPress={this.toggleIndustryList.bind(this)} style={borderRight} />
                            <FilterPanel caption='Регион' selected={selectedRegions.length > 0 ? selectedRegions : 'Все регионы'} onPress={this.toggleDistrictList.bind(this)} style={borderRight} />
                            <FilterPanel caption='Группа проектов' selected={selectedProjectGroup ? selectedProjectGroup.name : 'Все группы проектов'} onPress={this.toggleProjectGroupList.bind(this)} />
                            {/*<FilterPanel caption='Мера поддержки' selected={'Финансирование'} style={borderRight} />
                            <FilterPanel caption='Госпрограмма' selected={'Наименование'} />*/}
                        </View>
                        <View style={[flexWrapper, row]}>
                            <View style={[leftBlock, spaceBetween]}>
                                <View>
                                    <Panel
                                        onPress={this.goToProjects.bind(this)}
                                        warningCondition={projects_num_ok_dynamic < 0}
                                        caption='Проекты по графику'
                                        fetching={fetching}
                                        value={projects_num_ok}
                                        unit='шт.'
                                        fetchingArchived={fetchingArchived}
                                        dropupCondition={projects_num_ok_dynamic >= 0}
                                        valueDynamic={`${Math.abs(projects_num_ok_dynamic)} шт. (${Math.abs(projects_num_ok_dynamic_percent)}%)`}
                                        hideDynamic={hideDynamic}
                                    />
                                    <Panel
                                        onPress={this.goToProblemProjects.bind(this)}
                                        warningCondition={projects_num_problem_dynamic >= 0}
                                        caption='Проблемные проекты'
                                        fetching={fetching}
                                        value={projects_num_problem}
                                        unit='шт.'
                                        fetchingArchived={fetchingArchived}
                                        dropupCondition={projects_num_problem_dynamic >= 0}
                                        valueDynamic={`${Math.abs(projects_num_problem_dynamic)} шт. (${Math.abs(projects_num_problem_dynamic_percent)}%)`}
                                        hideDynamic={hideDynamic}
                                    />
                                    {selectedProjectGroup.code === 'import' &&
                                        <View>
                                            <Panel
                                                warningCondition={state_funds_dynamic < 0}
                                                caption='Объем господдержки'
                                                fetching={fetching}
                                                value={state_funds}
                                                unit='млн. руб.'
                                                fetchingArchived={fetchingArchived}
                                                dropupCondition={state_funds_dynamic >= 0}
                                                valueDynamic={`${Math.abs(state_funds_dynamic)} млн. руб. (${Math.abs(state_funds_dynamic_percent)}%)`}
                                                hideDynamic={hideDynamic}
                                            />
                                            <Panel
                                                warningCondition={production_index_dynamic_percent < 0}
                                                caption='Индекс производства'
                                                fetching={fetching}
                                                value={`${production_index}%`}
                                                fetchingArchived={fetchingArchived}
                                                dropupCondition={production_index_dynamic_percent >= 0}
                                                valueDynamic={`${Math.abs(production_index_dynamic_percent)}%`}
                                                hideDynamic={hideDynamic}
                                            />
                                        </View>
                                    }
                                </View>
                                <View>
                                    <TouchableOpacity onPress={this.goToProjectsShowcase.bind(this)}>
                                        <View style={[paddingHorizontal, row, alignItemsCenter, spaceBetween, navigationButton]}>
                                            <Text style={[fontSize16, textWhite]}>
                                                Аналитика по проектам
                                            </Text>
                                            <IconEncircled style={iconEncircled} size={23} icon={forward} />
                                        </View>
                                    </TouchableOpacity>
                                    {periods && quarter && year &&
                                        <TouchableOpacity onPress={this.openQuarterSelector.bind(this)}>
                                            <View style={[container, row, alignItemsCenter, comparisonButton]}>
                                                <Icon name={graphBar} style={[textWhite, comparisonButtonIcon, paddingRight]} />
                                                <View>
                                                    <Text style={[fontSize10, textGreen]}>
                                                        Сравнение с:
                                                    </Text>
                                                    <Text style={[fontSize13, textWhite]}>
                                                        {quarter} квартал {year}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>

                            </View>

                            <View style={[flexWrapper, { overflow: 'hidden' }]}>
                                <WebView
                                    originWhitelist={['*']}
                                    ref={webview => { this.webview = webview; }}
                                    onMessage={this.onMessage.bind(this)}
                                    source={this.webViewSource}
                                    scrollEnabled={false}
                                    scalesPageToFit={false}
                                    // automaticallyAdjustContentInsets={false}
                                    bounces={false}
                                    domStorageEnabled
                                    javaScriptEnabled
                                    startInLoadingState
                                    onLoad={this.selectActiveRegion.bind(this, { regions, init: true })}
                                />
                            </View>

                            <TouchableWithoutFeedback onPress={this.togglePopupWrapper.bind(this)}>
                                <View style={[positionAbsolute, { width: map.width, height: map.height, top: popup.wrapperTop, left: 350 }]}>
                                    <View style={[positionAbsolute, popupStyle, { width: popup.width, height: popup.height, top: popup.top, left: popup.left }]}>
                                        <TouchableOpacity activeOpacity={0.5} style={popupHeaderWrapper} onPress={this.goToRegion.bind(this)}>
                                            <View style={[flexWrapper, row, alignItemsCenter, popupHeader]}>
                                                <Image source={REGION_IMAGES[ref]} style={popupHeaderImage} />
                                                <Text style={textBlue}>
                                                    {name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={[popupSection, justifyContentCenter, paddingLeft]}>
                                            <Text style={[fontSize12, textBlue]}>
                                                Всего предприятий: {companies_num}
                                            </Text>
                                        </View>
                                        <View style={[popupSection, justifyContentCenter, paddingLeft]}>
                                            <Text style={[fontSize12, textBlue]}>
                                                Убыточных предприятий: {unprofitable_companies_num} ({unprofitable_companies_percent}%)
                                            </Text>
                                        </View>
                                        <View style={[popupFooter, justifyContentCenter, paddingLeft]}>
                                            <Text style={fontSize10}>
                                                Работников промышленности: {workers_num} тыс. чел.
                                            </Text>
                                            <Text style={fontSize10}>
                                                Общая задолженность по ЗП: {debt} млн. руб.
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                }
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        data: state.mapData,
        filterRegion: state.mapRegionFilter,
        filterIndustry: state.mapIndustryFilter,
        filterProjectGroup: state.mapProjectGroupFilter,
        dimensions: state.device.dimensions
    };
};

export default connect(mapStateToProps, { fetchRegionsDynamicData, toggleModalVisibility, selectRegions, selectRegion })(Map);
