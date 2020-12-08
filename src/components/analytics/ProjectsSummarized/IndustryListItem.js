import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getDeclinedUnit } from '../../../constants/util';
import { Text } from '../../common';
import { store } from '../../../configureStore';
import { isNumeric } from '../../../constants/util';

import styles from './styles';

class IndustryListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.cases = { nom: 'проект', gen: 'проекта', plu: 'проектов' };
    }

    goToProjects = ({ status, industries, projectGroup }) => {
        const { selected: regions } = store.getState().mapRegionFilter;
        Actions.projects({
            params: { statuses: status ? [status] : [], industries, regions, projectGroup, requested_at: Date.now(), doNotApplyIndustryFilter: true }
        });
    };

    render() {
        const { industry, statuses, projectGroup, projectGroupCodeIsImport } = this.props;

        const { row, borderBottom, header, container, industryCol, importCol, industryWideCol, projectNumCol, borderRight, text, textWhite, statusOk, statusWarning, statusDanger, textBlue } = styles;

        const industryColStyle = projectGroupCodeIsImport ? industryCol : industryWideCol;

        if (industry) {
            const { name, import_fact, import_plan, projects_num_ok, projects_num_warning, projects_num_danger, projects_num_planning } = industry;
            return (
                <View style={[row, borderBottom]}>
                    <TouchableOpacity style={[container, industryColStyle, borderRight]} onPress={this.goToProjects.bind(this, { industries: [industry], projectGroup })}>
                        <Text style={[text, textBlue]}>
                            {name}
                        </Text>
                    </TouchableOpacity>
                    {projectGroupCodeIsImport &&
                        <View style={[container, importCol, borderRight]}>
                            {isNumeric(import_fact) &&
                                <Text style={text}>
                                    Факт: {import_fact}%
                                </Text>
                            }
                            {isNumeric(import_plan) &&
                                <Text style={text}>
                                    План: {import_plan}%
                                </Text>
                            }
                        </View>
                    }
                    <TouchableOpacity style={[container, projectNumCol, borderRight]} onPress={this.goToProjects.bind(this, { status: statuses.on_schedule, industries: [industry], projectGroup })}>
                        <Text style={[text, statusOk]}>
                            {projects_num_ok} {getDeclinedUnit(projects_num_ok, this.cases)}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[container, projectNumCol, borderRight]} onPress={this.goToProjects.bind(this, { status: statuses.behind_schedule, industries: [industry], projectGroup })}>
                        <Text style={[text, statusWarning]}>
                            {projects_num_warning} {getDeclinedUnit(projects_num_warning, this.cases)}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[container, projectNumCol, borderRight]} onPress={this.goToProjects.bind(this, { status: statuses.paused, industries: [industry], projectGroup })}>
                        <Text style={[text, statusDanger]}>
                            {projects_num_danger} {getDeclinedUnit(projects_num_danger, this.cases)}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[container, projectNumCol]} onPress={this.goToProjects.bind(this, { status: statuses.planning, industries: [industry], projectGroup })}>
                        <Text style={text}>
                            {projects_num_planning} {getDeclinedUnit(projects_num_planning, this.cases)}
                        </Text>
                    </TouchableOpacity>
                </View>
            ); 
        }
        return (
            <View style={[row, header]}>
                <View style={[container, industryColStyle]}>
                    <Text style={[text, textWhite]}>
                        Отрасли
                    </Text>
                </View>
                {projectGroupCodeIsImport &&
                    <View style={[container, importCol]}>
                        <Text style={[text, textWhite]}>
                            Доля импорта
                        </Text>
                    </View>
                }
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

export default IndustryListItem;
