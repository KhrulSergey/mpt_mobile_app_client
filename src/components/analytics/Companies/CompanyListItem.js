import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Text } from '../../common';

import styles from './styles';

class CompanyListItem extends PureComponent {
    onCompanyPress = () => {
        Actions.company({ id: this.props.company.id });
    };

    render() {
        const { row, borderBottom, header, nameCol, industryCol, regionCol, borderRight, text, textBlue, textWhite } = styles;
        
        if (this.props.company) {
            const { name, industries, region_name } = this.props.company;
            return (
                <View style={[row, borderBottom]}>
                    <TouchableOpacity style={[nameCol, borderRight]} onPress={this.onCompanyPress.bind(this)}>
                        <Text style={[text, textBlue]}>
                            {name}
                        </Text>
                    </TouchableOpacity>
                    <View style={[industryCol, borderRight]}>
                        <Text style={text}>
                            {industries}
                        </Text>
                    </View>
                    <View style={regionCol}>
                        <Text style={text}>
                            {region_name}
                        </Text>
                    </View>
                </View>
            );
        }
        return (
            <View style={[row, header]}>
                <View style={nameCol}>
                    <Text style={[text, textWhite]}>
                        Предприятие
                    </Text>
                </View>
                <View style={industryCol}>
                    <Text style={[text, textWhite]}>
                        Отрасль
                    </Text>
                </View>
                <View style={regionCol}>
                    <Text style={[text, textWhite]}>
                        Регион
                    </Text>
                </View>
            </View>
        );
    }
}

export default CompanyListItem;
