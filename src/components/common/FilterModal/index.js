import cloneDeep from 'lodash-es/cloneDeep';
import React, { PureComponent } from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { toggleModalVisibility } from '../../../actions';
import ListItem from './ListItem';
import TagList from '../TagList';
import { Button, FlatTextInput } from '../';
import { applyTextFilter, toggleItemSelection, resetFilter } from '../../../reducers/FilterHelpers';
import { menuButton } from '../../../Router';

import styles from './styles';

class FilterModal extends PureComponent {
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
        this.setState({ ...this.state, localData: resetFilter(this.state.localData) });
    };

    onTextFilterChange = (textFilter) => {
        this.setState({ ...this.state, textFilter, localData: applyTextFilter(this.state.localData, textFilter) });
    };

    toggleFunction = (item) => {
        this.setState({ ...this.state, localData: toggleItemSelection(this.state.localData, item) });
    };

    renderList = (itemList) => {
        const { flexWrapper } = styles;

        return (
            <View style={flexWrapper}>
                {itemList.map(((item) => <ListItem key={item.id} item={item} filterType={this.props.filterType} toggleFunction={this.toggleFunction} />))}
            </View>
        );
    };

    render() {
        const { filterType, style } = this.props;
        const { localData, textFilter } = this.state;
        const { colLeft, colRight } = textFilter ? localData.filteredDivided : localData.divided;
        const { filterModal, fullWidth, flexWrapper, container, row, tagListWrapper, districtList, buttonWrapper, button, buttonApply, buttonReset } = styles;

        return (
            <Animated.View style={[filterModal, fullWidth, style]}>
                <View style={[flexWrapper, container]}>
                    <FlatTextInput
                        value={textFilter}
                        placeholder='Найти...'
                        onChangeText={this.onTextFilterChange.bind(this)}
                        theme='dark'
                    />
                    <View style={tagListWrapper}>
                        <TagList items={localData} filterType={filterType} toggleFunction={this.toggleFunction} />
                    </View>
                    <ScrollView>
                        <View style={[flexWrapper, row, districtList]}>
                            {this.renderList(colLeft)}
                            {this.renderList(colRight)}
                        </View>
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
            return { data: state.mapIndustryFilter };
        case 'projects':
            return { data: state.projectsIndustryFilter };
        case 'companies':
            return { data: state.companiesIndustryFilter };
        case 'voting':
            return { data: state.votingIndustryFilter };
    }
};

export default connect(mapStateToProps, { toggleModalVisibility })(FilterModal);
