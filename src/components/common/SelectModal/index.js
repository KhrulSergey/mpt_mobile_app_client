import cloneDeep from 'lodash-es/cloneDeep';
import React, { PureComponent } from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { toggleModalVisibility } from '../../../actions';
import ListItem from './ListItem';
import { Button } from '../';
import { toggleRadioItemSelection } from '../../../reducers/FilterHelpers';
import { menuButton } from '../../../Router';

import styles from './styles';

class SelectModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { localData: cloneDeep(props.data) };
    }

    applyFilter = () => {
        this.props.toggleModalVisibility(this.props.filterType, { currentScene: this.props.currentScene, data: this.state.localData });
        if (this.props.currentScene === 'map') {
            Actions.replace('map', menuButton);
        } else {
            Actions.pop();
        }
    };

    toggleFunction = (item) => {
        this.setState({ ...this.state, localData: toggleRadioItemSelection(this.state.localData, item) });
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
        const { style } = this.props;
        const { localData } = this.state;
        const { filterModal, fullWidth, flexWrapper, container, row, districtList, buttonWrapper, button, buttonApply } = styles;

        return (
            <Animated.View style={[filterModal, fullWidth, style]}>
                <View style={[flexWrapper, container]}>
                    <ScrollView>
                        <View style={[flexWrapper, row, districtList]}>
                            {this.renderList(localData.list)}
                        </View>
                    </ScrollView>
                    <View style={[buttonWrapper, row]}>
                        <Button style={[button, buttonApply]} onPress={this.applyFilter.bind(this)}>
                            Применить фильтр
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
        case 'projectsSummarized':
            return { data: state.mapProjectGroupFilter };
        case 'projects':
            return { data: state.projectsProjectGroupFilter };
    }
};

export default connect(mapStateToProps, { toggleModalVisibility })(SelectModal);
