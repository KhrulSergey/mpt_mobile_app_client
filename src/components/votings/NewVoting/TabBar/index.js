import React, { PureComponent } from 'react';
import { Header } from '../../../common';
import TabBarButton from './TabBarButton';

import styles from './styles';

class TabBar extends PureComponent {
    render() {
        const { step, actionType } = this.props;
        const { container } = styles;

        return (
            <Header style={container}>
                <TabBarButton tab={1} step={step} actionType={actionType} />
                <TabBarButton tab={2} step={step} actionType={actionType} />
                <TabBarButton tab={3} step={step} actionType={actionType} />
                <TabBarButton tab={4} step={step} actionType={actionType} />
            </Header>
        );
    }
}

export { TabBar };
