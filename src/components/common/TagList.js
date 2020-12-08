import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import { Tag } from './';

class TagList extends PureComponent {
    constructor(props) {
        super(props);
        this.keyProp = props.filterType.includes('region') ? 'code' : 'id';
    }

    deselectRegion = (selectedItem) => {
        this.props.toggleFunction(selectedItem);
    };

    renderTagList = (itemList) => itemList.map(((item) => <Tag key={item[this.keyProp]} text={item.name} onPress={this.deselectRegion.bind(this, item)} />));

    render() {
        return (
            <ScrollView horizontal>
                {this.renderTagList(this.props.items.selected)}
            </ScrollView>
        );
    }
}

export default TagList;
