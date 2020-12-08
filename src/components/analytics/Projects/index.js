import sortBy from 'lodash-es/sortBy';
import isEqual from 'lodash-es/isEqual';
import React, { PureComponent } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchProjects, toggleModalVisibility, populateFilter, setDoNotApply, toggleSelect } from '../../../actions';
import ProjectListItem from './ProjectListItem';
import { Text, FilterPanel, LoadingIndicator, EmptyIndicator } from '../../common';
import { dropup, dropdown } from '../../../constants/Icons';
import { trackById } from '../../../constants/util';

import styles from './styles';

class Projects extends PureComponent {
    constructor(props) {
        super(props);
        this.selectedRegions = props.filterRegion.selected;
        this.selectedIndustries = props.filterIndustry.selected;
        this.selectedStatuses = props.filterStatus.selected;
        this.selectedProjectGroup = props.filterProjectGroup.selected.id;
        this.selectedCompanyId = null;
        const { navbarHeight, heightWithoutNavbar } = props.dimensions;
        this.modalStyle = { height: heightWithoutNavbar - 60, marginTop: navbarHeight + 60 };
    }

    componentDidMount() {
        const { fetchProjects, populateFilter, setDoNotApply, params, toggleSelect } = this.props;
        const { industries, regions, statuses, projectGroup, doNotApplyIndustryFilter } = params;
        if (projectGroup) {
            toggleSelect({ filterType: 'projects-project-group', selectedItem: projectGroup });
        }
        // fetchProjects({ ...params, page: 1 });
        populateFilter({ filterType: 'projects-status', data: statuses });
        populateFilter({ filterType: 'projects-industry', data: industries });
        setDoNotApply({ filterType: 'projects-industry', value: !!doNotApplyIndustryFilter });
        populateFilter({ filterType: 'projects-region', data: regions });
    }

    componentWillReceiveProps(nextProps) {
        const { regions, industries, projectGroup, statuses, requested_at, company_id } = nextProps.params;
        if (requested_at !== this.projectsRequestTimestamp) {
            this.projectsRequestTimestamp = requested_at;
            const selectedRegions = sortBy(regions, 'code').map(o => o.code);
            const selectedIndustries = sortBy(industries, 'id').map(o => o.id);
            const selectedStatuses = sortBy(statuses, 'id').map(o => o.id);
            const updRegions = regions && !isEqual(this.selectedRegions, selectedRegions);
            const updIndustries = industries && !isEqual(this.selectedIndustries, selectedIndustries);
            const updProjectGroup = projectGroup && !isEqual(this.selectedProjectGroup, projectGroup.id);
            const updStatuses = statuses && !isEqual(this.selectedStatuses, statuses);
            const updCompanyId = this.selectedCompanyId !== company_id;
            this.selectedCompanyId = company_id;
            console.log(regions, industries, projectGroup, statuses, requested_at, updRegions, updIndustries, updProjectGroup, updStatuses);
            if (updRegions || updIndustries || updProjectGroup || updStatuses || updCompanyId) {
                this.selectedRegions = selectedRegions;
                this.selectedIndustries = selectedIndustries;
                this.selectedProjectGroup = projectGroup.id;
                this.selectedStatuses = selectedStatuses;
                this.props.fetchProjects({ ...nextProps.params, page: 1 });
            }
        } else {
            const { fetchProjects, filterRegion, filterIndustry, filterStatus, filterProjectGroup, setDoNotApply, sort, sortDirection } = this.props;
            const selectedRegions = sortBy(nextProps.filterRegion.selected, 'code').map(o => o.code);
            const selectedIndustries = sortBy(nextProps.filterIndustry.selected, 'id').map(o => o.id);
            const selectedStatuses = sortBy(nextProps.filterStatus.selected, 'id').map(o => o.id);
            if (filterRegion.updated_at !== nextProps.filterRegion.updated_at && !isEqual(this.selectedRegions, selectedRegions)) {
                fetchProjects({ industries: filterIndustry.selected, regions: nextProps.filterRegion.selected, statuses: filterStatus.selected, page: 1, sort, sort_direction: sortDirection, projectGroup: filterProjectGroup.selected, company_id: this.selectedCompanyId });
                this.selectedRegions = selectedRegions;
            }
            if (filterIndustry.updated_at !== nextProps.filterIndustry.updated_at && !isEqual(this.selectedIndustries, selectedIndustries)) {
                fetchProjects({ industries: nextProps.filterIndustry.selected, regions: filterRegion.selected, statuses: filterStatus.selected, page: 1, sort, sort_direction: sortDirection, projectGroup: filterProjectGroup.selected, company_id: this.selectedCompanyId });
                setDoNotApply({ filterType: 'projects-industry', data: false });
                this.selectedIndustries = selectedIndustries;
            }
            if (filterStatus.updated_at !== nextProps.filterStatus.updated_at && !isEqual(this.selectedStatuses, selectedStatuses)) {
                fetchProjects({ industries: filterIndustry.selected, regions: filterRegion.selected, statuses: nextProps.filterStatus.selected, page: 1, sort, sort_direction: sortDirection, projectGroup: filterProjectGroup.selected, company_id: this.selectedCompanyId });
                this.selectedIndustries = selectedIndustries;
            }
            if (filterProjectGroup.updated_at !== nextProps.filterProjectGroup.updated_at && !isEqual(this.selectedProjectGroup, nextProps.filterProjectGroup.selected.id)) {
                this.selectedProjectGroup = nextProps.filterProjectGroup.selected.id;
                fetchProjects({ industries: filterIndustry.selected, regions: filterRegion.selected, statuses: filterStatus.selected, page: 1, sort, sort_direction: sortDirection, projectGroup: nextProps.filterProjectGroup.selected, company_id: this.selectedCompanyId });
            }
            if (sort !== nextProps.sort && sortDirection !== nextProps.sortDirection) {
                fetchProjects({ industries: filterIndustry.selected, regions: filterRegion.selected, statuses: filterStatus.selected, page: 1, sort: nextProps.sort, sort_direction: nextProps.sortDirection, projectGroup: filterProjectGroup.selected, company_id: this.selectedCompanyId });
            } else if (sortDirection !== nextProps.sortDirection) {
                fetchProjects({ industries: filterIndustry.selected, regions: filterRegion.selected, statuses: filterStatus.selected, page: 1, sort, sort_direction: nextProps.sortDirection, projectGroup: filterProjectGroup.selected, company_id: this.selectedCompanyId });
            }
        }
    }

    onLoadMore = ({ distanceFromEnd }) => {
        const { projects, fetchProjects, sort, sortDirection, filterIndustry, filterRegion, filterStatus, filterProjectGroup } = this.props;
        const { current_page, last_page } = projects;
        if (current_page < last_page) {
            fetchProjects({ industries: filterIndustry.selected, regions: filterRegion.selected, statuses: filterStatus.selected, page: current_page + 1, sort, sort_direction: sortDirection, projectGroup: filterProjectGroup.selected, company_id: this.selectedCompanyId });
        }
    };

    toggleIndustryList = () => {
        this.props.toggleModalVisibility('projects-industry');
        if (Actions.currentScene === 'filterModal') {
            Actions.pop();
        } else {
            Actions.filterModal({ currentScene: 'projects', filterType: 'projects-industry', style: this.modalStyle });
        }
    };

    toggleRegionList = () => {
        this.props.toggleModalVisibility('projects-region');
        if (Actions.currentScene === 'regionFilterModal') {
            Actions.pop();
        } else {
            Actions.regionFilterModal({ currentScene: 'projects', filterType: 'projects-region', style: this.modalStyle });
        }
    };

    toggleStatusList = () => {
        this.props.toggleModalVisibility('projects-status');
        if (Actions.currentScene === 'statusFilterModal') {
            Actions.pop();
        } else {
            Actions.statusFilterModal({ currentScene: 'projects', filterType: 'projects-status', style: this.modalStyle });
        }
    };

    toggleProjectGroupList = () => {
        this.props.toggleModalVisibility('projects-project-group');
        if (Actions.currentScene === 'selectModal') {
            Actions.pop();
        } else {
            Actions.selectModal({ currentScene: 'projects', filterType: 'projects-project-group', style: this.modalStyle });
        }
    };

    sort = () => {
        Actions.refresh({ sort: 'status_id', sortDirection: this.props.projects.sortOrder.status_id === 'desc' ? 'asc' : 'desc' });
    };

    renderHeader = () => {
        const { row, header, headerIcon, fontSize22, jcCenter, aiCenter, flexWrapper, nameCol, companyCol, statusCol, techCol, text, textWhite } = styles;

        return (
            <View style={[row, header]}>
                <View style={[nameCol, jcCenter]}>
                    <Text style={[text, textWhite]}>
                        Проект
                    </Text>
                </View>
                <View style={[companyCol, jcCenter]}>
                    <Text style={[text, textWhite]}>
                        Предприятие
                    </Text>
                </View>
                <TouchableOpacity style={statusCol} onPress={this.sort.bind(this)}>
                    <View style={[flexWrapper, row, aiCenter]}>
                        <Text style={[text, textWhite]}>
                            Статус
                        </Text>
                        <Icon name={this.props.projects.sortOrder.status_id === 'desc' ? dropup : dropdown} style={[fontSize22, headerIcon]} />
                    </View>
                </TouchableOpacity>
                <View style={[techCol, jcCenter]}>
                    <Text style={[text, textWhite]}>
                        Технологическое направление
                    </Text>
                </View>
            </View>
        );
    };

    renderItem = ({ item }) => {
        return <ProjectListItem project={item} />;
    };

    renderFooter = () => {
        const { current_page, last_page } = this.props.projects;
        const { flexWrapper, container } = styles;
        return (
            current_page < last_page ?
                <View style={[flexWrapper, container]}>
                    <Spinner />
                </View>
            : null
        );
    };

    render() {
        const { projects, filterIndustry, filterRegion, filterStatus, filterProjectGroup } = this.props;
        const { selected: selectedIndustries } = filterIndustry;
        const { selected: selectedRegions } = filterRegion;
        const { selected: selectedStatuses } = filterStatus;
        const { selected: selectedProjectGroup } = filterProjectGroup;

        const { flexWrapper, row, filterBlock, borderBottom, borderRight } = styles;

        return (
            <View style={flexWrapper}>
                <View style={[row, filterBlock, borderBottom]}>
                    <FilterPanel caption='Отрасль' selected={selectedIndustries.length > 0 ? selectedIndustries : 'Все отрасли'} onPress={this.toggleIndustryList.bind(this)} style={borderRight} />
                    <FilterPanel caption='Регион' selected={selectedRegions.length > 0 ? selectedRegions : 'Все регионы'} onPress={this.toggleRegionList.bind(this)} style={borderRight} />
                    <FilterPanel caption='Статус проекта' selected={selectedStatuses.length > 0 ? selectedStatuses : 'Все статусы'} onPress={this.toggleStatusList.bind(this)} style={borderRight} />
                    <FilterPanel caption='Группа проектов' selected={selectedProjectGroup ? selectedProjectGroup.name : 'Все группы проектов'} onPress={this.toggleProjectGroupList.bind(this)} />
                    {/*<FilterPanel caption='Мера поддержки' selected={'Финансирование'} style={borderRight} />
                    <FilterPanel caption='Госпрограмма' selected={'Наименование'} />*/}
                </View>
                <View style={flexWrapper}>
                    {this.renderHeader()}
                    {projects.fetching ?
                        <LoadingIndicator />
                        :
                        projects.data.length > 0 ?
                            <FlatList
                                data={projects.data}
                                keyExtractor={trackById}
                                renderItem={this.renderItem.bind(this)}
                                ListFooterComponent={this.renderFooter.bind(this)}
                                onEndReached={this.onLoadMore.bind(this)}
                                onEndReachedThreshold={0.1}
                            />
                            :
                            <EmptyIndicator text='Нет результатов по выбранным фильтрам.' />
                    }
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        projects: state.projects,
        filterIndustry: state.projectsIndustryFilter,
        filterRegion: state.projectsRegionFilter,
        filterStatus: state.projectsStatusFilter,
        filterProjectGroup: state.projectsProjectGroupFilter,
        dimensions: state.device.dimensions
    };
};

export default connect(mapStateToProps, { fetchProjects, toggleModalVisibility, populateFilter, setDoNotApply, toggleSelect })(Projects);
