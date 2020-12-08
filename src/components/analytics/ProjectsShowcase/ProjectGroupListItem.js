import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getDeclinedUnit } from '../../../constants/util';
import { Text } from '../../common';
import { store } from '../../../configureStore';
// import { renderTitle } from '../../../Router';

import styles from './styles';

class ProjectGroupListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.cases = { nom: 'проект', gen: 'проекта', plu: 'проектов' };
    }

    goToProjectsSummarized = (projectGroup) => {
        const { selected: regions } = store.getState().mapRegionFilter;
        const { selected: industries } = store.getState().mapIndustryFilter;
        Actions.projectsSummarized({
            params: { industries, regions, projectGroup },
            // renderTitle: renderTitle({ title: projectGroup.name })
        });
    };

    render() {
        const { projectGroup } = this.props;

        const { row, borderBottom, header, container, projectGroupCol, projectNumCol, borderRight, text, textWhite, statusOk, statusWarning, statusDanger, textBlue } = styles;

        if (projectGroup) {
            const { name, projects_num_ok, projects_num_warning, projects_num_danger, projects_num_planning } = projectGroup;
            return (
                <View style={[row, borderBottom]}>
                    <TouchableOpacity style={[container, projectGroupCol, borderRight]} onPress={this.goToProjectsSummarized.bind(this, projectGroup)}>
                        <Text style={[text, textBlue]}>
                            {name}
                        </Text>
                    </TouchableOpacity>
                    <View style={[container, projectNumCol, borderRight]}>
                        <Text style={[text, statusOk]}>
                            {projects_num_ok} {getDeclinedUnit(projects_num_ok, this.cases)}
                        </Text>
                    </View>
                    <View style={[container, projectNumCol, borderRight]}>
                        <Text style={[text, statusWarning]}>
                            {projects_num_warning} {getDeclinedUnit(projects_num_warning, this.cases)}
                        </Text>
                    </View>
                    <View style={[container, projectNumCol, borderRight]}>
                        <Text style={[text, statusDanger]}>
                            {projects_num_danger} {getDeclinedUnit(projects_num_danger, this.cases)}
                        </Text>
                    </View>
                    <View style={[container, projectNumCol]}>
                        <Text style={text}>
                            {projects_num_planning} {getDeclinedUnit(projects_num_planning, this.cases)}
                        </Text>
                    </View>
                </View>
            ); 
        }
        return (
            <View style={[row, header]}>
                <View style={[container, projectGroupCol]}>
                    <Text style={[text, textWhite]}>
                        Группа проектов
                    </Text>
                </View>
                <View style={[container, projectNumCol]}>
                    <Text style={[text, textWhite]}>
                        Реализуется по графику
                    </Text>
                </View>
                <View style={[container, projectNumCol]}>
                    <Text style={[text, textWhite]}>
                        Столкнулись с проблемами
                    </Text>
                </View>
                <View style={[container, projectNumCol]}>
                    <Text style={[text, textWhite]}>
                        Реализация приостановлена
                    </Text>
                </View>
                <View style={[container, projectNumCol]}>
                    <Text style={[text, textWhite]}>
                        Планируется к реализации
                    </Text>
                </View>
            </View>
        );
    }
}

export default ProjectGroupListItem;
