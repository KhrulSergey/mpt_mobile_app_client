import find from 'lodash-es/find';
import sortBy from 'lodash-es/sortBy';
import isEqual from 'lodash-es/isEqual';
import React, { PureComponent } from 'react';
import { View, FlatList, Image, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { fetchProjectsSummarized, populateFilter, toggleModalVisibility, toggleSelect } from '../../../actions';
import IndustryListItem from './IndustryListItem';
import PieChart from '../../common/PieChart';
import { FilterPanel, LoadingIndicator, Text } from '../../common';
import { trackByIndex } from '../../../constants/util';
// import { renderTitle } from '../../../Router';

import styles from './styles';

class ProjectsSummarized extends PureComponent {
    constructor(props) {
        super(props);
        // this.selectedRegions = props.filterRegion.selected;
        // this.selectedIndustries = props.filterIndustry.selected;
        // this.selectedProjectGroup = props.filterProjectGroup.selected;
        const { navbarHeight, heightWithoutNavbar } = props.dimensions;
        this.modalStyle = { height: heightWithoutNavbar - 60, marginTop: navbarHeight + 60 };
        this.cases = { nom: 'проект', gen: 'проекта', plu: 'проектов' };
    }

    componentDidMount() {
        const { fetchProjectsSummarized, populateFilter, params, toggleSelect } = this.props;
        const { industries, regions, projectGroup } = params;
        if (projectGroup) {
            // toggleSelect({ filterType: 'projects-project-group', selectedItem: projectGroup });
            populateFilter({ filterType: 'map-project-group', data: projectGroup });
            this.selectedProjectGroup = projectGroup.id;
        }
        fetchProjectsSummarized({ ...params });
        // populateFilter({ filterType: 'projects-industry', data: industries });
        // populateFilter({ filterType: 'projects-region', data: regions });
        this.selectedRegions = sortBy(regions, 'code').map(o => o.code);
        this.selectedIndustries = sortBy(industries, 'id').map(o => o.id);
    }

    componentWillReceiveProps(nextProps) {
        const { filterRegion, filterIndustry, filterProjectGroup, fetchProjectsSummarized } = this.props;
        const selectedRegions = sortBy(nextProps.filterRegion.selected, 'code').map(o => o.code);
        const selectedIndustries = sortBy(nextProps.filterIndustry.selected, 'id').map(o => o.id);
        if (nextProps.filterRegion.currentScene === 'projectsSummarized' && filterRegion.updated_at !== nextProps.filterRegion.updated_at && !isEqual(this.selectedRegions, selectedRegions)) {
            fetchProjectsSummarized({ industries: filterIndustry.selected, regions: nextProps.filterRegion.selected, projectGroup: filterProjectGroup.selected });
            this.selectedRegions = selectedRegions;
        }
        if (nextProps.filterIndustry.currentScene === 'projectsSummarized' && filterIndustry.updated_at !== nextProps.filterIndustry.updated_at && !isEqual(this.selectedIndustries, selectedIndustries)) {
            fetchProjectsSummarized({ industries: nextProps.filterIndustry.selected, regions: filterRegion.selected, projectGroup: filterProjectGroup.selected });
            this.selectedIndustries = selectedIndustries;
        }
        if (nextProps.filterProjectGroup.currentScene === 'projectsSummarized' && filterProjectGroup.updated_at !== nextProps.filterProjectGroup.updated_at && !isEqual(this.selectedProjectGroup, nextProps.filterProjectGroup.selected.id)) {
            this.selectedProjectGroup = nextProps.filterProjectGroup.selected.id;
            fetchProjectsSummarized({ industries: filterIndustry.selected, regions: filterRegion.selected, projectGroup: nextProps.filterProjectGroup.selected });
            // if (this.selectedProjectGroup) {
            //     Actions.refresh({ renderTitle: renderTitle({ title: this.selectedProjectGroup.name }) });
            // }
        }
    }

    toggleIndustryList = () => {
        this.props.toggleModalVisibility('map-industry');
        if (Actions.currentScene === 'filterModal') {
            Actions.pop();
        } else {
            Actions.filterModal({ currentScene: 'projectsSummarized', filterType: 'map-industry', style: this.modalStyle });
        }
    };

    toggleRegionList = () => {
        this.props.toggleModalVisibility('map-region');
        if (Actions.currentScene === 'regionFilterModal') {
            Actions.pop();
        } else {
            Actions.regionFilterModal({ currentScene: 'projectsSummarized', filterType: 'map-region', style: this.modalStyle });
        }
    };

    toggleProjectGroupList = () => {
        this.props.toggleModalVisibility('map-project-group');
        if (Actions.currentScene === 'selectModal') {
            Actions.pop();
        } else {
            Actions.selectModal({ currentScene: 'projectsSummarized', filterType: 'map-project-group', style: this.modalStyle });
        }
    };

    renderHeader = () => {
        return <IndustryListItem projectGroupCodeIsImport={this.props.projects.data.projectGroupCodeIsImport} />;
    };

    renderItem = ({ item }) => {
        const { selected } = this.props.filterProjectGroup;
        return <IndustryListItem industry={item} statuses={this.props.projectStatuses} projectGroup={selected} projectGroupCodeIsImport={this.props.projects.data.projectGroupCodeIsImport} />;
    };

    renderSummaryButton = (data) => {
        const { summaryButton, textWhite } = styles;

        return (
            <View style={summaryButton}>
                <Text style={textWhite}>
                    Все проекты ({data.projects_num})
                </Text>
            </View>
        );
    };

    action = (status) => {
        Actions.projects({
            params: { statuses: status ? [status] : null, industries: this.props.filterIndustry.selected, regions: this.props.filterRegion.selected, projectGroup: this.props.filterProjectGroup.selected, requested_at: Date.now() }
        });
    };

    render() {
        const { projects, filterIndustry, filterRegion, filterProjectGroup, projectStatuses } = this.props;
        const { data, fetching, fetchingError } = projects;
        const { paused, behind_schedule, on_schedule, planning } = projectStatuses;
        const { selected: selectedIndustries } = filterIndustry;
        const { selected: selectedRegions } = filterRegion;

        const { flexWrapper, row, container, filterBlock, borderRight, eagleShape } = styles;

        return (
            fetching || fetchingError ?
            <LoadingIndicator />
            :
            <View style={flexWrapper}>
                <View style={[row, filterBlock]}>
                    <FilterPanel
                        caption='Отрасль'
                        selected={selectedIndustries.length > 0 ? selectedIndustries : 'Все отрасли'}
                        onPress={this.toggleIndustryList.bind(this)} style={borderRight}
                    />
                    <FilterPanel
                        caption='Регион'
                        selected={selectedRegions.length > 0 ? selectedRegions : 'Все регионы'}
                        onPress={this.toggleRegionList.bind(this)} style={borderRight}
                    />
                    <FilterPanel
                        caption='Группа проектов'
                        selected={filterProjectGroup.selected ? filterProjectGroup.selected.name : 'Все группы проектов'}
                        onPress={this.toggleProjectGroupList.bind(this)}
                    />
                </View>
                <ScrollView>
                    <View style={flexWrapper}>
                        <View style={container}>
                            <Image source={require('../../../images/Shape.png')} style={eagleShape} />
                            {data.sections.length > 0 &&
                                <PieChart
                                    data={data}
                                    actions={[this.action.bind(this, on_schedule), this.action.bind(this, behind_schedule), this.action.bind(this, paused), this.action.bind(this, planning)]}
                                    summaryAction={{ content: this.renderSummaryButton(data), action: this.action.bind(this, null) }}
                                    height={250} entityCases={this.cases}
                                />
                            }
                            {/*<TouchableOpacity onPress={this.action.bind(this, null)} style={[summaryButton, header]}>
                                <Text style={textWhite}>Все проекты</Text>
                            </TouchableOpacity>*/}
                        </View>
                        {this.renderHeader()}
                        <FlatList
                            data={data.industries}
                            keyExtractor={trackByIndex}
                            renderItem={this.renderItem.bind(this)}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        projectStatuses: state.refs.data.projectStatusesKeyedByCodeDict,
        projects: state.projectsSummarized,
        filterIndustry: state.mapIndustryFilter,
        filterRegion: state.mapRegionFilter,
        filterProjectGroup: state.mapProjectGroupFilter,
        dimensions: state.device.dimensions
    };
};

export default connect(mapStateToProps, { fetchProjectsSummarized, populateFilter, toggleModalVisibility, toggleSelect })(ProjectsSummarized);
