import React, { PureComponent } from 'react';
import { View } from 'react-native';
import RegionListItem from './RegionListItem';

import styles from './styles';

class RegionList extends PureComponent {
    renderRegionList = (itemList) => itemList.map(((item) => <RegionListItem key={item.id} item={item} filter={this.props.filter} toggleRegionFunction={this.props.toggleRegionFunction} />));

    render() {
        const { flexWrapper } = styles;

        return (
            <View style={flexWrapper}>
                {this.renderRegionList(this.props.regions)}
            </View>
        );
    }
}

export default RegionList;
