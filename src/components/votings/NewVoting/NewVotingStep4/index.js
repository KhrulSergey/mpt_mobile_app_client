import React, { PureComponent } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { storeVoting, updateVoting } from '../../../../actions';
import Voting from '../../Voting';
import { Button, Footer } from '../../../common';

import styles from './styles';

class NewVotingStep4 extends PureComponent {
    onPublish = () => {
        const { voting, regionsFilter, industriesFilter, companiesFilter, actionType, storeVoting, updateVoting } = this.props;
        const votingData = { ...voting.data, filters: { regions: regionsFilter.selected, industries: industriesFilter.selected, companies: companiesFilter.selected } };
        if (actionType === 'create') {
            storeVoting(votingData);
        } else if (actionType === 'edit') {
            updateVoting(votingData);
        }
    };

    render() {
        const { voting, actionType } = this.props;
        const { storing, updating } = voting;

        const { flexWrapper, footer, footerButton } = styles;

        return (
            <View style={flexWrapper}>
                <ScrollView>
                    <View>
                        <Voting preview />
                    </View>
                </ScrollView>
                <Footer style={footer}>
                    {actionType === 'create' ?
                        <Button style={footerButton} onPress={this.onPublish.bind(this)} loading={storing} loadingText='Опубликовываем...'>
                            Опубликовать
                        </Button>
                        :
                        <Button style={footerButton} onPress={this.onPublish.bind(this)} loading={updating} loadingText='Обновляем...'>
                            Применить изменения
                        </Button>
                    }
                </Footer>
            </View>
        );
    }
}

export default connect(null, { storeVoting, updateVoting })(NewVotingStep4);
