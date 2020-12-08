import cloneDeep from 'lodash-es/cloneDeep';
import React, { PureComponent } from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { toggleModalVisibility } from '../../../actions';
import District from './District';
import RegionList from './RegionList';
import TagList from '../TagList';
import { Button, FlatTextInput } from '../';
import { applyTextFilter, toggleDistrictSelection, toggleRegionSelection, resetGroupedFilter } from '../../../reducers/FilterHelpers';
import { menuButton } from '../../../Router';

import styles from './styles';

class RegionFilterModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { textFilter: '', localData: cloneDeep(props.data) };
    }

    applyFilter = () => {
        this.props.toggleModalVisibility(this.props.filterType, { currentScene: this.props.currentScene, data: this.state.localData });
        if (this.props.currentScene === 'map') {
            Actions.replace('map', menuButton);
        } else {
            Actions.pop();
        }
    };

    resetFilter = () => {
        this.setState({ ...this.state, localData: resetGroupedFilter(this.state.localData) });
    };

    onTextFilterChange = (textFilter) => {
        this.setState({ ...this.state, textFilter, localData: applyTextFilter(this.state.localData, textFilter) });
    };

    toggleDistrictFunction = (item) => {
        this.setState({ ...this.state, localData: toggleDistrictSelection(this.state.localData, item) });
    };

    toggleRegionFunction = (item) => {
        this.setState({ ...this.state, localData: toggleRegionSelection(this.state.localData, item) });
    };

    renderDistrictList = (itemList) => {
        const { flexWrapper } = styles;

        return (
            <View style={flexWrapper}>
                {itemList.map(((item) => <District key={item.id} item={item} filter={this.props.filterType} toggleDistrictFunction={this.toggleDistrictFunction} toggleRegionFunction={this.toggleRegionFunction} />))}
            </View>
        );
    };

    render() {
        const { filterType, style } = this.props;
        const { localData, textFilter } = this.state;
        const { colLeft, colRight } = textFilter ? localData.filteredDivided : localData.groupedDivided;
        const { filterModal, fullWidth, flexWrapper, container, row, tagListWrapper, districtList, buttonWrapper, button, buttonApply, buttonReset } = styles;

        return (
            <Animated.View style={[filterModal, fullWidth, style]}>
                <View style={[flexWrapper, container]}>
                    <FlatTextInput
                        value={textFilter}
                        placeholder='Найти регион'
                        onChangeText={this.onTextFilterChange.bind(this)}
                        theme='dark'
                    />
                    <View style={tagListWrapper}>
                        <TagList items={localData} filterType={filterType} toggleFunction={this.toggleRegionFunction} />
                    </View>
                    <ScrollView>
                        {textFilter ?
                            <View style={[flexWrapper, row, districtList]}>
                                <RegionList regions={colLeft} filter={filterType} toggleRegionFunction={this.toggleRegionFunction} />
                                <RegionList regions={colRight} filter={filterType} toggleRegionFunction={this.toggleRegionFunction} />
                            </View>
                            :
                            <View style={[flexWrapper, row, districtList]}>
                                {this.renderDistrictList(colLeft)}
                                {this.renderDistrictList(colRight)}
                            </View>
                        }
                    </ScrollView>
                    <View style={[buttonWrapper, row]}>
                        <Button style={[button, buttonApply]} onPress={this.applyFilter.bind(this)}>
                            Применить фильтр
                        </Button>
                        <Button style={[button, buttonReset]} onPress={this.resetFilter.bind(this)} color='black'>
                            Очистить фильтр
                        </Button>
                    </View>
                </View>
            </Animated.View>
        );
    }
}

const mapStateToProps = (state, props) => {
    switch (props.currentScene) {
        case 'map':
        case 'projectsShowcase':
        case 'projectsSummarized':
            return { data: state.mapRegionFilter };
        case 'projects':
            return { data: state.projectsRegionFilter };
        case 'companies':
            return { data: state.companiesRegionFilter };
        case 'voting':
            return { data: state.votingRegionFilter };
    }
};

export default connect(mapStateToProps, { toggleModalVisibility })(RegionFilterModal);
