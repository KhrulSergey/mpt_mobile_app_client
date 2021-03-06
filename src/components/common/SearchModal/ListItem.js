import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '../index';
import { forward } from '../../../constants/Icons';

import styles from './styles';

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state = { selected: props.item.selected };
    }

    shouldComponentUpdate(nextProps) {
        return (this.props.item.selected !== nextProps.item.selected);
    }

    selectItem(selectedItem) {
        this.props.toggleFunction(selectedItem);
        this.setState({ selected: !selectedItem.selected });
    }

    render() {
        const { item } = this.props;
        const { name, selected, company } = item;
        const { selectedIcon, regionName, regionNameSelected, companyName, marginBottom } = styles;
        return (
            <TouchableOpacity onPress={this.selectItem.bind(this, item)}>
                {selected && <Icon name={forward} style={selectedIcon} />}
                <Text style={[regionName, selected && regionNameSelected, !company && marginBottom]}>
                    {name}
                </Text>
                {company &&
                    <Text style={[companyName, marginBottom]}>
                        {company.name}
                    </Text>
                }
            </TouchableOpacity>
        );
    }
}

export default ListItem;
