import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '../../common';
import { checkmark } from '../../../constants/Icons';

import styles from './styles';

class ProjectListItem extends PureComponent {
    onProjectPress = () => {
        Actions.project({ id: this.props.project.id });
    };

    onCompanyPress = () => {
        Actions.company({ id: this.props.project.company_id });
    };

    renderStatusText = (status) => {
        if (status) {
            const { text, statusOk, statusWarning, statusDanger } = styles;
            let style;
            switch (status.code) {
                case 'on_schedule':
                case 'finished':
                    style = [text, statusOk];
                    break;
                case 'behind_schedule':
                    style = [text, statusWarning];
                    break;
                case 'stopped':
                case 'paused':
                case 'excluded':
                    style = [text, statusDanger];
                    break;
                default:
                    style = text;
            }
            return (
                <Text style={style}>
                    {status.name}
                </Text>
            );
        }
    };

    render() {
        const { name, company_name, status, technologicalDirections, start_next_year } = this.props.project;

        const { row, borderBottom, fontSize22, nameCol, companyCol, statusCol, techCol, borderRight, text, textBlue } = styles;

        return (
            <View style={[row, borderBottom]}>
                <TouchableOpacity style={[nameCol, borderRight]} onPress={this.onProjectPress.bind(this)}>
                    <Text style={[text, textBlue]}>
                        {name}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[companyCol, borderRight]} onPress={this.onCompanyPress.bind(this)}>
                    <Text style={[text, textBlue]}>
                        {company_name}
                    </Text>
                </TouchableOpacity>
                <View style={[statusCol, borderRight]}>
                    {this.renderStatusText(status)}
                </View>
                <View style={[techCol, borderRight]}>
                    <Text style={text}>
                        {technologicalDirections}
                    </Text>
                </View>
            </View>
        );
    }
}

export default ProjectListItem;
