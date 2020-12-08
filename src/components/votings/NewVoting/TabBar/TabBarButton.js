import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { changeVotingCurrentStep } from '../../../../actions';
import { Text } from '../../../common';

import styles from './styles';

class TabBarButton extends PureComponent {
    getTabLabel = (tab) => {
        switch (tab) {
            case 1:
                return 'Название голосования';
            case 2:
                return 'Перечень вопросов';
            case 3:
                return 'Фильтр голосования';
            case 4:
                return 'Предпросмотр и публикация';
            default:
                return null;
        }
    };

    goToTab = (tab, step) => {
        if (step === 0) return null;
        this.props.changeVotingCurrentStep(tab);
    };

    render() {
        const { step, tab, stepCompleted, actionType } = this.props;
        const { tabBarButton, tabBarButtonActive, tabBarButtonText, tabBarButtonTextDisabled, borderRight, stepText } = styles;
        const tabBarButtonTextEnabledCondition = actionType === 'edit' || tab === 1 || step !== 1;

        return (
            <View style={[tabBarButton, step === tab || step === 0 && tab === 1 ? tabBarButtonActive : null, tab !== 4 ? borderRight : null]}>
                <TouchableOpacity onPress={this.goToTab.bind(this, tab, stepCompleted)}>
                    <Text style={[stepText, tabBarButtonTextEnabledCondition ? tabBarButtonText : tabBarButtonTextDisabled]}>Шаг {tab}</Text>
                    <Text style={tabBarButtonTextEnabledCondition ? tabBarButtonText : tabBarButtonTextDisabled}>{this.getTabLabel(tab)}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect(null, { changeVotingCurrentStep })(TabBarButton);
