import cloneDeep from 'lodash-es/cloneDeep';
import unionBy from 'lodash-es/unionBy';
import React, { PureComponent } from 'react';
import { View, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { applyTextFilter, toggleModalVisibility } from '../../../actions';
import ListItem from './ListItem';
import TagList from '../TagList';
import { Button, FlatTextInput } from '../';
import { divideArray, toggleItemSelection, resetFilter } from '../../../reducers/FilterHelpers';

import styles from './styles';

class SearchModal extends PureComponent {
    constructor(props) {
        super(props);
        this.updated_at = props.data.updated_at;
        this.state = { pattern: '', localData: cloneDeep(props.data) };
    }

    componentWillUpdate(nextProps) {
        // plain: [],
        // divided: { colLeft: [], colRight: [] },
        // selected: [],
        if (nextProps.data.updated_at === this.updated_at) return;
        const plain = unionBy(this.state.localData.selected, nextProps.data.plain, 'id');
        this.setState({ ...this.state, localData: {
            ...this.state.localData,
            plain,
            divided: divideArray(plain)
        } });
        this.updated_at = nextProps.data.updated_at;
    }

    onStringPatternChange = (pattern) => {
        this.setState({ pattern });
        if (pattern && pattern.length > 2) {
            clearTimeout(this.timerId);
            this.timerId = setTimeout(() => this.props.applyTextFilter({ filterType: this.props.filterType, textFilter: pattern }), 1000);
        }
    };

    applyFilter = () => {
        this.props.toggleModalVisibility(this.props.filterType, this.state.localData);
        Actions.pop();
    };

    resetFilter = () => {
        this.setState({ ...this.state, localData: resetFilter(this.state.localData) });
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
        const { data, filterType, style } = this.props;
        const { localData, textFilter } = this.state;
        const { colLeft, colRight } = localData.divided;
        const { filterModal, fullWidth, flexWrapper, container, fetchingIndicator, row, tagListWrapper, districtList, buttonWrapper, button, buttonApply, buttonReset } = styles;

        return (
            <Animated.View style={[filterModal, fullWidth, style]}>
                <View style={[flexWrapper, container]}>
                    <FlatTextInput
                        value={textFilter}
                        placeholder='Найти...'
                        onChangeText={this.onStringPatternChange.bind(this)}
                        theme='dark'
                    />
                    {data.fetching && <ActivityIndicator size='small' style={fetchingIndicator} />}
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
    switch (props.filterType) {
        case 'voting-company':
            return { data: state.votingCompanyFilter };
        case 'meeting-user':
            return { data: state.meetingUserFilter };
    }
};

export default connect(mapStateToProps, { applyTextFilter, toggleModalVisibility })(SearchModal);
