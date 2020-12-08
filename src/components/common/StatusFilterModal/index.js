import cloneDeep from 'lodash-es/cloneDeep';
import React, { PureComponent } from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { toggleModalVisibility } from '../../../actions';
import ListItem from './ListItem';
import { Button } from '../';
import { toggleItemSelection, resetFilter } from '../../../reducers/FilterHelpers';

import styles from './styles';

class StatusFilterModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { localData: cloneDeep(props.data) };
    }

    toggleModal = () => {
        this.props.toggleModalVisibility(this.props.filterType, { currentScene: this.props.currentScene, data: this.state.localData });
        Actions.pop();
    };

    resetFilter = () => {
        this.setState({ localData: resetFilter(this.state.localData) });
    };

    toggleFunction = (item) => {
        this.setState({ localData: toggleItemSelection(this.state.localData, item) });
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
        const { localData } = this.state;
        const { colLeft, colRight } = localData.divided;
        const { filterModal, fullWidth, flexWrapper, container, row, districtList, buttonWrapper, button, buttonApply, buttonReset } = styles;

        return (
            <Animated.View style={[filterModal, fullWidth, style]}>
                <View style={[flexWrapper, container]}>
                    <ScrollView>
                        <View style={[flexWrapper, row, districtList]}>
                            {this.renderList(colLeft)}
                            {this.renderList(colRight)}
                        </View>
                    </ScrollView>
                    <View style={[buttonWrapper, row]}>
                        <Button style={[button, buttonApply]} onPress={this.toggleModal.bind(this)}>
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
        case 'projects':
            return { data: state.projectsStatusFilter };
    }
};

export default connect(mapStateToProps, { toggleModalVisibility })(StatusFilterModal);
