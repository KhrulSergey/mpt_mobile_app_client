import each from 'lodash-es/each';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from './';
import { manatee, white } from '../../constants/Colors';
import { forward } from '../../constants/Icons';

const FilterPanel = (props) => {
    const { style, onPress, caption, selected } = props;
    let filterText;
    if (selected instanceof Array) {
        const selectedArray = [];
        each(selected, (item) => {
            selectedArray.push(item.name);
        });
        filterText = selectedArray.join(', ');
    } else {
        filterText = selected;
    }

    const { flexWrapper, container, row, captionText, alignItemsCenter, spaceBetween, icon, marginRight } = styles;

    return (
        <View style={[flexWrapper, container, row, alignItemsCenter, spaceBetween, style]}>
            <TouchableOpacity style={flexWrapper} onPress={onPress}>
                <View>
                    <Text style={captionText}>
                        {caption}
                    </Text>
                    <View style={[row, alignItemsCenter, spaceBetween]}>
                        <Text numberOfLines={1} style={marginRight}>
                            {filterText}
                        </Text>
                        <Icon name={forward} style={icon} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    flexWrapper: {
        flex: 1
    },
    container: {
        padding: 20,
        backgroundColor: white
    },
    row: {
        flexDirection: 'row'
    },
    captionText: {
        fontSize: 10,
        color: manatee,
        marginBottom: 2
    },
    alignItemsCenter: {
        alignItems: 'center'
    },
    spaceBetween: {
        justifyContent: 'space-between'
    },
    icon: {
        fontSize: 18
    },
    marginRight: {
        marginRight: 5
    }
};

export { FilterPanel };
