import sortBy from 'lodash-es/sortBy';
import isEqual from 'lodash-es/isEqual';
import React, { PureComponent } from 'react';
import { View, FlatList } from 'react-native';
import { Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { fetchCompanies, toggleModalVisibility, populateFilter } from '../../../actions';
import CompanyListItem from './CompanyListItem';
import { FilterPanel, LoadingIndicator, EmptyIndicator } from '../../common';
import { trackById } from '../../../constants/util';

import styles from './styles';

class Companies extends PureComponent {
    constructor(props) {
        super(props);
        this.selectedRegions = props.filterRegion.selected;
        this.selectedIndustries = props.filterIndustry.selected;
        const { navbarHeight, heightWithoutNavbar } = props.dimensions;
        this.modalStyle = { height: heightWithoutNavbar - 60, marginTop: navbarHeight + 60 };
    }

    componentDidMount() {
        const { fetchCompanies, populateFilter, params } = this.props;
        const { industries, regions } = params;
        fetchCompanies({ ...params, page: 1 });
        populateFilter({ filterType: 'companies-industry', data: industries });
        populateFilter({ filterType: 'companies-region', data: regions });
    }

    componentWillReceiveProps(nextProps) { // filter industry_id, region_code
        console.log('Companies component will receive props', nextProps);
        const selectedRegions = sortBy(nextProps.filterRegion.selected, 'code').map(o => o.code);
        const selectedIndustries = sortBy(nextProps.filterIndustry.selected, 'id').map(o => o.id);
        if (this.props.filterRegion.updated_at !== nextProps.filterRegion.updated_at && !isEqual(this.selectedRegions, selectedRegions)) {
            this.props.fetchCompanies({ industries: this.props.filterIndustry.selected, regions: nextProps.filterRegion.selected, page: 1 });
            this.selectedRegions = selectedRegions;
        }
        if (this.props.filterIndustry.updated_at !== nextProps.filterIndustry.updated_at && !isEqual(this.selectedIndustries, selectedIndustries)) {
            this.props.fetchCompanies({ industries: nextProps.filterIndustry.selected, regions: this.props.filterRegion.selected, page: 1 });
            this.selectedIndustries = selectedIndustries;
        }
    }

    onLoadMore = ({ distanceFromEnd }) => {
        const { companies, params, fetchCompanies } = this.props;
        const { current_page, last_page } = companies;
        if (current_page < last_page) {
            fetchCompanies({ industries: this.props.filterIndustry.selected, regions: this.props.filterRegion.selected, page: current_page + 1 });
        }
    };

    toggleIndustryList = () => {
        this.props.toggleModalVisibility('projects-industry');
        if (Actions.currentScene === 'filterModal') {
            Actions.pop();
        } else {
            Actions.filterModal({ currentScene: 'companies', filterType: 'companies-industry', style: this.modalStyle });
        }
    };

    toggleRegionList = () => {
        this.props.toggleModalVisibility('projects-region');
        if (Actions.currentScene === 'regionFilterModal') {
            Actions.pop();
        } else {
            Actions.regionFilterModal({ currentScene: 'companies', filterType: 'companies-region', style: this.modalStyle });
        }
    };

    renderHeader = () => {
        return <CompanyListItem />;
    };

    renderItem = ({ item }) => {
        return <CompanyListItem company={item} />;
    };

    renderFooter = () => {
        const { current_page, last_page } = this.props.companies;
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
        const { companies, filterIndustry, filterRegion } = this.props;
        const { fetching, fetchingError, data } = companies;
        const { selected: selectedIndustries } = filterIndustry;
        const { selected: selectedRegions } = filterRegion;

        const { flexWrapper, row, filterBlock, borderBottom, borderRight } = styles;

        return (
            <View style={flexWrapper}>
                <View style={[row, filterBlock, borderBottom]}>
                    <FilterPanel caption='Отрасль' selected={selectedIndustries.length > 0 ? selectedIndustries : 'Все отрасли'} onPress={this.toggleIndustryList.bind(this)} style={borderRight} />
                    <FilterPanel caption='Регион' selected={selectedRegions.length > 0 ? selectedRegions : 'Все регионы'} onPress={this.toggleRegionList.bind(this)} />
                    {/*<FilterPanel caption='Мера поддержки' selected={'Финансирование'} style={borderRight} />
                    <FilterPanel caption='Госпрограмма' selected={'Наименование'} />*/}
                </View>
                <View style={flexWrapper}>
                    {this.renderHeader()}
                    {fetching ?
                        <LoadingIndicator />
                        :
                        data.length > 0 ?
                            <FlatList
                                data={data}
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
        companies: state.companies,
        filterIndustry: state.companiesIndustryFilter,
        filterRegion: state.companiesRegionFilter,
        dimensions: state.device.dimensions
    };
};

export default connect(mapStateToProps, { fetchCompanies, toggleModalVisibility, populateFilter })(Companies);
