import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { IconEncircled, Text } from '../../common';
import { dropup, dropdown, forward } from '../../../constants/Icons';

import styles from './styles';

function Panel({ onPress, warningCondition, caption, fetching, value, unit, fetchingArchived, dropupCondition, valueDynamic, hideDynamic, captionStyle }) {
    const { flexWrapper, row, alignItemsCenter, spaceBetween, panel, panelOk, panelWarning, fontSize12, fontSize24, fontSize13, fontSize10, textWhite, panelBottomText, panelIcon, paddingRight, iconEncircled } = styles;

    const content = (
        <View style={[panel, hideDynamic ? panelOk : warningCondition ? panelWarning : panelOk]}>
            <View style={[row, alignItemsCenter, spaceBetween]}>
                <Text style={[fontSize12, textWhite, captionStyle]}>
                    {caption}
                </Text>
                {onPress && <IconEncircled style={iconEncircled} size={23} icon={forward} />}
            </View>
            <View style={[flexWrapper, row, alignItemsCenter, spaceBetween]}>
                {fetching ?
                    <ActivityIndicator size='large' />
                    :
                    <View style={row}>
                        <Text style={[fontSize24, textWhite, panelBottomText, paddingRight]}>
                            {value}
                        </Text>
                        {unit &&
                            <Text style={[fontSize13, textWhite, panelBottomText]}>
                                {unit}
                            </Text>
                        }
                    </View>
                }
                {!hideDynamic && (
                    fetchingArchived || fetching ?
                        <ActivityIndicator />
                        :
                        <View style={row}>
                            <Icon name={dropupCondition ? dropup : dropdown} style={[textWhite, panelIcon, paddingRight]} />
                            <Text style={[fontSize10, textWhite, panelBottomText]}>
                                {valueDynamic}
                            </Text>
                        </View>
                )}
            </View>
        </View>
    );

    return (
        onPress ?
            <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
                {content}
            </TouchableOpacity>
            :
            content
    );
}

export default Panel;
