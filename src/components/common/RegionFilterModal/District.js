import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import RegionList from './RegionList';
import { Text } from '../index';

import styles from './styles';

class District extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.item.updated_at !== this.props.item.updated_at;
    }

    selectDistrict(selectedItem) {
        this.props.toggleDistrictFunction(selectedItem);
    }

    render() {
        const { item } = this.props;
        const { name, regions, code } = item;
        const { flexWrapper, districtListItem, districtListName } = styles;
        return (
            <View style={[flexWrapper, districtListItem]}>
                {code !== '0' &&
                    <TouchableOpacity onPress={this.selectDistrict.bind(this, item)}>
                        <Text style={districtListName}>
                            {name}
                        </Text>
                    </TouchableOpacity>
                }
                <RegionList regions={regions} filter={this.props.filter} toggleRegionFunction={this.props.toggleRegionFunction} />
            </View>
        );
    }
}

export default District;
