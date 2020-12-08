import map from 'lodash-es/map';
import sortBy from 'lodash-es/sortBy';
import isEqual from 'lodash-es/isEqual';
import React, { PureComponent } from 'react';
import { View, FlatList, Image, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { fetchProjectsShowcase, populateFilter, toggleModalVisibility } from '../../../actions';
import ProjectGroupListItem from './ProjectGroupListItem';
import PieChart from '../../common/PieChart';
import { FilterPanel, LoadingIndicator } from '../../common';
import { trackByIndex } from '../../../constants/util';
// import { renderTitle } from '../../../Router';

import styles from './styles';

class ProjectsShowcase extends PureComponent {
    constructor(props) {
        super(props);
        // this.selectedRegions = props.filterRegion.selected;
        // this.selectedIndustries = props.filterIndustry.selected;
        const { navbarHeight, heightWithoutNavbar } = props.dimensions;
        this.modalStyle = { height: heightWithoutNavbar - 60, marginTop: navbarHeight + 60 };
        this.cases = { nom: 'проект', gen: 'проекта', plu: 'проектов' };
    }

    componentDidMount() {
        const { fetchProjectsShowcase, populateFilter, params } = this.props;
        const { industries, regions } = params;
        fetchProjectsShowcase({ ...params });
        // populateFilter({ filterType: 'projects-industry', data: industries });
        // populateFilter({ filterType: 'projects-region', data: regions });
        this.selectedRegions = sortBy(regions, 'code').map(o => o.code);
        this.selectedIndustries = sortBy(industries, 'id').map(o => o.id);
    }

    componentWillReceiveProps(nextProps) {
        const { filterRegion, filterIndustry, fetchProjectsShowcase } = this.props;
        const selectedRegions = sortBy(nextProps.filterRegion.selected, 'code').map(o => o.code);
        const selectedIndustries = sortBy(nextProps.filterIndustry.selected, 'id').map(o => o.id);
        if (nextProps.filterRegion.currentScene === 'projectsShowcase' && filterRegion.updated_at !== nextProps.filterRegion.updated_at && !isEqual(this.selectedRegions, selectedRegions)) {
            fetchProjectsShowcase({ industries: filterIndustry.selected, regions: nextProps.filterRegion.selected });
            this.selectedRegions = selectedRegions;
        }
        if (nextProps.filterIndustry.currentScene === 'projectsShowcase' && filterIndustry.updated_at !== nextProps.filterIndustry.updated_at && !isEqual(this.selectedIndustries, selectedIndustries)) {
            fetchProjectsShowcase({ industries: nextProps.filterIndustry.selected, regions: filterRegion.selected });
            this.selectedIndustries = selectedIndustries;
        }
    }

    toggleIndustryList = () => {
        this.props.toggleModalVisibility('map-industry');
        if (Actions.currentScene === 'filterModal') {
            Actions.pop();
        } else {
            Actions.filterModal({ currentScene: 'projectsShowcase', filterType: 'map-industry', style: this.modalStyle });
        }
    };

    toggleRegionList = () => {
        this.props.toggleModalVisibility('map-region');
        if (Actions.currentScene === 'regionFilterModal') {
            Actions.pop();
        } else {
            Actions.regionFilterModal({ currentScene: 'projectsShowcase', filterType: 'map-region', style: this.modalStyle });
        }
    };

    renderHeader = () => {
        return <ProjectGroupListItem />;
    };

    renderItem = ({ item }) => {
        return <ProjectGroupListItem projectGroup={item} />;
    };

    action = (projectGroup) => {
        Actions.projectsSummarized({
            params: { industries: this.props.filterIndustry.selected, regions: this.props.filterRegion.selected, projectGroup },
            // renderTitle: renderTitle({ title: projectGroup.name })
        });
    };

    render() {
        const { projects, filterIndustry, filterRegion } = this.props;
        const { data, fetching, fetchingError } = projects;
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
                        onPress={this.toggleRegionList.bind(this)}
                    />
                </View>
                <ScrollView>
                    <View style={flexWrapper}>
                        <View style={container}>
                            <Image source={require('../../../images/Shape.png')} style={eagleShape} />
                            {data.sections.length > 0 &&
                            <PieChart
                                data={data}
                                actions={map(data.groups, s => this.action.bind(this, s))}
                                height={250} entityCases={this.cases}
                            />
                            }
                        </View>
                        {this.renderHeader()}
                        <FlatList
                            data={data.groups}
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
        projectStatuses: state.refs.data.projectStatuses,
        projects: state.projectsShowcase,
        filterIndustry: state.mapIndustryFilter,
        filterRegion: state.mapRegionFilter,
        dimensions: state.device.dimensions
    };
};

export default connect(mapStateToProps, { fetchProjectsShowcase, populateFilter, toggleModalVisibility })(ProjectsShowcase);
