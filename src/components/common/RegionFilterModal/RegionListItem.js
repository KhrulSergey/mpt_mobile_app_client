import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '../';
import { forward } from '../../../constants/Icons';

import styles from './styles';

class RegionListItem extends Component {
    constructor(props) {
        super(props);
        this.state = { selected: props.item.selected };
    }

    shouldComponentUpdate(nextProps) {
        return this.props.item.selected !== nextProps.item.selected;
    }

    selectRegion(selectedItem) {
        this.props.toggleRegionFunction(selectedItem);
        this.setState({ selected: !selectedItem.selected });
    }

    render() {
        const { item } = this.props;
        const { name, selected } = item;
        const { selectedIcon, regionName, regionNameSelected } = styles;
        return (
            <TouchableOpacity onPress={this.selectRegion.bind(this, item)}>
                {selected && <Icon name={forward} style={selectedIcon} />}
                <Text style={[regionName, selected && regionNameSelected]}>
                    {name}
                </Text>
            </TouchableOpacity>
        );
    }
}

export default RegionListItem;
